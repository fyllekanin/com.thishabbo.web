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
use App\Utils\Iterables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller {
    private $forumService;

    /**
     * PostController constructor.
     *
     * @param ForumService $forumService
     */
    public function __construct (ForumService $forumService) {
        parent::__construct();
        $this->forumService = $forumService;
    }

    /**
     * @param Request $request
     * @param         $threadId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function mergePosts(Request $request, $threadId) {
        $user = UserHelper::getUserFromRequest($request);
        $thread = Thread::find($threadId);
        $postIds = $request->input('postIds');

        Condition::precondition(!$thread, 404, 'Thread with that ID do not exist');
        Condition::precondition(count($postIds) < 2, 400, 'Need at least two posts to merge');

        $firstPostId = null;

        foreach ($postIds as $postId) {
            if ($postId < $firstPostId || !$firstPostId) {
                $firstPostId = $postId;
            }
        }

        $postIds = Iterables::filter($postIds, function($postId) use ($firstPostId) {
            return $postId != $firstPostId;
        });

        $firstPost = Post::find($firstPostId);
        $posts = Post::whereIn('postId', $postIds)->get();

        foreach ($postIds as $postId) {
            $this->deletePost($postId, $user, $request->ip());
        }

        $content = $firstPost->content;
        foreach ($posts as $post) {
            $content = $content . "
                ---------------------------
            " . $post->content;
        }

        $thread->posts -= count($postIds);
        $thread->save();

        $firstPost->content = $content;
        $firstPost->save();

        Logger::mod($user->userId, $request->ip(), Action::MERGE_POSTS, ['postIds' => $request->input('postIds')]);
        return response()->json($firstPost);
    }

    /**
     * Delete request to delete given post ids, if one given postId is equal to the first post of a
     * thread it will be skipped and only available to delete through "deleteThread".
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePosts (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $postIds = $request->input('postIds');

        foreach ($postIds as $postId) {
            $this->deletePost($postId, $user, $request->ip());
        }

        return response()->json();
    }

    /**
     * Put request to update posts from "unapproved" to "approved"
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function approvePosts (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $postIds = $request->input('postIds');

        foreach ($postIds as $postId) {
            $post = Post::with('thread')->where('postId', $postId)->first();
            Condition::precondition(!$post, 404, 'One of the posts do not exist');
            PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canApprovePosts, $post->thread->categoryId,
                'You cant approve posts in this category');
            Condition::precondition(!$post->thread, 404, 'Posts thread does not exist');

            if ($post->postId == $post->thread->firstPostId || $post->isApproved) {
                continue;
            }

            $post->isApproved = true;
            $post->save();
            User::where('userId', $post->userId)->update(['posts' => DB::raw('posts + 1')]);

            if ($post->postId > $post->thread->lastPostId) {
                $post->thread->lastPostId = $post->postId;
                $post->thread->posts++;
                $post->thread->save();
            }

            $this->forumService->updateLastPostIdOnCategory($post->thread->categoryId);
            Logger::mod($user->userId, $request->ip(), Action::APPROVED_POST, ['thread' => $post->thread->title]);
        }

        return response()->json();
    }

    /**
     * Put request to update posts from "approved" to "unapproved"
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function unApprovePosts (Request $request) {
        $user = UserHelper::getUserFromRequest($request);
        $postIds = $request->input('postIds');

        foreach ($postIds as $postId) {
            $post = Post::find($postId);
            Condition::precondition(!$post, 404, 'One of the posts do not exist');
            PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canApprovePosts, $post->thread->categoryId,
                'You cant approve posts in this category');
            Condition::precondition(!$post->thread, 404, 'Posts thread does not exist');

            if ($post->postId == $post->thread->firstPostId || !$post->thread->isApproved) {
                continue;
            }

            $post->isApproved = false;
            $post->save();
            User::where('userId', $post->userId)->update(['posts' => DB::raw('posts - 1')]);

            if ($post->thread->lastPostId == $post->postId) {
                $post->thread->lastPostId = Post::where('isApproved', true)->where('threadId', $post->thread->threadId)->orderBy('postId', 'DESC')->select('postId')->first()->postId;
                $post->thread->posts--;
                $post->thread->save();
            }

            $this->forumService->updateLastPostIdOnCategory($post->thread->categoryId);
            Logger::mod($user->userId, $request->ip(), Action::UNAPPROVED_POST, ['thread' => $post->thread->title]);
        }

        return response()->json();
    }

    private function deletePost($postId, $user, $ipAddress) {
        $post = Post::with('thread')->where('postId', $postId)->first();
        Condition::precondition(!$post, 404, 'One of the posts do not exist');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canApprovePosts, $post->thread->categoryId,
            'You cant approve posts in this category');
        Condition::precondition(!$post->thread, 404, 'Posts thread does not exist');

        if ($post->postId == $post->thread->firstPostId) {
            return;
        }

        $post->isDeleted = true;
        $post->save();

        if ($post->isApproved) {
            User::where('userId', $post->userId)->update(['posts' => DB::raw('posts - 1')]);
        }

        if ($post->thread->lastPostId == $post->postId) {
            $post->thread->lastPostId = Post::where('threadId', $post->threadId)
                ->where('isApproved', true)
                ->orderBy('postId', 'DESC')
                ->first()->postId;
            $post->thread->posts--;
            $post->thread->save();
        }

        $this->forumService->updateLastPostIdOnCategory($post->thread->categoryId);
        Logger::mod($user->userId, $ipAddress, Action::DELETED_POST, ['thread' => $post->thread->title]);
    }
}
