<?php

namespace App\Http\Controllers\Forum\Post;

use App\Constants\CategoryOptions;
use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadRead;
use App\EloquentModels\Log\LogUser;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Jobs\NotifyMentionsInPost;
use App\Jobs\NotifyThreadSubscribers;
use App\Logger;
use App\Providers\Service\ContentService;
use App\Providers\Service\ForumService;
use App\Providers\Service\ForumValidatorService;
use App\Providers\Service\PointsService;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\GroupRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Views\PostReportView;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostCrudController extends Controller {
    private $myForumService;
    private $myValidatorService;
    private $myPointsService;
    private $myContentService;
    private $myGroupRepository;
    private $myCategoryRepository;

    public function __construct(
        ForumService $forumService,
        ForumValidatorService $validatorService,
        PointsService $pointsService,
        ContentService $contentService,
        GroupRepository $groupRepository,
        CategoryRepository $categoryRepository
    ) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myValidatorService = $validatorService;
        $this->myPointsService = $pointsService;
        $this->myContentService = $contentService;
        $this->myGroupRepository = $groupRepository;
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getLatestPosts(Request $request, $page) {
        $user = $request->get('auth');
        $perPage = 20;

        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $ignoredCategoryIds = array_merge(
            IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->myForumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId)
        );
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');

        $latestPosts = $this->myForumService->getLatestPosts(
            $categoryIds,
            $ignoredThreadIds,
            $ignoredCategoryIds,
            $perPage,
            PaginationUtil::getOffset($page, $perPage)
        );
        $total = PaginationUtil::getTotalPages($latestPosts->total, $perPage);

        foreach ($latestPosts->data as $post) {
            $post->isRead = ThreadRead::where('userId', $user->userId)->where('threadId', $post->threadId)
                    ->where('updatedAt', '>', $post->createdAt)->count() > 0;
        }

        return response()->json(
            [
                'page' => $page,
                'total' => $total,
                'items' => $latestPosts->data
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $postId
     *
     * @return JsonResponse
     */
    public function getEditHistory(Request $request, $postId) {
        $user = $request->get('auth');
        $post = Post::find($postId);

        Condition::precondition(!$post, 404, 'No post with that ID exists!');
        Condition::precondition(
            !PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_EDIT_OTHERS_POSTS,
                $post->thread->categoryId
            ),
            400,
            'You do not have permission to see this!'
        );

        $updatedThreadAction = LogType::getAction(LogType::UPDATED_THREAD);
        $updatedPostAction = LogType::getAction(LogType::UPDATED_POST);
        $actions = $post->postId == $post->thread->firstPostId ? [$updatedThreadAction, $updatedPostAction] : [$updatedPostAction];
        $logs = LogUser::where('contentId', $postId)
            ->whereIn('action', $actions)
            ->get()
            ->map(
                function ($log) {
                    $data = json_decode($log->data);
                    return [
                        'user' => UserHelper::getSlimUser($log->userId),
                        'before' => $data->oldContent,
                        'beforeParsed' => $this->myContentService->getParsedContent($data->oldContent),
                        'after' => $data->newContent,
                        'afterParsed' => $this->myContentService->getParsedContent($data->newContent),
                        'createdAt' => $log->createdAt->timestamp
                    ];
                }
            );


        return response()->json($logs);
    }

    /**
     * @param  Request  $request
     *
     * @param  ThreadCrudController  $threadCrudController
     *
     * @return JsonResponse
     */
    public function createReportPost(Request $request, ThreadCrudController $threadCrudController) {
        $user = $request->get('auth');
        $postId = $request->input('postId');
        $message = $request->input('message');

        $post = Post::find($postId);
        Condition::precondition(!$post, 404, 'Post does not exist!');
        Condition::precondition(!isset($message) || empty($message), 400, 'Message can not be empty!');

        $threadSkeleton = PostReportView::of($user, $post, $message);
        $reportCategories = Category::isReportCategory()->get();

        foreach ($reportCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadCrudController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), LogType::REPORTED_A_POST);
        return response()->json();
    }

    /**
     * Put request to perform an update on an existing post
     *
     * @param  Request  $request
     * @param $postId
     *
     * @return JsonResponse
     */
    public function updatePost(Request $request, $postId) {
        $user = $request->get('auth');
        $postModel = (object) $request->input('post');

        $post = Post::find($postId);
        Condition::precondition(!$post, 404, 'Post can\'t be found!');

        $threadId = $post->threadId;
        $thread = Thread::where('threadId', $threadId)->first(['threadId', 'categoryId', 'title']);
        Condition::precondition(!$thread, 404, 'Thread can\'t be found!');
        Condition::precondition(empty($postModel->content), 400, 'Content can\'t be empty!');

        $canUpdatePost = $post->userId == $user->userId ||
            PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_EDIT_OTHERS_POSTS, $thread->categoryId);
        Condition::precondition(!$canUpdatePost, 550, 'You don\'t have permission to update this post!');

        $oldContent = $post->content;
        $post->content = $postModel->content;
        $post->save();

        NotifyMentionsInPost::dispatch($postModel->content, $postId, $user->userId);
        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_POST,
            [
                'thread' => $thread->title,
                'postId' => $postId,
                'oldContent' => $oldContent,
                'newContent' => $postModel->content
            ],
            $postId
        );
        return response()->json($post);
    }

    /**
     * Post request to create a post in given thread
     *
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function createPost(Request $request, $threadId) {
        $user = $request->get('auth');
        $content = $request->input('content');
        $toggleThread = $request->input('toggleThread');
        $contentNeedApproval = $this->myGroupRepository->doUsersContentNeedApproval($user->userId);

        $postedInRecently = Post::where('threadId', $threadId)
            ->where('userId', $user->userId)
            ->where('createdAt', '>', $this->nowMinus15)
            ->count('postId');

        Condition::precondition($postedInRecently > 0, 550, 'You are posting to quick!');

        $thread = Thread::with('category')->where('threadId', $threadId)->first();

        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $thread->categoryId,
            'No permissions to access this category!'
        );

        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $thread->categoryId,
            'No permissions to post!',
            550
        );

        if ($thread->userId != $user->userId) {
            PermissionHelper::haveForumPermissionWithException(
                $user->userId,
                CategoryPermissions::CAN_POST_IN_OTHERS_THREADS,
                $thread->categoryId,
                'You can not post in other users threads',
                550
            );
        }

        $canPost = ($thread->isOpen ||
                PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_CLOSE_OPEN_THREAD, $thread->categoryId)
            )
            && $thread->categoryIsOpen;
        Condition::precondition(!$canPost, 550, 'Thread or category is closed, no permission to post!');
        Condition::precondition(empty($content), 550, 'Content can\'t be empty!');

        if ($toggleThread &&
            PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_CLOSE_OPEN_THREAD, $thread->categoryId)
        ) {
            $thread->isOpen = !$thread->isOpen;
        }

        if (!$this->myForumService->doCategoryHaveOption($thread->categoryId, CategoryOptions::POSTS_DONT_COUNT) && !$contentNeedApproval) {
            $user->posts++;
            $user->save();
        }

        $post = new Post(
            [
                'threadId' => $threadId,
                'userId' => $user->userId,
                'content' => $content,
                'isApproved' => !$contentNeedApproval
            ]
        );
        $post->save();

        NotifyMentionsInPost::dispatch($content, $post->postId, $user->userId);
        NotifyThreadSubscribers::dispatch($threadId, $post->userId, $post->postId);

        if ($contentNeedApproval) {
            return response()->json();
        }

        $thread->lastPostId = $post->postId;
        $thread->posts++;
        $thread->save();

        $this->myForumService->updateReadThread($thread->threadId, $user->userId);
        $this->myForumService->updateReadCategory($thread->categoryId, $user->userId);
        $this->myForumService->updateLastPostIdOnCategory($thread->categoryId);
        $this->myPointsService->givePointsFromCategory($user->userId, $thread->categoryId);

        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::CREATED_POST,
            [
                'thread' => $thread->title,
                'threadId' => $thread->threadId,
                'categoryId' => $thread->categoryId
            ],
            $post->postId
        );
        return response()->json($post, 201);
    }
}
