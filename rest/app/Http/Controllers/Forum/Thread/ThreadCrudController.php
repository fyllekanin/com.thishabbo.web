<?php

namespace App\Http\Controllers\Forum\Thread;

use App\Constants\CategoryOptions;
use App\Constants\CategoryTemplates;
use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\Constants\User\UserIgnoredNotifications;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\ForumPermission;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Prefix;
use App\EloquentModels\Forum\TemplateData;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadBan;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadRead;
use App\EloquentModels\Forum\ThreadSubscription;
use App\EloquentModels\Forum\ThreadTemplate;
use App\EloquentModels\User\User;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Jobs\NotifyCategorySubscribers;
use App\Jobs\NotifyMentionsInPost;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Providers\Service\ForumValidatorService;
use App\Providers\Service\PointsService;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\GroupRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use App\Utils\Value;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThreadCrudController extends Controller {
    private $myForumService;
    private $myValidatorService;
    private $myPointsService;
    private $myGroupRepository;
    private $myCategoryRepository;

    public function __construct(
        ForumService $forumService,
        ForumValidatorService $validatorService,
        PointsService $pointsService,
        GroupRepository $groupRepository,
        CategoryRepository $categoryRepository
    ) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myValidatorService = $validatorService;
        $this->myPointsService = $pointsService;
        $this->myGroupRepository = $groupRepository;
        $this->myCategoryRepository = $categoryRepository;
    }

    /**
     * @param $threadId
     * @param $page
     *
     * @return JsonResponse
     */
    public function getPosters($threadId, $page) {
        $query = $this->getTopPostersQuery($threadId);
        $total = PaginationUtil::getTotalPages($query->count());

        return response()->json(
            [
                'total' => $total,
                'page' => $page,
                'items' => $query->take($this->perPage)
                    ->skip(PaginationUtil::getOffset($page))
                    ->get()
                    ->map(
                        function ($item) {
                            return [
                                'user' => UserHelper::getSlimUser($item->userId),
                                'posts' => $item->amount
                            ];
                        }
                    )
            ]
        );
    }

    /**
     * @param  Request  $request
     * @param $page
     *
     * @return JsonResponse
     */
    public function getLatestThreads(Request $request, $page) {
        $user = $request->get('auth');
        $perPage = 20;

        $threadSql = $this->getLatestThreadsQuery($user);
        $total = PaginationUtil::getTotalPages($threadSql->count('threadId'));

        return response()->json(
            [
                'page' => $page,
                'total' => $total,
                'items' => $threadSql->take($perPage)->skip(PaginationUtil::getOffset($page, $perPage))->get()->map(
                    function ($thread) use ($user) {
                        return [
                            'categoryId' => $thread->categoryId,
                            'style' => isset($thread->prefix) ? $thread->prefix->style : '',
                            'text' => isset($thread->prefix) ? $thread->prefix->text : '',
                            'threadId' => $thread->threadId,
                            'title' => $thread->title,
                            'user' => UserHelper::getSlimUser($thread->userId),
                            'isRead' => ThreadRead::where('userId', $user->userId)->where('threadId', $thread->threadId)->count() > 0,
                            'createdAt' => $thread->createdAt->timestamp
                        ];
                    }
                )
            ]
        );
    }

    /**
     * Post request to create a new thread
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function createThread(Request $request) {
        $user = $request->get('auth');
        $thumbnail = $request->file('thumbnail');
        $threadSkeleton = json_decode($request->input('thread'));

        return $this->doThread($user, $thumbnail, $threadSkeleton, $request);
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function updateThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thumbnail = $request->file('thumbnail');
        $threadSkeleton = json_decode($request->input('thread'));
        $category = Category::where('categoryId', $threadSkeleton->categoryId)->first(['template', 'options']);

        Condition::precondition(!$category, 404, 'Category do not exist');
        Condition::precondition(
            ThreadBan::where('threadId', $threadId)->where('userId', $user->userId)->count() > 0,
            400,
            'You are banned from this thread'
        );

        $isPrefixMandatory = $category->options & CategoryOptions::PREFIX_MANDATORY;
        $havePrefix = isset($threadSkeleton->prefixId) && $threadSkeleton->prefixId > 0;
        Condition::precondition(
            $isPrefixMandatory && !$havePrefix,
            400,
            'Prefix is mandatory'
        );

        $this->myValidatorService->validateCreateUpdateThread($user, $threadSkeleton, $category, $request);
        $thread = Thread::find($threadId);

        if (!PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_EDIT_OTHERS_POSTS, $thread->categoryId)) {
            Condition::precondition(
                $thread && $thread->userId != $user->userId,
                403,
                'You don\'t have permission to edit someone elses thread in here'
            );
        }

        $oldContent = $thread->firstPost->content;
        $thread->firstPost->content = $threadSkeleton->content;
        $thread->firstPost->save();

        $thread->title = $threadSkeleton->title;
        $thread->prefixId = isset($threadSkeleton->prefixId) ? $threadSkeleton->prefixId : 0;
        $thread->touch();
        $thread->save();

        NotifyMentionsInPost::dispatch($threadSkeleton->content, $thread->firstPostId, $user->userId);
        if ($category->template !== CategoryTemplates::DEFAULT) {
            $this->uploadFileAndCreateTemplateData($threadSkeleton, $thumbnail, $threadId, $request->hasFile('thumbnail'));
        }

        $this->createOrUpdatePoll($thread, $threadSkeleton);
        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::UPDATED_THREAD,
            [
                'thread' => $thread->title,
                'postId' => $thread->firstPostId,
                'oldContent' => $oldContent,
                'newContent' => $thread->firstPost->content
            ],
            $thread->threadId
        );
        return $this->getThreadController($request, $thread->categoryId, $thread->threadId);
    }

    /**
     * Get request to get the resource for creating a new thread or updating existing
     *
     * @param  Request  $request
     * @param $categoryId
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function getThreadController(Request $request, $categoryId, $threadId) {
        $user = $request->get('auth');
        $category = Category::find($categoryId);

        Condition::precondition(!$category, 404, 'No category with that ID');
        Condition::precondition(
            ThreadBan::where('threadId', $threadId)->where('userId', $user->userId)->count() > 0,
            400,
            'You are banned from this thread'
        );
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $categoryId,
            'No permissions to access this category'
        );
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_CREATE_THREADS,
            $categoryId,
            'No permissions to create threads in this category'
        );

        $newThread = $this->getNewThread($this->myForumService, $categoryId);
        $existingThread = Thread::find($threadId);
        $thread = $existingThread ? $existingThread : $newThread;

        if ($existingThread) {
            $thread->append('template')
                ->append('content')
                ->append('badges')
                ->append('tags')
                ->append('roomLink')
                ->makeHidden('category');
        } else {
            $thread->template = Category::find($categoryId)->template;
            $thread->threadTemplates = ThreadTemplate::availableForCategory($thread->categoryId)->get(['name', 'content']);
        }

        if (!PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_EDIT_OTHERS_POSTS, $thread->categoryId)) {
            Condition::precondition(
                $thread && isset($thread->createdAt) && $thread->userId != $user->userId,
                403,
                'You don\'t have permission to edit someone elses thread in here'
            );
        }

        $thread->prefixes = Prefix::availableForCategory($thread->categoryId)->orderBy('text', 'ASC')->get(['prefixId', 'text']);
        $thread->forumPermissions = $this->myForumService->getForumPermissionsForUserInCategory($user->userId, $categoryId);
        $thread->poll = $this->myForumService->getThreadPoll($thread, $user->userId);
        $thread->canHavePoll = $category->options & CategoryOptions::THREADS_CAN_HAVE_POLLS;

        return response()->json($thread);
    }

    /**
     * Get request to fetch a thread resource
     *
     * @param  Request  $request
     * @param $threadId
     * @param  int  $page
     *
     * @param  null  $postedByUser
     *
     * @return JsonResponse
     */
    public function getThreadPage(Request $request, $threadId, $page = 1, $postedByUser = null) {
        $user = $request->get('auth');
        $thread = Condition::requireNotNull(Thread::find($threadId), 'Thread does not exist');
        $thread->page = $page;

        $postedBy = $postedByUser ? Condition::requireNotNull(User::withNickname($postedByUser)->first(), 'No user with nickname') : null;
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_VIEW_THREAD_CONTENT, $thread->categoryId),
            403,
            'You can not view thread content'
        );
        Condition::precondition(
            $thread->userId != $user->userId &&
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_VIEW_OTHERS_THREADS, $thread->categoryId),
            403,
            'You can not view others thread content'
        );
        $forumPermissions = $this->myForumService->getForumPermissionsForUserInCategory($user->userId, $thread->categoryId);

        $this->canUserAccessThread($user, $thread);
        $this->myForumService->updateReadCategory($thread->categoryId, $user->userId);
        $this->myForumService->updateReadThread($thread->threadId, $user->userId);

        $total = Post::where('threadId', $thread->threadId)
            ->where('isApproved', ($forumPermissions->canApprovePosts ? '>=' : '>'), 0)
            ->count('postId');
        $thread->loadThreadPosts($user, $page, $postedBy, $this->perPage, $forumPermissions);
        $thread->append('categoryIsOpen');
        $thread->appendTemplateRelatedData($user);

        return response()->json(
            [
                'threadId' => $thread->threadId,
                'categoryId' => $thread->categoryId,
                'title' => $thread->title,
                'isOpen' => $thread->isOpen,
                'isApproved' => $thread->isApproved,
                'firstPostId' => $thread->firstPostId,
                'isSticky' => $thread->isSticky,
                'prefixId' => $thread->prefixId,
                'createdAt' => $thread->createdAt->timestamp,
                'updatedAt' => $thread->updatedAt->timestamp,
                'page' => $page,
                'forumPermissions' => $forumPermissions,
                'total' => $postedBy ?
                    $this->getThreadPostTotalByUser($thread->threadId, $user->userId, $forumPermissions->canApprovePosts) :
                    PaginationUtil::getTotalPages($total),
                'isSubscribed' => ThreadSubscription::where('userId', $user->userId)->where('threadId', $threadId)->count('threadId') > 0,
                'poll' => $this->myForumService->getThreadPoll($thread, $user->userId),
                'isIgnored' => IgnoredThread::where('userId', $user->userId)->where('threadId', $thread->threadId)->count('threadId') > 0,
                'template' => $thread->category->template,
                'readers' => $this->getThreadReaders($thread->threadId, 0),
                'currentReaders' => $this->getThreadReaders($thread->threadId, time() - 600),
                'parents' => $this->myForumService->getCategoryParents($thread),
                'categoryIsOpen' => $thread->categoryIsOpen,
                'user' => UserHelper::getSlimUser($thread->userId),
                'threadPosts' => $thread->threadPosts,
                'tags' => isset($thread->tags) ? $thread->tags : null,
                'badges' => isset($thread->badges) ? $thread->badges : null,
                'roomLink' => isset($thread->roomLink) ? $thread->roomLink : null,
                'isBadgesCompleted' => isset($thread->isBadgesCompleted) ? $thread->isBadgesCompleted : null
            ]
        );
    }

    /**
     * @param $user
     * @param $thumbnail
     * @param $threadSkeleton
     * @param  Request  $request
     * @param  bool  $skipValidation
     *
     * @return JsonResponse
     */
    public function doThread($user, $thumbnail, $threadSkeleton, $request, $skipValidation = false) {
        $category = Category::where('categoryId', $threadSkeleton->categoryId)->first(['template', 'options', 'isOpen']);
        $contentNeedApproval = $this->myGroupRepository->doUsersContentNeedApproval($user->userId);
        $prefixId = Value::objectProperty($threadSkeleton, 'prefixId', 0);
        $this->createThreadConditions($category, $prefixId);

        if (!$skipValidation) {
            $this->myValidatorService->validateCreateUpdateThread($user, $threadSkeleton, $category, $request);
        }

        $post = new Post(
            [
                'threadId' => -1,
                'userId' => $user->userId,
                'content' => $threadSkeleton->content
            ]
        );
        $post->save();

        $isApproved = !(($category->options & CategoryOptions::THREADS_NEED_APPROVAL || $contentNeedApproval) && !$skipValidation);
        $thread = new Thread(
            [
                'categoryId' => $threadSkeleton->categoryId,
                'title' => $threadSkeleton->title,
                'userId' => $user->userId,
                'firstPostId' => $post->postId,
                'lastPostId' => $post->postId,
                'isApproved' => $isApproved,
                'prefixId' => $prefixId
            ]
        );
        $thread->save();

        $post->threadId = $thread->threadId;
        $post->save();

        if ($user->userId > 0) {
            $user->threads++;
            $user->posts++;
            $user->save();

            $this->myPointsService->givePointsFromCategory($user->userId, $thread->categoryId);
        }

        NotifyMentionsInPost::dispatch($threadSkeleton->content, $post->postId, $user->userId);

        if ($category->template == CategoryTemplates::QUEST && !$skipValidation) {
            $this->uploadFileAndCreateTemplateData($threadSkeleton, $thumbnail, $thread->threadId, $request->hasFile('thumbnail'));
        }

        if ($user->userId > 0 && !($user->ignoredNotifications & UserIgnoredNotifications::AUTO_SUBSCRIBE_THREAD)) {
            $newSubscription = new ThreadSubscription(
                [
                    'userId' => $user->userId,
                    'threadId' => $thread->threadId
                ]
            );
            $newSubscription->save();
        }

        $this->logThreadCreation($thread, $request, $user);
        $this->createThreadPoll($thread, $threadSkeleton);
        $this->myForumService->postSiteMessageIfApplicable($thread);
        $this->myForumService->updateLastPostIdOnCategory($thread->categoryId);
        $this->myForumService->updateReadCategory($thread->categoryId, $user->userId);
        $this->myForumService->updateReadThread($thread->threadId, $user->userId);
        NotifyCategorySubscribers::dispatch($thread->categoryId, $thread->userId, $thread->threadId);
        return response()->json(
            [
                'threadId' => $thread->threadId,
                'isApproved' => $thread->isApproved
            ],
            201
        );
    }

    private function logThreadCreation($thread, $request, $user) {
        Logger::user(
            $user->userId,
            ($request ? $request->ip() : ''),
            LogType::CREATED_THREAD,
            [
                'thread' => $thread->title,
                'threadId' => $thread->threadId,
                'categoryId' => $thread->categoryId
            ],
            $thread->threadId
        );
    }

    /**
     * Upload given thumbnail for a thread with correct name to correspond with thread
     *
     * @param $threadSkeleton
     * @param $thumbnail
     * @param $threadId
     * @param $hasFile
     */
    private function uploadFileAndCreateTemplateData($threadSkeleton, $thumbnail, $threadId, $hasFile) {
        if ($hasFile) {
            $fileName = $threadId.'.gif';
            $target = base_path('/resources/images/thumbnails');
            $thumbnail->move($target, $fileName);
        }

        if (!empty($threadSkeleton->badges)) {
            $templateData = TemplateData::where('threadId', $threadId)->first();
            if ($templateData) {
                $templateData->badges = json_encode($threadSkeleton->badges);
                $templateData->tags = implode(',', $threadSkeleton->tags);
                $templateData->roomLink = Value::objectProperty($threadSkeleton, 'roomLink', '');
                $templateData->save();
            } else {
                TemplateData::create(
                    [
                        'threadId' => $threadId,
                        'badges' => json_encode($threadSkeleton->badges),
                        'tags' => implode(',', $threadSkeleton->tags),
                        'roomLink' => Value::objectProperty($threadSkeleton, 'roomLink', '')
                    ]
                );
            }
        }
    }

    /**
     * Required validation for creating a thread. Welcome bot skips the heavy validation
     * so this minimum requirement is made for stupid developers to not screw up.
     *
     * @param $category
     * @param $havePrefix
     */
    private function createThreadConditions($category, $havePrefix) {
        Condition::precondition(!$category, 404, 'Category do not exist');
        Condition::precondition($category->isOpen == 0, 400, 'Category is closed');

        $isPrefixMandatory = $category->options & CategoryOptions::PREFIX_MANDATORY;
        Condition::precondition($isPrefixMandatory && !$havePrefix, 400, 'Prefix is mandatory');
    }

    private function getNewThread(ForumService $forumService, $categoryId) {
        $thread = new Thread();
        $thread->threadId = -1;
        $thread->categoryId = $categoryId;
        $thread->content = '';
        $thread->parents = $forumService->getCategoryParents($thread);
        return $thread;
    }

    private function createOrUpdatePoll($thread, $threadSkeleton) {
        if (!$thread->poll) {
            $this->createThreadPoll($thread, $threadSkeleton);
        }
        if ($thread->poll && $threadSkeleton->poll) {
            $thread->poll->isResultPublic = $threadSkeleton->poll->isPublic;
            $thread->poll->save();
        }
    }

    private function createThreadPoll($thread, $threadSkeleton) {
        if (!isset($threadSkeleton->poll)) {
            return;
        }
        $threadPoll = new ThreadPoll(
            [
                'threadId' => $thread->threadId,
                'question' => $threadSkeleton->poll->question,
                'options' => json_encode($threadSkeleton->poll->answers),
                'isResultPublic' => isset($threadSkeleton->poll->isPublic) ? $threadSkeleton->poll->isPublic : false
            ]
        );
        $threadPoll->save();
    }

    private function getLatestThreadsQuery($user) {
        $categoryIds = $this->myCategoryRepository->getCategoryIdsWherePermission($user->userId, CategoryPermissions::CAN_READ);
        $ignoredCategoryIds = array_merge(
            IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->myForumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId)
        );
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');

        return Thread::whereIn('categoryId', $categoryIds)
            ->where('isApproved', 1)
            ->whereNotIn('categoryId', $ignoredCategoryIds)
            ->whereNotIn('threadId', $ignoredThreadIds)
            ->orderBy('createdAt', 'DESC');
    }

    private function getTopPostersQuery($threadId) {
        return Post::where('posts.threadId', $threadId)
            ->join('users', 'users.userId', '=', 'posts.userId')
            ->select('users.userId', DB::raw('COUNT(posts.postId) as amount'))
            ->groupBy('users.userId')
            ->orderBy(DB::raw('COUNT(posts.postId)'), 'DESC');
    }

    private function getThreadPostTotalByUser($threadId, $userId, $canApprovePosts) {
        return PaginationUtil::getTotalPages(
            Post::where('userId', $userId)->where('threadId', $threadId)
                ->isApproved($canApprovePosts)
                ->count('postId')
        );
    }

    private function canUserAccessThread($user, $thread) {
        $canAccessCategory = PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $thread->categoryId) &&
            (
            ForumPermission::where('categoryId', $thread->categoryId)
                ->where('groupId', 0)
                ->where('isAuthOnly', true)
                ->count() > 0 ? $user->userId > 0 : true
            );
        $cantAccessUnapproved = !$thread->isApproved &&
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_APPROVE_THREADS, $thread->categoryId);
        Condition::precondition(!$canAccessCategory, 403, 'No permissions to access this category');
        Condition::precondition($user->userId != $thread->userId && $cantAccessUnapproved, 400, 'You cant access a unapproved thread');
    }

    private function getThreadReaders($threadId, $lastRead) {
        return ThreadRead::where('threadId', $threadId)->where('updatedAt', '>', $lastRead)
            ->orderBy('updatedAt', 'DESC')
            ->get(['userId', 'updatedAt'])->map(
                function ($read) {
                    return [
                        'user' => UserHelper::getSlimUser($read->userId),
                        'time' => $read->updatedAt->timestamp
                    ];
                }
            );
    }
}
