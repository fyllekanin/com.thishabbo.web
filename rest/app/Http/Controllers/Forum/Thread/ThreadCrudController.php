<?php

namespace App\Http\Controllers\Forum\Thread;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\IgnoredCategory;
use App\EloquentModels\Forum\IgnoredThread;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Prefix;
use App\EloquentModels\Forum\TemplateData;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadPoll;
use App\EloquentModels\Forum\ThreadPollAnswer;
use App\EloquentModels\Forum\ThreadRead;
use App\EloquentModels\Forum\ThreadSubscription;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Jobs\NotifyCategorySubscribers;
use App\Jobs\NotifyMentionsInPost;
use App\Jobs\NotifyThreadSubscribers;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Services\ForumValidatorService;
use App\Services\PointsService;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThreadCrudController extends Controller {
    private $categoryTemplates = null;

    private $forumService;
    private $validatorService;
    private $pointsService;

    /**
     * ThreadController constructor.
     * Fetch the available category templates and store in an instance variable
     *
     * @param ForumService $forumService
     * @param ForumValidatorService $validatorService
     * @param PointsService $pointsService
     */
    public function __construct(ForumService $forumService, ForumValidatorService $validatorService, PointsService $pointsService) {
        parent::__construct();
        $this->categoryTemplates = ConfigHelper::getCategoryTemplatesConfig();
        $this->forumService = $forumService;
        $this->validatorService = $validatorService;
        $this->pointsService = $pointsService;
    }

    /**
     * @param $threadId
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPosters($threadId, $page) {
        $query = Post::where('posts.threadId', $threadId)
            ->join('users', 'users.userId', '=', 'posts.userId')
            ->select('users.userId', DB::raw('COUNT(*) as amount'))
            ->groupBy('users.userId');
        $total = DataHelper::getPage($query->count());

        return response()->json([
            'total' => $total,
            'page' => $page,
            'items' => $query->take($this->perPage)
                ->skip(DataHelper::getOffset($page))
                ->get()
                ->map(function ($item) {
                    return [
                        'user' => UserHelper::getSlimUser($item->userId),
                        'posts' => $item->amount
                    ];
                })
        ]);
    }

    /**
     * @param Request $request
     * @param $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLatestThreads(Request $request, $page) {
        $user = $request->get('auth');
        $perPage = 20;

        $categoryIds = $this->forumService->getAccessibleCategories($user->userId);
        $ignoredCategoryIds = array_merge(IgnoredCategory::where('userId', $user->userId)->pluck('categoryId')->toArray(),
            $this->forumService->getCategoriesUserCantSeeOthersThreadsIn($user->userId));
        $ignoredThreadIds = IgnoredThread::where('userId', $user->userId)->pluck('threadId');

        $threadSql = Thread::whereIn('categoryId', $categoryIds)
            ->whereNotIn('categoryId', $ignoredCategoryIds)
            ->whereNotIn('threadId', $ignoredThreadIds)
            ->orderBy('createdAt', 'DESC');
        $total = DataHelper::getPage($threadSql->count('threadId'));

        return response()->json([
            'page' => $page,
            'total' => $total,
            'items' => $threadSql->take($perPage)->skip(DataHelper::getOffset($page, $perPage))->get()->map(function ($thread) {
                return [
                    'categoryId' => $thread->categoryId,
                    'style' => isset($thread->prefix) ? $thread->prefix->style : '',
                    'text' => isset($thread->prefix) ? $thread->prefix->text : '',
                    'threadId' => $thread->threadId,
                    'title' => $thread->title,
                    'user' => UserHelper::getSlimUser($thread->userId),
                    'createdAt' => $thread->createdAt->timestamp
                ];
            })
        ]);
    }

    /**
     * Post request to create a new thread
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createThread(Request $request) {
        $user = $request->get('auth');
        $thumbnail = $request->file('thumbnail');
        $threadSkeleton = json_decode($request->input('thread'));

        return $this->doThread($user, $thumbnail, $threadSkeleton, $request);
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thumbnail = $request->file('thumbnail');
        $threadSkeleton = json_decode($request->input('thread'));
        $category = Category::where('categoryId', $threadSkeleton->categoryId)->first(['template', 'options']);

        Condition::precondition(!$category, 404, 'Category do not exist');

        $isPrefixMandatory = $category->options & ConfigHelper::getForumOptionsConfig()->prefixMandatory;
        $havePrefix = isset($threadSkeleton->prefixId) && $threadSkeleton->prefixId > 0;
        Condition::precondition($isPrefixMandatory && !$havePrefix, 400,
            'Prefix is mandatory');

        $this->validatorService->validateCreateUpdateThread($user, $threadSkeleton, $category, $request);
        $thread = Thread::find($threadId);

        if (!PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canEditOthersPosts, $thread->categoryId)) {
            Condition::precondition($thread && $thread->userId != $user->userId, 403,
                'You don\'t have permission to edit someone elses thread in here');
        }

        $oldContent = $thread->firstPost->content;
        $thread->firstPost->content = $threadSkeleton->content;
        $thread->firstPost->save();

        $thread->title = $threadSkeleton->title;
        $thread->prefixId = isset($threadSkeleton->prefixId) ? $threadSkeleton->prefixId : 0;
        $thread->save();

        NotifyMentionsInPost::dispatch($threadSkeleton->content, $thread->firstPostId, $user->userId);
        if ($category->template !== $this->categoryTemplates->DEFAULT) {
            $this->uploadFileAndCreateTemplateData($threadSkeleton, $thumbnail, $threadId, $request->hasFile('thumbnail'));
        }

        if (!$thread->poll) {
            $this->createThreadPoll($thread, $threadSkeleton);
        }

        Logger::user($user->userId, $request->ip(), Action::UPDATED_THREAD, [
            'thread' => $thread->title,
            'postId' => $thread->firstPostId,
            'oldContent' => $oldContent,
            'newContent' => $thread->firstPost->content
        ], $thread->threadId);
        return $this->getThreadController($request, $thread->categoryId, $thread->threadId);
    }

    /**
     * Get request to get the resource for creating a new thread or updating existing
     *
     * @param Request $request
     * @param         $categoryId
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThreadController(Request $request
        , $categoryId, $threadId) {
        $user = $request->get('auth');
        $category = Category::find($categoryId);

        Condition::precondition(!$category, 404, 'No category with that ID');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canRead,
            $categoryId, 'No permissions to access this category');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumPermissions()->canCreateThreads,
            $categoryId, 'No permissions to create threads in this category');

        $newThread = new \stdClass();
        $newThread->threadId = -1;
        $newThread->categoryId = $categoryId;
        $newThread->content = '';
        $newThread->parents = $this->forumService->getCategoryParents($newThread);

        $existingThread = Thread::find($threadId);
        $thread = $existingThread ? $existingThread : $newThread;

        if ($existingThread) {
            $thread->append('template')
                ->append('content')
                ->append('badge')
                ->append('tags')
                ->append('roomLink')
                ->makeHidden('category');
        } else {
            $thread->template = Category::find($categoryId)->template;
        }

        if (!PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canEditOthersPosts, $thread->categoryId)) {
            Condition::precondition($thread && isset($thread->createdAt) && $thread->userId != $user->userId, 403,
                'You don\'t have permission to edit someone elses thread in here');
        }

        $thread->prefixes = Prefix::availableForCategory($thread->categoryId)->get(['prefixId', 'text']);
        $thread->forumPermissions = $this->forumService->getForumPermissionsForUserInCategory($user->userId, $categoryId);
        $thread->poll = $this->getThreadPoll($thread->threadId, $user->userId);
        $thread->canHavePoll = $category->options & ConfigHelper::getForumOptionsConfig()->threadsCanHavePolls;

        return response()->json($thread);
    }

    /**
     * Get request to fetch a thread resource
     *
     * @param Request $request
     * @param         $threadId
     * @param int $page
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThreadPage(Request $request, $threadId, $page = 1) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'Thread does not exist');
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canViewThreadContent, $thread->categoryId), 403, 'You can not view thread content');

        $this->forumService->updateReadCategory($thread->categoryId, $user->userId);
        $this->forumService->updateReadThread($thread->threadId, $user->userId);
        $isCreator = $thread->userId == $user->userId;
        Condition::precondition(!$isCreator && !PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canViewOthersThreads, $thread->categoryId), 403,
            'You can not view others thread content');

        $canAccessCategory = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $thread->categoryId);
        $cantAccessUnapproved = !$thread->isApproved && !PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canApproveThreads, $thread->categoryId);
        Condition::precondition(!$canAccessCategory, 403, 'No permissions to access this category');
        Condition::precondition($cantAccessUnapproved, 400, 'You cant access a unapproved thread');

        $permissions = $this->forumService->getForumPermissionsForUserInCategory($user->userId, $thread->categoryId);

        if ($permissions->canApprovePosts) {
            $thread->posts += $thread->threadPosts()->where('isApproved', '<', 1)->count('threadId');
        }

        $thread->load(['threadPosts' => function ($query) use ($permissions, $page) {
            $query->isApproved($permissions->canApprovePosts)
                ->skip(DataHelper::getOffset($page))
                ->take($this->perPage);
        }]);

        $thread->page = $page;
        $thread->contentApproval = PermissionHelper::haveGroupOption($user->userId, ConfigHelper::getGroupOptionsConfig()->contentNeedApproval);
        $thread->total = DataHelper::getPage($thread->posts);
        $thread->forumPermissions = $permissions;
        $thread->isSubscribed = ThreadSubscription::where('userId', $user->userId)->where('threadId', $threadId)->count('threadId') > 0;
        $thread->append('categoryIsOpen');
        $thread->poll = $this->getThreadPoll($thread->threadId, $user->userId);
        $thread->isIgnored = IgnoredThread::where('userId', $user->userId)->where('threadId', $thread->threadId)->count('threadId') > 0;
        $thread->template = $thread->category->template;

        if ($thread->template === ConfigHelper::getCategoryTemplatesConfig()->QUEST) {
            $thread->append('badge')
                ->append('tags')
                ->append('roomLink');
        }
        $thread->readers = ThreadRead::where('threadId', $thread->threadId)->take(20)->orderBy('updatedAt', 'DESC')
            ->get(['userId', 'updatedAt'])->map(function ($read) {
                return [
                    'user' => UserHelper::getSlimUser($read->userId),
                    'time' => $read->updatedAt->timestamp
                ];
            });

        return response()->json($thread);
    }

    /**
     * @param         $user
     * @param         $thumbnail
     * @param         $threadSkeleton
     * @param Request $request
     * @param bool $skipValidation
     *
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function doThread($user, $thumbnail, $threadSkeleton, $request, $skipValidation = false) {
        $category = Category::where('categoryId', $threadSkeleton->categoryId)->first(['template', 'options', 'isOpen']);
        $contentNeedApproval = PermissionHelper::haveGroupOption($user->userId, ConfigHelper::getGroupOptionsConfig()->contentNeedApproval);
        $prefixId = Value::objectProperty($threadSkeleton, 'prefixId', 0);
        $this->createThreadConditions($category, $prefixId);

        if (!$skipValidation) {
            $this->validatorService->validateCreateUpdateThread($user, $threadSkeleton, $category, $request);
        }

        $post = new Post([
            'threadId' => -1,
            'userId' => $user->userId,
            'content' => $threadSkeleton->content
        ]);
        $post->save();

        $isApproved = !(($category->options & ConfigHelper::getForumOptionsConfig()->threadsNeedApproval || $contentNeedApproval) && !$skipValidation);
        $thread = new Thread([
            'categoryId' => $threadSkeleton->categoryId,
            'title' => $threadSkeleton->title,
            'userId' => $user->userId,
            'firstPostId' => $post->postId,
            'lastPostId' => $post->postId,
            'isApproved' => $isApproved,
            'prefixId' => $prefixId
        ]);
        $thread->save();

        $post->threadId = $thread->threadId;
        $post->save();

        if ($user->userId > 0) {
            $user->threads++;
            $user->posts++;
            $user->save();

            $this->pointsService->givePointsFromCategory($user->userId, $thread->categoryId);
        }

        NotifyMentionsInPost::dispatch($threadSkeleton->content, $post->postId, $user->userId);
        NotifyThreadSubscribers::dispatch($category->categoryId, $thread->userId, $thread->threadId);

        if ($category->template !== $this->categoryTemplates->DEFAULT && !$skipValidation) {
            $this->uploadFileAndCreateTemplateData($threadSkeleton, $thumbnail, $thread->threadId, $request->hasFile('thumbnail'));
        }

        if ($user->userId > 0 && !($user->ignoredNotifications & ConfigHelper::getIgnoredNotificationsConfig()->AUTO_SUBSCRIBE_THREAD)) {
            $newSubscription = new ThreadSubscription([
                'userId' => $user->userId,
                'threadId' => $thread->threadId
            ]);
            $newSubscription->save();
        }

        $this->logThreadCreation($thread, $request, $user);
        $this->createThreadPoll($thread, $threadSkeleton);
        $this->forumService->updateLastPostIdOnCategory($thread->categoryId);
        NotifyCategorySubscribers::dispatch($thread->categoryId, $thread->userId, $thread->threadId);
        return response()->json(['threadId' => $thread->threadId], 201);
    }

    private function logThreadCreation($thread, $request, $user) {
        Logger::user($user->userId, ($request ? $request->ip() : ''), Action::CREATED_THREAD, [
            'thread' => $thread->title,
            'threadId' => $thread->threadId,
            'categoryId' => $thread->categoryId
        ], $thread->threadId);
    }

    /**
     * @param $threadId
     * @param $userId
     *
     * @return array|null
     */
    private function getThreadPoll($threadId, $userId) {
        $threadPoll = ThreadPoll::where('threadId', $threadId)->first();
        if (!$threadPoll) {
            return null;
        }

        $answers = json_decode($threadPoll->options);
        foreach ($answers as $answer) {
            $answer->answers = ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)
                ->where('answer', $answer->id)->count('threadPollId');
        }
        return [
            'question' => $threadPoll->question,
            'answers' => $answers,
            'haveVoted' => ThreadPollAnswer::where('threadPollId', $threadPoll->threadPollId)
                    ->where('userId', $userId)->count('threadPollId') > 0
        ];
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
            $fileName = $threadId . '.gif';
            $destination = base_path('/public/rest/resources/images/thumbnails');
            $thumbnail->move($destination, $fileName);
        }

        if (!empty($threadSkeleton->badge)) {
            $templateData = TemplateData::where('threadId', $threadId)->first();
            if ($templateData) {
                $templateData->badge = $threadSkeleton->badge;
                $templateData->tags = implode(',', $threadSkeleton->tags);
                $templateData->roomLink = Value::objectProperty($threadSkeleton, 'roomLink', '');
                $templateData->save();
            } else {
                TemplateData::create([
                    'threadId' => $threadId,
                    'badge' => $threadSkeleton->badge,
                    'tags' => implode(',', $threadSkeleton->tags),
                    'roomLink' => Value::objectProperty($threadSkeleton, 'roomLink', '')
                ]);
            }
        }
    }

    /**
     * @param $thread
     * @param $threadSkeleton
     */
    private function createThreadPoll($thread, $threadSkeleton) {
        if (!isset($threadSkeleton->poll)) {
            return;
        }
        $threadPoll = new ThreadPoll([
            'threadId' => $thread->threadId,
            'question' => $threadSkeleton->poll->question,
            'options' => json_encode($threadSkeleton->poll->answers)
        ]);
        $threadPoll->save();
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

        $isPrefixMandatory = $category->options & ConfigHelper::getForumOptionsConfig()->prefixMandatory;
        Condition::precondition($isPrefixMandatory && !$havePrefix, 400, 'Prefix is mandatory');
    }
}
