<?php

namespace App\Repositories\Impl\AvatarRepository;

use App\Repositories\Repository\AvatarRepository;
use App\Repositories\Repository\GroupRepository;
use App\Repositories\Repository\SettingRepository;
use App\Repositories\Repository\SubscriptionRepository;
use App\Repositories\Repository\UserRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class AvatarRepositoryImpl implements AvatarRepository {

    private $myDBO;

    private $mySettingRepository;
    private $myGroupRepository;
    private $mySubscriptionRepository;
    private $myUserRepository;

    public function __construct(
        SettingRepository $settingRepository,
        GroupRepository $groupRepository,
        SubscriptionRepository $subscriptionRepository,
        UserRepository $userRepository
    ) {
        $this->myDBO = new AvatarDBO();

        $this->mySettingRepository = $settingRepository;
        $this->myGroupRepository = $groupRepository;
        $this->mySubscriptionRepository = $subscriptionRepository;
        $this->myUserRepository = $userRepository;
    }

    public function getAvatarById(int $avatarId) {
        return $this->myDBO->query()->withId($avatarId)->first();
    }

    public function getLatestAvatarsForUserId(int $userId) {
        return $this->myDBO->query()->forUserId($userId)->take(5)->get();
    }

    public function createAvatar(int $userId, int $width, int $height) {
        $item = new $this->myDBO;
        $item->userId = $userId;
        $item->width = $width;
        $item->height = $height;
        $item->save();

        return $item;
    }

    public function updateAvatarUpdatedAt(int $avatarId) {
        $item = $this->getAvatarById($avatarId);
        $item->updatedAt = time();
        $item->save();
    }

    public function getMaxAvatarSizeForUser(int $userId) {
        if (Cache::has("avatar-size-{$userId}")) {
            return Cache::get("avatar-size-{$userId}");
        }
        $subscriptions = $this->mySubscriptionRepository->getActiveSubscriptionsForUserId($userId);
        $groups = $this->myGroupRepository->getUsersGroupsByUserId($userId);
        $allowedSize = (object) [
            'width' => $this->getMaxAvatarWidth($subscriptions, $groups),
            'height' => $this->getMaxAvatarHeight($subscriptions, $groups)
        ];
        Cache::put("avatar-size-{$userId}", $allowedSize, 10);
        return $allowedSize;
    }

    public function backupCurrentAvatarForUser(int $userId) {
        $item = $this->getCurrentAvatarForUserId($userId);
        if (!$item || !File::exists($this->mySettingRepository->getResourcePath("images/users/{$userId}.gif"))) {
            return;
        }

        File::move(
            $this->mySettingRepository->getResourcePath("images/users/{$userId}.gif"),
            ($this->mySettingRepository->getResourcePath("images/old-avatars/{$item->avatarId}.gif"))
        );
    }

    public function isCurrentAvatarValidForUserId(int $userId) {
        $item = $this->getCurrentAvatarForUserId($userId);
        $allowedSize = $this->getMaxAvatarSizeForUser($userId);

        return $item && $item->width <= $allowedSize->width && $item->height <= $allowedSize->height;
    }

    public function makeCurrentAvatarValid(int $userId) {
        $this->backupCurrentAvatarForUser($userId);
        $currentAvatar = $this->getCurrentAvatarForUserId($userId);
        if (!$currentAvatar) {
            return;
        }

        $allowedSize = $this->getMaxAvatarSizeForUser($userId);

        $image = Image::make(
            $this->mySettingRepository->getResourcePath('images/old-avatars/'.$currentAvatar->avatarId.'.gif')
        )
            ->resize($allowedSize->width, $allowedSize->height)
            ->save($this->mySettingRepository->getResourcePath("images/users/{$userId}.gif"));

        $item = $this->myDBO->newInstance();
        $item->userId = $userId;
        $item->width = $image->width();
        $item->height = $image->height();
        $item->save();

        $this->myUserRepository->updateAvatarTimeForUserId($userId);
    }

    private function getCurrentAvatarForUserId(int $userId) {
        return $this->myDBO->forUserId($userId)->orderByLatestUpdate()->first();
    }

    private function getMaxAvatarWidth($subscriptions, $groups) {
        $size = 200;

        foreach ($groups as $group) {
            $size = $group->avatarWidth > $size ? $group->avatarWidth : $size;
        }

        foreach ($subscriptions as $subscription) {
            $size = $subscription->avatarWidth > $size ? $subscription->avatarWidth : $size;
        }
        return $size;
    }

    private function getMaxAvatarHeight($subscriptions, $groups) {
        $size = 200;

        foreach ($groups as $group) {
            $size = $group->avatarHeight > $size ? $group->avatarHeight : $size;
        }

        foreach ($subscriptions as $subscription) {
            $size = $subscription->avatarHeight > $size ? $subscription->avatarHeight : $size;
        }
        return $size;
    }
}
