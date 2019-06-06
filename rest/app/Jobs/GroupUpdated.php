<?php

namespace App\Jobs;

use App\EloquentModels\User\UserGroup;
use App\Helpers\AvatarHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Class SubscriptionUpdated
 *
 * This job is suppose to run when a group is updated or deleted which is a type of update.
 * The jobs purpose is to remove perks from a user gained by a usergroup that has changed.
 *
 * Example case:
 * User has a 200 x 400 avatar and the group is updated to no longer have this options.
 * Then all user's avatars from this usergroup needs to be cleared if they don't have
 * another subscription/usergroup that allows them to have large av.
 *
 * @package App\Jobs
 */
class GroupUpdated implements ShouldQueue {
    private $groupId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * SubscriptionUpdated constructor
     *
     * @param $groupId
     */
    public function __construct($groupId) {
        $this->groupId = $groupId;
    }

    /**
     * Executes the job
     */
    public function handle() {
        $userIds = UserGroup::where('groupId', $this->groupId)->pluck('userId');
        foreach ($userIds as $userId) {
            AvatarHelper::clearAvatarIfInvalid($userId);
        }
    }
}
