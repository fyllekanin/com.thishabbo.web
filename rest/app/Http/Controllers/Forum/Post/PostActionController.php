<?php

namespace App\Http\Controllers\Forum\Post;

use App\Constants\LogType;
use App\Constants\Permission\CategoryPermissions;
use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\PostLike;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Http\Controllers\Controller;
use App\Logger;
use App\Providers\Service\ForumService;
use App\Providers\Service\ForumValidatorService;
use App\Utils\Condition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostActionController extends Controller {
    private $myForumService;
    private $myValidatorService;

    public function __construct(ForumService $forumService, ForumValidatorService $validatorService) {
        parent::__construct();
        $this->myForumService = $forumService;
        $this->myValidatorService = $validatorService;
    }

    /**
     * Post request to create a like on a post
     *
     * @param  Request  $request
     * @param $postId
     *
     * @return JsonResponse
     */
    public function likePost(Request $request, $postId) {
        $user = $request->get('auth');
        $post = Post::find($postId);
        Condition::precondition(!$post, 404, 'Post do not exist');
        Condition::precondition(!$post->thread, 404, 'Thread do not exist');

        $haveLiked = PostLike::where('postId', $postId)
                ->where('userId', $user->userId)
                ->count('postLikeId') > 0;

        Condition::precondition($post->userId == $user->userId, 400, 'You can not like your own post');
        Condition::precondition($haveLiked, 400, 'You already liked this post');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $post->thread->categoryId,
            'You do not have access to like this post'
        );

        $postUser = $post->user()->first();
        $postUser->likes++;
        $postUser->save();

        PostLike::create(
            [
                'postId' => $postId,
                'userId' => $user->userId
            ]
        );

        NotificationFactory::newLikePost($post->userId, $user->userId, $post->postId);
        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::LIKED_POST,
            [
                'thread' => $post->thread->title,
                'threadId' => $post->threadId,
                'categoryId' => $post->thread->categoryId
            ],
            $post->postId
        );

        $likerIds = PostLike::where('postId', $postId)->orderBy('createdAt', 'DESC')->pluck('userId');
        $likers = $likerIds->map(
            function ($liker) {
                return UserHelper::getSlimUser($liker);
            }
        );
        return response()->json($likers);
    }

    /**
     * Delete request to remove like on given post
     *
     * @param  Request  $request
     * @param $postId
     *
     * @return JsonResponse
     */
    public function unlikePost(Request $request, $postId) {
        $user = $request->get('auth');

        $post = Post::with('thread:threadId,categoryId')->where('postId', $postId)->first(['threadId', 'userId']);
        Condition::precondition(!$post, 404, 'Post do not exist');
        Condition::precondition(!$post->thread, 404, 'Thread do not exist');

        $haveLiked = PostLike::where('postId', $postId)
                ->where('userId', $user->userId)
                ->count('postLikeId') > 0;

        Condition::precondition(!$haveLiked, '400', 'Can not unlike a post you havent liked');
        Condition::precondition($post->userId == $user->userId, 400, 'You can not unlike your own post');
        PermissionHelper::haveForumPermissionWithException(
            $user->userId,
            CategoryPermissions::CAN_READ,
            $post->thread->categoryId,
            'You do not have access to unlike this post'
        );

        $postUser = $post->user()->first();
        $postUser->likes--;
        $postUser->save();

        PostLike::where('postId', $postId)
            ->where('userId', $user->userId)
            ->delete();

        Logger::user($user->userId, $request->ip(), LogType::UNLIKED_POST);

        $likerIds = PostLike::where('postId', $postId)->orderBy('createdAt', 'DESC')->pluck('userId');
        $likers = $likerIds->map(
            function ($liker) {
                return UserHelper::getSlimUser($liker);
            }
        );
        return response()->json($likers);
    }
}
