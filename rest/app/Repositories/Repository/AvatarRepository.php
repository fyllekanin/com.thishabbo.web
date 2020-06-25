<?php

namespace App\Repositories\Repository;

use App\Repositories\Impl\AvatarRepository\AvatarDBO;

interface AvatarRepository {


    /**
     * Get an object with maximum width and height a
     * user can have for their avatar.
     *
     * @param  int  $userId
     *
     * @return mixed
     */
    public function getMaxAvatarSizeForUser(int $userId);

    /**
     * Backup the current avatar for user if they have any.
     *
     * @param  int  $userId
     */
    public function backupCurrentAvatarForUser(int $userId);

    /**
     * Get the AvatarDBO based on avatarId
     *
     * @param  int  $avatarId
     *
     * @return AvatarDBO
     */
    public function getAvatarById(int $avatarId);

    /**
     * Get the 5 latest avatars belonging to user
     *
     * @param  int  $userId
     *
     * @return AvatarDBO[]
     */
    public function getLatestAvatarsForUserId(int $userId);

    /**
     * Create a avatar
     *
     * @param  int  $userId
     * @param  int  $width
     * @param  int  $height
     *
     * @return AvatarDBO
     */
    public function createAvatar(int $userId, int $width, int $height);

    /**
     * Update the updatedAt for given avatar
     *
     * @param  int  $avatarId
     */
    public function updateAvatarUpdatedAt(int $avatarId);

    /**
     * Check if the current avatar of a user is valid
     *
     * @param  int  $userId
     *
     * @return bool
     */
    public function isCurrentAvatarValidForUserId(int $userId);

    /**
     * Make the current avatar of a user valid by resize
     *
     * @param  int  $userId
     *
     * @return bool
     */
    public function makeCurrentAvatarValid(int $userId);
}
