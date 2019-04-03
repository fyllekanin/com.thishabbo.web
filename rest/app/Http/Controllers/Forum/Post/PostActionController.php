<?php

namespace App\Http\Controllers\Forum\Post;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\PostLike;
use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\ForumService;
use App\Services\ForumValidatorService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PostActionController extends Controller {
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
     * Post request to create a like on a post
     *
     * @param Request $request
     * @param         $postId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function likePost (Request $request, $postId) {
        $user = Cache::get('auth');
        $post = Post::find($postId);
        Condition::precondition(!$post, 404, 'Post do not exist');
        Condition::precondition(!$post->thread, 404, 'Thread do not exist');

        $haveLiked = PostLike::where('postId', $postId)
                ->where('userId', $user->userId)
                ->count() > 0;

        Condition::precondition($post->userId == $user->userId, 400, 'You can not like your own post');
        Condition::precondition($haveLiked, 400, 'You already liked this post');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canRead, $post->thread->categoryId,
            'You do not have access to like this post');

        $postUser = $post->user()->first();
        $postUser->likes++;
        $postUser->save();

        PostLike::create([
            'postId' => $postId,
            'userId' => $user->userId
        ]);

        Logger::user($user->userId, $request->ip(), Action::LIKED_POST, [
            'thread' => $post->thread->title,
            'threadId' => $post->threadId,
            'categoryId' => $post->thread->categoryId
        ]);
        return response()->json();
    }

    /**
     * Delete request to remove like on given post
     *
     * @param Request $request
     * @param         $postId
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function unlikePost (Request $request, $postId) {
        $user = Cache::get('auth');

        $post = Post::with('thread:threadId,categoryId')->where('postId', $postId)->first(['threadId', 'userId']);
        Condition::precondition(!$post, 404, 'Post do not exist');
        Condition::precondition(!$post->thread, 404, 'Thread do not exist');

        $haveLiked = PostLike::where('postId', $postId)
                ->where('userId', $user->userId)
                ->count() > 0;

        Condition::precondition(!$haveLiked, '400', 'Can not unlike a post you havent liked');
        Condition::precondition($post->userId == $user->userId, 400, 'You can not unlike your own post');
        PermissionHelper::haveForumPermissionWithException($user->userId, ConfigHelper::getForumConfig()->canRead, $post->thread->categoryId,
            'You do not have access to unlike this post');

        $postUser = $post->user()->first();
        $postUser->likes--;
        $postUser->save();

        PostLike::where('postId', $postId)
            ->where('userId', $user->userId)
            ->delete();

        Logger::user($user->userId, $request->ip(), Action::UNLIKED_POST);
        return response()->json();
    }
}
