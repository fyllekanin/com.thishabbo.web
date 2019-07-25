<?php

namespace App\Http\Impl\Forum;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\ThreadRead;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\ForumHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\UserHelper;
use App\Utils\Condition;

class ThreadCrudControllerImpl {

    public function getThreadPostTotalByUser($threadId, $userId, $canApprovePosts) {
        return DataHelper::getPage(Post::where('userId', $userId)->where('threadId', $threadId)
            ->isApproved($canApprovePosts)
            ->count('postId'));
    }

    public function canUserAccessThread($user, $thread) {
        $canAccessCategory = PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canRead, $thread->categoryId)
            && (ForumHelper::isCategoryAuthOnly($thread->categoryId) ? $user->userId > 0 : true);
        $cantAccessUnapproved = !$thread->isApproved &&
            !PermissionHelper::haveForumPermission($user->userId, ConfigHelper::getForumPermissions()->canApproveThreads, $thread->categoryId);
        Condition::precondition(!$canAccessCategory, 403, 'No permissions to access this category');
        Condition::precondition($user->userId != $thread->userId && $cantAccessUnapproved, 400, 'You cant access a unapproved thread');
    }

    public function getThreadReaders($threadId, $lastRead) {
        return ThreadRead::where('threadId', $threadId)->where('updatedAt', '>', $lastRead)
            ->orderBy('updatedAt', 'DESC')
            ->get(['userId', 'updatedAt'])->map(function ($read) {
                return [
                    'user' => UserHelper::getSlimUser($read->userId),
                    'time' => $read->updatedAt->timestamp
                ];
            });
    }

}