<?php

namespace App\Http\Controllers\Moderation;

use App\EloquentModels\Forum\Category;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Utils\Iterables;

class ThreadController extends Controller {
    private $forumService;

    /**
     * ThreadController constructor.
     *
     * @param ForumService $forumService
     */
    public function __construct (ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * @param Request $request
     * @param         $categoryId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveThreads(Request$request, $categoryId) {
        $user = UserHelper::getUserFromRequest($request);
        $threadIds = $request->input('threadIds');
        Condition::precondition(count($threadIds) < 1, 400, 'No threads selected!');
        $category = Category::find($categoryId);

        $forumPermissions = ConfigHelper::getForumConfig();

        Condition::precondition(!$category, 404, 'Category with that ID do not exist');
        Condition::precondition($category->parentId <= 0, 400, 'You can not choose a top level category');
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, $forumPermissions->canRead, $category->categoryId), 400,
            'You don\'t have access to the destination category');

        $threadsSql = Thread::whereIn('threadId', $threadIds);
        $threads = $threadsSql->get();
        Condition::precondition(count($threads) != count($threadIds), 404, 'One or more of the threads do not exist!');


        $oldCategoryId = $threads->get(0)->categoryId;
        $sameCategoryId = Iterables::every($threads, function($thread) use ($oldCategoryId) {
            return $thread->categoryId == $oldCategoryId;
        });

        Condition::precondition(!$sameCategoryId, 400, 'You are trying to move threads from different categories');
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, $forumPermissions->canMoveThreads, $oldCategoryId), 400,
            'You don\'t have access to move threads from this category!s');

        $threadsSql->update([
            'categoryId' => $category->categoryId
        ]);

        $this->forumService->updateLastPostIdOnCategory($oldCategoryId);
        $this->forumService->updateLastPostIdOnCategory($category->categoryId);

        $logData = array_map(function ($threadId) use ($oldCategoryId, $category) {
            return [
                'threadId' => $threadId,
                'sourceId' => $oldCategoryId,
                'destinationId' => $category->categoryId
            ];
        }, $threadIds);

        Logger::modMultiple($user->userId, $request->ip(), Action::MOVE_THREADS, $logData);
        return response()->json();
    }

    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function changeOwner(Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $threadIds = $request->input('threadIds');

        $forumPermissions = ConfigHelper::getForumConfig();

        $newOwner = User::withNickname($request->input('nickname'))->first();
        Condition::precondition(!$newOwner, 404, 'No user with that nickname');

        $threadsSql = Thread::whereIn('threadId', $threadIds);
        $threads = $threadsSql->get();
        Condition::precondition(count($threads) != count($threadIds), 404, 'One or more of the threads do not exist!');

        $threads = $threads->filter(function ($thread) use ($newOwner) {
            return $thread->userId != $newOwner->userId;
        });
        Condition::precondition(count($threads) < 1, 400, 'No threads selected!');

        $categoryId = $threads->get(0)->categoryId;
        Condition::precondition(!PermissionHelper::haveForumPermission($user->userId, $forumPermissions->canChangeThreadOwner, $categoryId),
            400, 'You do not have permission to change thread owner');

        $sameCategoryId = Iterables::every($threads, function($thread) use ($categoryId) {
            return $thread->categoryId == $categoryId;
        });
        Condition::precondition(!$sameCategoryId, 400, 'You are trying to change owners of threads from different categories');

        $logData = $threads->map(function ($thread) use ($newOwner) {
            return [
                'threadId' => $thread->threadId,
                'originalOwnerId' => $thread->userId,
                'newOwner' => $newOwner->userId
            ];
        })->toArray();

        $originalOwnerIds = $threads->map(function ($thread) {
            return $thread->userId;
        })->toArray();

        $originalOwnerFreq = array_count_values($originalOwnerIds);

        $threadsSql->update([
            'userId' => $newOwner->userId
        ]);

        $firstPostIds = $threads->map(function ($thread) {
            return $thread->firstPostId;
        });

        Post::whereIn('postId', $firstPostIds)->update([
            'userId' => $newOwner->userId
        ]);

        foreach ($originalOwnerFreq as $key => $value) {
            User::where('userId', $key)->first()->update([
                'threads' => DB::raw('threads - ' . $value)
            ]);
        }

        $newOwner->threads += count($threads);
        $newOwner->save();

        Logger::modMultiple($user->userId, $request->ip(), Action::CHANGE_THREAD_OWNER, $logData);
        return response()->json(UserHelper::getUser($newOwner->userId));
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function closeThread(Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'Thread do not exist');
        Condition::precondition(!$thread->isOpen, 400, 'Thread is already closed');

        $canClose = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canCloseOpenThread, $thread->categoryId) ||
            (PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canOpenCloseOwnThread, $thread->categoryId) && $user->userId == $thread->userId);
        Condition::precondition(!$canClose, 400, 'You do not have permission to close/open threads here');

        $thread->isOpen = false;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), Action::CLOSED_THREAD, ['thread' => $thread->title]);
        return response()->json();
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function openThread(Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'Thread do not exist');
        Condition::precondition($thread->isOpen, 400, 'Thread is already open');

        $canOpen = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canCloseOpenThread, $thread->categoryId) ||
            (PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumConfig()->canOpenCloseOwnThread, $thread->categoryId) && $user->userId == $thread->userId);
        Condition::precondition(!$canOpen, 400, 'You do not have permission to close/open threads here');

        $thread->isOpen = true;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), Action::OPEN_THREAD, ['thread' => $thread->title]);
        return response()->json();
    }

    /**
     * Put request to update given thread to a sticky thread
     *
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function stickyThread (Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canStickyThread, $thread->categoryId,
            'You do not have permission to sticky threads here');

        $thread->isSticky = true;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), Action::STICKIED_THREAD, ['thread' => $thread->title]);
        return response()->json();
    }

    /**
     * Put request to update given thread from sticky to non-sticky
     *
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function unstickyThread (Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canStickyThread, $thread->categoryId,
            'You do not have permission to unsticky threads here');

        $thread->isSticky = 0;
        $thread->save();

        Logger::mod($user->userId, $request->ip(), Action::UNSTICKIED_THREAD, ['thread' => $thread->title]);
        return response()->json();
    }

    /**
     * Put request to change "approved" threads to "unapproved"
     *
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function unapproveThread (Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist!');
        Condition::precondition(!$thread->isApproved, 400, 'Thread is already unapproved');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canApproveThreads, $thread->categoryId,
            'You dont have permission to unapprove this thread');

        $thread->isApproved = false;
        $thread->save();
        Post::where('threadId', $thread->threadId)->update(['isApproved' => false]);

        if (!($thread->category->options & ConfigHelper::getForumOptionsConfig()->postsDontCount)) {
            $posts = Post::where('threadId', $thread->threadId)->where('isApproved', false)->get();
            foreach ($posts as $post) {
                User::where('userId', $post->userId)->update(['posts' => DB::raw('posts - 1 ')]);
            }
        }

        $this->forumService->updateLastPostIdOnCategory($thread->categoryId);
        Logger::mod($user->userId, $request->ip(), Action::UNAPPROVED_THREAD, ['thread' => $thread->title]);
        return response()->json();
    }

    /**
     * Put request to change "unapproved" threads to "approved"
     *
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveThread (Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);
        Condition::precondition(!$thread, 404, 'Thread does not exist!');
        Condition::precondition($thread->isApproved, 400, 'Thread is already approved');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canApproveThreads, $thread->categoryId,
            'You dont have permission to unapprove this thread');

        $thread->isApproved = true;
        $thread->save();
        Post::where('threadId', $thread->threadId)->update(['isApproved' => true]);

        if (!($thread->category->options & ConfigHelper::getForumOptionsConfig()->postsDontCount)) {
            $posts = Post::where('isApproved', true)->where('threadId', $thread->threadId)->get();
            foreach ($posts as $post) {
                User::where('userId', $post->userId)->update(['posts' => DB::raw('posts + 1 ')]);
            }
        }

        $this->forumService->updateLastPostIdOnCategory($thread->categoryId);
        Logger::mod($user->userId, $request->ip(), Action::APPROVED_THREAD, ['thread' => $thread->title]);
        return response()->json();
    }

    /**
     * Delete request to delete given thread
     *
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteThread (Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);

        Condition::precondition(!$thread, 404, 'Thread does not exist!');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canDeletePosts, $thread->categoryId,
            'You dont have permission to delete this thread');

        $posts = Post::where('threadId', $thread->threadId)->where('isApproved', true)->get();

        foreach ($posts as $post) {
            if ($post->isApproved && $post->postId != $thread->firstPostId) {
                User::where('userId', $post->userId)->update(['posts' => DB::raw('posts - 1')]);
            }
            Post::where('postId', $post->postId)->update(['isDeleted' => true, 'isApproved' => true]);
        }

        User::where('userId', $thread->userId)->update(['threads' => DB::raw('threads - 1')]);
        $thread->isApproved = true;
        $thread->isDeleted = true;
        $thread->save();

        $this->forumService->updateLastPostIdOnCategory($thread->categoryId);
        Logger::mod($user->userId, $request->ip(), Action::DELETED_THREAD, ['thread' => $thread->title]);
        return response()->json();
    }
}
