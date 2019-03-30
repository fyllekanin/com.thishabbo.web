<?php

namespace App\Http\Controllers\Forum\Post;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Log\LogUser;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Forum\Thread\ThreadCrudController;
use App\Jobs\NotifyThreadSubscribers;
use App\Jobs\NotifyMentionsInPost;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Services\ForumValidatorService;
use App\Utils\BBcodeUtil;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostCrudController extends Controller {
    private $forumService;
    private $validatorService;

    /**
     * PostController constructor.
     *
     * @param ForumService          $forumService
     * @param ForumValidatorService $validatorService
     */
    public function __construct (ForumService $forumService, ForumValidatorService $validatorService) {
        parent::__construct();
        $this->forumService = $forumService;
        $this->validatorService = $validatorService;
    }

    /**
     * @param Request $request
     * @param         $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLatestPosts(Request $request, $page) {
        $user = UserHelper::getUserFromRequest($request);

        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);
        $ignoredCategoryIds = array_merge(IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->forumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId));
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');

        $latestPosts = $this->forumService->getLatestPosts($categoryIds, $ignoredThreadIds,
            $ignoredCategoryIds, $this->perPage, $this->getOffset($page));
        $total = ceil($latestPosts->total / $this->perPage);

        return response()->json([
            'page' => $page,
            'total' => $total,
            'items' => $latestPosts->data
        ]);
    }

    /**
     * @param Request $request
     * @param         $postId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEditHistory(Request $request, $postId) {
        $user = UserHelper::getUserFromRequest($request);
        $forumPermissions = ConfigHelper::getForumConfig();
        $post = Post::find($postId);

        Condition::precondition(!$post, 404, 'No post with that ID exists');
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, $forumPermissions->canEditOthersPosts,
            $post->thread->categoryId && $post->userId != $post->userId), 400, 'You do not have permission to see this');

        $updatedThreadAction = Action::getAction(Action::UPDATED_THREAD);
        $updatedPostAction = Action::getAction(Action::UPDATED_POST);
        $actions = $post->postId == $post->thread->firstPostId ? [$updatedThreadAction, $updatedPostAction] : [$updatedPostAction];
        $logs = LogUser::whereJson($postId, ['postId'])
            ->whereIn('action', $actions)
            ->get()
            ->map(function($log) {
                $data = json_decode($log->data);
                return [
                    'user' => UserHelper::getSlimUser($log->userId),
                    'before' => BBcodeUtil::bbcodeParser($data->oldContent),
                    'after' => BBcodeUtil::bbcodeParser($data->newContent),
                    'createdAt' => $log->createdAt->timestamp
                ];
            });


        return response()->json($logs);
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createReportPost(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $postId = $request->input('postId');
        $message = $request->input('message');

        $post = Post::find($postId);
        Condition::precondition(!$post, 404, 'Post do not exist');
        Condition::precondition(!isset($message) || empty($message), 400, 'Message can not be empty');

        $threadSkeleton = new \stdClass();
        $threadSkeleton->content = "[mention=" . $user->userId . "]" . $user->nickname . "[/mention] reported a post.

[b]User reported:[/b] [mention]@" . $post->user->nickname . "[/mention]
[b]Thread:[/b] [url=/forum/thread/1/page/1]Click here to go to thread.[/url]

[b]Reason:[/b]
[quote]" . $message . "[/quote]

[b]Original post:[/b]
[quote]" . $post->content . "[/quote]";
        $threadSkeleton->title = 'Report by ' . $user->nickname;

        $reportCategories = Category::whereRaw('(options & ' . ConfigHelper::getForumOptionsConfig()->reportPostsGoHere . ')')->get();
        $threadController = new ThreadCrudController($this->forumService, $this->validatorService);
        foreach ($reportCategories as $category) {
            $threadSkeleton->categoryId = $category->categoryId;
            $threadController->doThread($user, null, $threadSkeleton, null, true);
        }

        Logger::user($user->userId, $request->ip(), Action::REPORTED_A_POST);
        return response()->json();
    }

    /**
     * Put request to perform an update on an existing post
     *
     * @param Request $request
     * @param         $postId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePost (Request $request, $postId) {
        $user = UserHelper::getUserFromRequest($request);
        $postModel = (object)$request->input('post');

        $post = Post::where('postId', $postId)->first();
        $post->append('user');

        Condition::precondition(!$post, 404, 'Post cant be found');

        $threadId = $post->threadId;
        $thread = Thread::where('threadId', $threadId)->first(['threadId', 'categoryId', 'title']);
        Condition::precondition(!$thread, 404, 'Thread cant be found');
        Condition::precondition(empty($postModel->content), 400, 'Content can\'t be empty');

        $canUpdatePost = $post->userId == $user->userId ||
            PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canEditOthersPosts, $thread->categoryId);
        Condition::precondition(!$canUpdatePost, 550, 'You don\'t have permission to update this post');

        $oldContent = $post->content;
        $post->content = $postModel->content;
        $post->save();

        NotifyMentionsInPost::dispatch($postModel->content, $postId, $user->userId);
        Logger::user($user->userId, $request->ip(), Action::UPDATED_POST, [
            'thread' => $thread->title,
            'postId' => $postId,
            'oldContent' => $oldContent,
            'newContent' => $postModel->content
        ]);
        return response()->json($post);
    }

    /**
     * Post request to create a post in given thread
     *
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPost (Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $content = $request->input('content');
        $toggleThread = $request->input('toggleThread');
        $contentNeedApproval = PermissionHelper::haveGroupOption($user->userId, ConfigHelper::getGroupOptionsConfig()->contentNeedApproval);

        $postedInRecently = Post::where('threadId', $threadId)
            ->where('userId', $user->userId)
            ->where('createdAt', '>', $this->nowMinus15)
            ->count('postId');

        Condition::precondition($postedInRecently > 0, 550, 'You are posting to quick!');

        $thread = Thread::with('category')->where('threadId', $threadId)->first();

        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canRead, $thread->categoryId,
            'No permissions to access this category');

        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canRead, $thread->categoryId,
            'No permissions to post', 550);

        $canPost = ($thread->isOpen || PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canCloseOpenThread, $thread->categoryId))
            && $thread->categoryIsOpen;
        Condition::precondition(!$canPost, 550, 'Thread or category is closed, no permission to post');
        Condition::precondition(empty($content), 550, 'Content can\'t be empty');

        if ($toggleThread && PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canCloseOpenThread, $thread->categoryId)) {
            $thread->isOpen = !$thread->isOpen;
        }

        if (!PermissionHelper::haveForumOption($thread->categoryId, ConfigHelper::getForumOptionsConfig()->postsDontCount) && !$contentNeedApproval) {
            $user->posts++;
            $user->save();
        }

        $post = new Post([
            'threadId' => $threadId,
            'userId' => $user->userId,
            'content' => $content,
            'isApproved' => !$contentNeedApproval
        ]);
        $post->save();
        $post->append('user');

        NotifyMentionsInPost::dispatch($content, $post->postId, $user->userId);
        NotifyThreadSubscribers::dispatch($threadId, $post->userId, $post->postId);

        if ($contentNeedApproval) {
            return response()->json();
        }

        $thread->lastPostId = $post->postId;
        $thread->posts++;
        $thread->save();

        $this->forumService->updateReadThread($thread->threadId, $user->userId);
        $this->forumService->updateLastPostIdOnCategory($thread->categoryId);

        Logger::user($user->userId, $request->ip(), Action::CREATED_POST, ['thread' => $thread->title]);
        return response()->json($post, 201);
    }
}
