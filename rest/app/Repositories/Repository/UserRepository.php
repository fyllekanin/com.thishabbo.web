<?php

namespace App\Repositories\Repository;

use App\Repositories\Impl\UserRepository\UserDataDBO;
use App\Repositories\Impl\UserRepository\UserDBO;
use Illuminate\Support\Collection;

interface UserRepository {


    /**
     * Get the full path to a resource
     *
     * @param  int  $userId
     *
     * @return UserDBO
     */
    public function byId(int $userId);

    /**
     * Update the avatarUpdatedAt value for the user
     *
     * @param  int  $userId
     */
    public function updateAvatarTimeForUserId(int $userId);

    /**
     * Get the UserDataDBO for the given user id
     *
     * @param  int  $userId
     *
     * @return UserDataDBO
     */
    public function getUserDataForUserId(int $userId);

    /**
     * Update the provided UserDataDBO
     *
     * @param  UserDataDBO  $item
     */
    public function updateUserData(UserDataDBO $item);

    /**
     * Create or update the user profile visit for the user
     * on a specific profile.
     *
     * @param  int  $userId
     * @param  int  $profileId
     */
    public function updateVisitOnProfileId(int $userId, int $profileId);

    /**
     * Get a user by nickname
     *
     * @param  string  $nickname
     *
     * @return UserDBO
     */
    public function getUserByNickname(string $nickname);

    /**
     * Get users by search
     *
     * @param  string  $nickname
     *
     * @return Collection
     */
    public function getUsersBySearch(string $nickname);
}
