<?php

namespace App\Http\Controllers;

use App\EloquentModels\User\User;
use App\Helpers\UserHelper;
use App\Utils\Condition;

class ProfileController extends Controller {

    /**
     * @param         $nickname
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile ($nickname) {
        $user = User::withNickname($nickname)->first();
        Condition::precondition(!$user, 404, 'No user with that nickname');

        return response()->json([
            'user' => UserHelper::getSlimUser($user->userId),
            'stats' => [
                'userId' => $user->userId,
                'posts' => $user->posts,
                'threads' => $user->threads,
                'likes' => $user->likes,
                'createdAt' => $user->createdAt->timestamp,
                'lastActivity' => $user->lastActivity
            ]
        ]);
    }
}
