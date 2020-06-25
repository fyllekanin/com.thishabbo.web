<?php

namespace App\Http\Controllers\Moderation;

use App\Constants\CategoryOptions;
use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Forum\ThreadBan;
use App\EloquentModels\User\User;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Utils\Condition;
use App\Utils\Iterables;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThreadController extends Controller {
    private $myForumService;

    public function __construct(ForumService $forumService) {
        parent::__construct();
        $this->myForumService = $forumService;
    }

    public function stickyThreads(Request $request) {
        $user = $request->get('auth');
        $threadIds = $request->input('ids');

        $threads = Thread::whereIn('threadId', $threadIds)->get();
        Condition::precondition($threads->count() == 0, 400, 'You need to select at least one');
        $categoryId = $threads->reduce(
            function ($prev, $curr) {
                if ($prev < 0) {
                    $prev = $curr->categoryId;
                } else {
                    Condition::precondition($curr->categoryId != $prev, 400, 'All threads need to be from same category');
                }
                return $prev;
            },
            -1
        );
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_STICKY_THREAD, $categoryId),
            400,
            'You dont have permission to sticky threads in here'
        );

        $threads->each(
            function ($thread) use ($user, $request) {
                $thread->isSticky = true;
                $thread->save();
                Logger::mod($user->userId, $request->ip(), LogType::STICKIED_THREAD, [], $thread->threadId);
            }
        );
        return response()->json();
    }

    public function unstickyThreads(Request $request) {
        $user = $request->get('auth');
        $threadIds = $request->input('ids');

        $threads = Thread::whereIn('threadId', $threadIds)->get();
        Condition::precondition($threads->count() == 0, 400, 'You need to select at least one');
        $categoryId = $threads->reduce(
            function ($prev, $curr) {
                if ($prev < 0) {
                    $prev = $curr->categoryId;
                } else {
                    Condition::precondition($curr->categoryId != $prev, 400, 'All threads need to be from same category');
                }
                return $prev;
            },
            -1
        );
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_STICKY_THREAD, $categoryId),
            400,
            'You dont have permission to unsticky threads in here'
        );

        $threads->each(
            function ($thread) use ($user, $request) {
                $thread->isSticky = false;
                $thread->save();
                Logger::mod($user->userId, $request->ip(), LogType::UNSTICKIED_THREAD, [], $thread->threadId);
            }
        );
        return response()->json();
    }

    public function getThreadBans(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'No thread with that ID');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_THREAD_BAN,
            $thread->categoryId,
            'You do not have permission to thread ban here!'
        );

        return response()->json(
            ThreadBan::where('threadId', $thread->threadId)->orderBy('createdAt', 'DESC')->get()->map(
                function ($ban) {
                    return [
                        'threadBanId' => $ban->threadBanId,
                        'user' => UserHelper::getSlimUser($ban->userId),
                        'bannedBy' => UserHelper::getSlimUser($ban->bannedById),
                        'bannedAt' => $ban->createdAt->timestamp
                    ];
                }
            )
        );
    }

    public function createThreadBan(Request $request, $threadId) {
        $user = $request->get('auth');
        $banned = User::withNickname($request->input('nickname'))->first();
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'No thread with that ID');
        Condition::precondition(!$banned, 404, 'No user with that nickname');
        Condition::precondition(!UserHelper::canManageUser($user, $banned->userId), 400, 'You can not ban this user');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_THREAD_BAN,
            $thread->categoryId,
            'You do not have permission to thread ban here!'
        );

        $threadBan = new ThreadBan(
            [
                'userId' => $banned->userId,
                'bannedById' => $user->userId,
                'threadId' => $thread->threadId
            ]
        );
        $threadBan->save();

        Logger::mod($user->userId, $request->ip(), LogType::THREAD_BANNED, ['thread' => $thread->title], $banned->userId);
        return $this->getThreadBans($request, $threadId);
    }

    public function deleteThreadBan(Request $request, $threadBanId) {
        $user = $request->get('auth');
        $threadBan = ThreadBan::find($threadBanId);
        $thread = Thread::find($threadBan->threadId);

        Condition::precondition(!$thread, 404, 'No thread with that ID');
        Condition::precondition(!$threadBan, 404, 'No thread ban with that ID');
        Condition::precondition(!UserHelper::canManageUser($user, $threadBan->userId), 400, 'You can not unban this user');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_THREAD_BAN,
            $thread->categoryId,
            'You do not have permission to thread ban here!'
        );

        $threadBan->isDeleted = true;
        $threadBan->save();

        Logger::mod($user->userId, $request->ip(), LogType::THREAD_UNBANNED, ['thread' => $thread->title], $threadBan->userId);
        return $this->getThreadBans($request, $threadBan->threadId);
    }

    public function mergeThreads(Request $request, $sourceThreadId) {
        $user = $request->get('auth');
        $targetThreadId = $request->input('targetThreadId');

        $sourceThread = Thread::find($sourceThreadId);
        $targetThread = Thread::find($targetThreadId);
        Condition::precondition(!$sourceThread, 404, 'Source thread do not exist');
        Condition::precondition(!$targetThread, 404, 'Target thread do not exist');

        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $sourceThread->categoryId),
            400,
            'You don\'t have access to the source category'
        );
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $targetThread->categoryId),
            400,
            'You don\'t have access to the target category'
        );
        Condition::precondition(
            !PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_MERGE_THREADS_AND_POSTS,
                $sourceThread->categoryId
            ),
            400,
            'You don\'t have access to merge thread in the source category'
        );
        Condition::precondition(
            !PermissionHelper::haveForumPermission(
                $user->userId,
                CategoryPermissions::CAN_MERGE_THREADS_AND_POSTS,
                $targetThread->categoryId
            ),
            400,
            'You don\'t have access to merge thread in the target category'
        );

        $content = $targetThread->firstPost->content."
--------------------------------------------
".$sourceThread->firstPost->content;

        $targetThread->posts += $sourceThread->posts;
        $targetThread->save();
        $sourceThread->firstPost->isDeleted = true;
        $sourceThread->firstPost->save();
        Post::where('threadId', $sourceThread->threadId)->update(['threadId' => $targetThread->threadId]);
        $sourceThread->isDeleted = true;
        $sourceThread->save();

        $targetThread->firstPostId = Post::where('threadId', $targetThread->threadId)
            ->orderBy('postId', 'ASC')
            ->select('postId')
            ->value('postId');
        $targetThread->firstPost->userId = $targetThread->userId;
        $targetThread->firstPost->content = $content;
        $targetThread->firstPost->save();
        $targetThread->save();

        $this->myForumService->updateLastPostIdOnCategory($sourceThread->categoryId);
        $this->myForumService->updateLastPostIdOnCategory($targetThread->categoryId);

        Logger::mod(
            $user->userId,
            $request->ip(),
            LogType::MERGED_THREAD,
            [
                'sourceThread' => $sourceThread->title,
                'targetThread' => $targetThread->title,
                'sourceThreadId' => $sourceThread->threadId,
                'targetThreadId' => $targetThread->threadId
            ],
            $sourceThread->threadId
        );
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $categoryId
     *
     * @return JsonResponse
     */
    public function moveThreads(Request $request, $categoryId) {
        $user = $request->get('auth');
        $threadIds = $request->input('threadIds');
        Condition::precondition(count($threadIds) < 1, 400, 'No threads selected!');
        $category = Category::find($categoryId);

        Condition::precondition(!$category, 404, 'Category with that ID do not exist');
        Condition::precondition($category->parentId <= 0, 400, 'You can not choose a top level category');
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_READ, $category->categoryId),
            400,
            'You don\'t have access to the target category'
        );

        $threadsSql = Thread::whereIn('threadId', $threadIds);
        $threads = $threadsSql->get();
        Condition::precondition(count($threads) != count($threadIds), 404, 'One or more of the threads do not exist!');


        $oldCategoryId = $threads->get(0)->categoryId;
        $sameCategoryId = Iterables::every($threads, function ($thread) use ($oldCategoryId) {
            return $thread->categoryId == $oldCategoryId;
        });

        Condition::precondition(!$sameCategoryId, 400, 'You are trying to move threads from different categories');
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_MOVE_THREADS, $oldCategoryId),
            400,
            'You don\'t have access to move threads from this category!'
        );

        $threadsSql->update(
            [
                'categoryId' => $category->categoryId
            ]
        );

        $this->myForumService->updateLastPostIdOnCategory($oldCategoryId);
        $this->myForumService->updateLastPostIdOnCategory($category->categoryId);

        $logData = array_map(function ($threadId) use ($oldCategoryId, $category) {
            return [
                'threadId' => $threadId,
                'sourceId' => $oldCategoryId,
                'targetId' => $category->categoryId
            ];
        }, $threadIds);

        Logger::modMultiple($user->userId, $request->ip(), LogType::MOVE_THREADS, $logData);
        return response()->json();
    }

    /**
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function changeOwner(Request $request) {
        $user = $request->get('auth');
        $threadIds = $request->input('threadIds');
        $newOwner = User::withNickname($request->input('nickname'))->first();
        Condition::precondition(!$newOwner, 404, 'No user with that nickname');

        $threadsSql = Thread::whereIn('threadId', $threadIds);
        $threads = $threadsSql->get();
        Condition::precondition(count($threads) != count($threadIds), 404, 'One or more of the threads do not exist!');

        $threads = $threads->filter(
            function ($thread) use ($newOwner) {
                return $thread->userId != $newOwner->userId;
            }
        );
        Condition::precondition(count($threads) < 1, 400, 'No threads selected!');

        $categoryId = $threads->get(0)->categoryId;
        Condition::precondition(
            !PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_CHANGE_OWNER, $categoryId),
            400,
            'You do not have permission to change thread owner'
        );

        $sameCategoryId = Iterables::every(
            $threads,
            function ($thread) use ($categoryId) {
                return $thread->categoryId == $categoryId;
            }
        );
        Condition::precondition(!$sameCategoryId, 400, 'You are trying to change owners of threads from different categories');

        $logData = $threads->map(
            function ($thread) use ($newOwner) {
                return [
                    'threadId' => $thread->threadId,
                    'originalOwnerId' => $thread->userId,
                    'newOwner' => $newOwner->userId
                ];
            }
        )->toArray();

        $originalOwnerIds = $threads->map(
            function ($thread) {
                return $thread->userId;
            }
        )->toArray();

        $originalOwnerFreq = array_count_values($originalOwnerIds);

        $threadsSql->update(
            [
                'userId' => $newOwner->userId
            ]
        );

        $firstPostIds = $threads->map(
            function ($thread) {
                return $thread->firstPostId;
            }
        );

        Post::whereIn('postId', $firstPostIds)->update(
            [
                'userId' => $newOwner->userId
            ]
        );

        foreach ($originalOwnerFreq as $key => $value) {
            User::where('userId', $key)->first()->update(
                [
                    'threads' => DB::raw('threads - '.$value)
                ]
            );
        }

        $newOwner->threads += count($threads);
        $newOwner->save();

        Logger::modMultiple($user->userId, $request->ip(), LogType::CHANGE_THREAD_OWNER, $logData);
        return response()->json(UserHelper::getUser($newOwner->userId));
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function closeThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'Thread do not exist');
        Condition::precondition(!$thread->isOpen, 400, 'Thread is already closed');

        $canClose = PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_CLOSE_OPEN_THREAD, $thread->categoryId) ||
            (
                PermissionHelper::haveForumPermission(
                    $user->userId,
                    CategoryPermissions::CAN_OPEN_CLOSE_OWN_THREAD,
                    $thread->categoryId
                ) &&
                $user->userId == $thread->userId
            );
        Condition::precondition(!$canClose, 400, 'You do not have permission to close/open threads here');

        $thread->isOpen = false;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), LogType::CLOSED_THREAD, ['thread' => $thread->title], $thread->threadId);
        return response()->json();
    }

    /**
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function openThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'Thread do not exist');
        Condition::precondition($thread->isOpen, 400, 'Thread is already open');

        $canOpen = PermissionHelper::haveForumPermission($user->userId, CategoryPermissions::CAN_CLOSE_OPEN_THREAD, $thread->categoryId) ||
            (
                PermissionHelper::haveForumPermission(
                    $user->userId,
                    CategoryPermissions::CAN_OPEN_CLOSE_OWN_THREAD,
                    $thread->categoryId
                ) &&
                $user->userId == $thread->userId
            );
        Condition::precondition(!$canOpen, 400, 'You do not have permission to close/open threads here');

        $thread->isOpen = true;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), LogType::OPEN_THREAD, ['thread' => $thread->title], $thread->threadId);
        return response()->json();
    }

    /**
     * Put request to update given thread to a sticky thread
     *
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function stickyThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_STICKY_THREAD,
            $thread->categoryId,
            'You do not have permission to sticky threads here'
        );

        $thread->isSticky = true;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), LogType::STICKIED_THREAD, [], $thread->threadId);
        return response()->json();
    }

    /**
     * Put request to update given thread from sticky to non-sticky
     *
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function unstickyThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_STICKY_THREAD,
            $thread->categoryId,
            'You do not have permission to unsticky threads here'
        );

        $thread->isSticky = 0;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), LogType::UNSTICKIED_THREAD, [], $thread->threadId);
        return response()->json();
    }

    /**
     * Put request to change "approved" threads to "unapproved"
     *
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function unapproveThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist!');
        Condition::precondition(!$thread->isApproved, 400, 'Thread is already unapproved');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_APPROVE_THREADS,
            $thread->categoryId,
            'You dont have permission to unapprove this thread'
        );

        $thread->isApproved = false;
        $thread->save();
        Post::where('threadId', $thread->threadId)->update(['isApproved' => false]);

        if (!($thread->category->options & CategoryOptions::POSTS_DONT_COUNT)) {
            $posts = Post::where('threadId', $thread->threadId)->where('isApproved', '<', 1)->get();
            foreach ($posts as $post) {
                User::where('userId', $post->userId)->update(['posts' => DB::raw('posts - 1 ')]);
            }
        }

        $this->myForumService->updateLastPostIdOnCategory($thread->categoryId);
        Logger::mod($user->userId, $request->ip(), LogType::UNAPPROVED_THREAD, [], $thread->threadId);
        return response()->json();
    }

    /**
     * Put request to change "unapproved" threads to "approved"
     *
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function approveThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist!');
        Condition::precondition($thread->isApproved, 400, 'Thread is already approved');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_APPROVE_THREADS,
            $thread->categoryId,
            'You dont have permission to unapprove this thread'
        );

        $thread->isApproved = true;
        $thread->save();
        Post::where('threadId', $thread->threadId)->update(['isApproved' => true]);

        if (!($thread->category->options & CategoryOptions::POSTS_DONT_COUNT)) {
            $posts = Post::where('isApproved', true)->where('threadId', $thread->threadId)->get();
            foreach ($posts as $post) {
                User::where('userId', $post->userId)->update(['posts' => DB::raw('posts + 1 ')]);
            }
        }

        $this->myForumService->postSiteMessageIfApplicable($thread);
        $this->myForumService->updateLastPostIdOnCategory($thread->categoryId);
        Logger::mod($user->userId, $request->ip(), LogType::APPROVED_THREAD, [], $thread->threadId);
        return response()->json();
    }

    /**
     * Delete request to delete given thread
     *
     * @param  Request  $request
     * @param $threadId
     *
     * @return JsonResponse
     */
    public function deleteThread(Request $request, $threadId) {
        $user = $request->get('auth');
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'Thread does not exist!');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_DELETE_POSTS,
            $thread->categoryId,
            'You dont have permission to delete this thread'
        );

        $posts = Post::where('threadId', $thread->threadId)->where('isApproved', '>', 0)->get();

        foreach ($posts as $post) {
            if ($post->postId != $thread->firstPostId &&
                !$this->myForumService->doCategoryHaveOption($post->thread->categoryId, CategoryOptions::POSTS_DONT_COUNT) &&
                $post->isApproved
            ) {
                User::where('userId', $post->userId)->update(['posts' => DB::raw('posts - 1')]);
            }
            Post::where('postId', $post->postId)->update(['isDeleted' => true, 'isApproved' => true]);
        }

        User::where('userId', $thread->userId)->update(['threads' => DB::raw('threads - 1')]);
        $thread->isApproved = true;
        $thread->isDeleted = true;
        $thread->save();

        $this->myForumService->updateLastPostIdOnCategory($thread->categoryId);
        Logger::mod($user->userId, $request->ip(), LogType::DELETED_THREAD, [], $thread->threadId);
        return response()->json();
    }
}
