<?php

namespace App\Jobs;

use App\Repositories\Repository\AvatarRepository;
use App\Repositories\Repository\GroupRepository;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

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
    private $myAvatarRepository;
    private $myGroupRepository;

    private $myGroupId;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(int $groupId) {
        $this->myGroupId = $groupId;
    }

    /**
     * Executes the job
     *
     * @param  AvatarRepository  $avatarRepository
     * @param  GroupRepository  $groupRepository
     */
    public function handle(AvatarRepository $avatarRepository, GroupRepository $groupRepository) {
        $this->myAvatarRepository = $avatarRepository;
        $this->myGroupRepository = $groupRepository;

        $this->myGroupRepository->getUserIdsWithGroupId($this->myGroupId)
            ->filter(
                function ($userId) {
                    return !$this->myAvatarRepository->isCurrentAvatarValidForUserId($userId);
                }
            )
            ->each(
                function ($userId) {
                    $this->myAvatarRepository->makeCurrentAvatarValid($userId);
                }
            );
    }

    /**
     * The job failed to process.
     *
     * @param  Exception  $exception
     *
     * @return void
     */
    public function failed(Exception $exception) {
        Log::channel('que')->error(
            '
        [b]File:[/b] '.$exception->getFile().'#'.$exception->getLine().'
        
        [b]Message:[/b]
'.$exception->getMessage().'
        '
        );
    }
}
