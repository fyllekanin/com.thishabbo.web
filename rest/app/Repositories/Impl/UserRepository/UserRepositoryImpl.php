<?php

namespace App\Repositories\Impl\SettingRepository;

use App\Repositories\Impl\UserRepository\UserDataDBO;
use App\Repositories\Impl\UserRepository\UserDBO;
use App\Repositories\Impl\UserRepository\UserProfileVisitDBO;
use App\Repositories\Repository\UserRepository;
use Illuminate\Support\Facades\Cache;

class UserRepositoryImpl implements UserRepository {

    private $myUserDBO;
    private $myUserDataDBO;
    private $myUserProfileVisitDBO;

    public function __construct() {
        $this->myUserDBO = new UserDBO();
        $this->myUserDataDBO = new UserDataDBO();
        $this->myUserProfileVisitDBO = new UserProfileVisitDBO();
    }

    public function byId(int $userId) {
        return $this->myUserDBO->query()->forUserId($userId)->first();
    }

    public function getUserDataForUserId(int $userId) {
        if (Cache::has("userData-{$userId}")) {
            return Cache::get("userData-{$userId}");
        }
        $item = $this->myUserDataDBO->query()->forUserId($userId)->first();
        $userData = $item ? $item : $this->createUserDataDboForUserId($userId);
        Cache::put("userData-{$userId}", $userData, 10);
        return $userData;
    }

    public function updateAvatarTimeForUserId(int $userId) {
        $item = $this->getUserDataForUserId($userId);

        $item->avatarUpdatedAt = time();
        $item->save();
    }

    public function updateUserData(UserDataDBO $item) {
        if (!$item) {
            return;
        }

        $item->save();
        Cache::put("userData-{$item->userId}", $item, 10);
    }

    public function updateVisitOnProfileId(int $userId, int $profileId) {
        $item = $this->myUserProfileVisitDBO->query()->whereVisitOnProfileId($userId, $profileId)->first();
        if (!$item) {
            $item = $this->myUserProfileVisitDBO->newInstance();
        }
        $item->profileId = $profileId;
        $item->userId = $userId;
        $item->updatedAt = time();
        $item->save();
    }

    public function getUserByNickname(string $nickname) {
        return $this->myUserDBO->query()
            ->whereNickname($nickname)
            ->first();
    }

    public function getUsersBySearch(string $nickname) {
        return $this->myUserDBO->query()
            ->whereNicknameSearch($nickname)
            ->get();
    }

    private function createUserDataDboForUserId(int $userId) {
        $item = $this->myUserDataDBO->newInstance();
        $item->userId = $userId;
        $item->save();
        return $item;
    }
}
