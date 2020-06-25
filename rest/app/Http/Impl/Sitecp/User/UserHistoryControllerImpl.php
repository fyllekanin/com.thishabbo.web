<?php

namespace App\Http\Impl\Sitecp\Shop;

use App\Constants\LogType;
use App\EloquentModels\Group\Group;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\User\Accolade;
use App\Helpers\UserHelper;

class UserHistoryControllerImpl {
    public function mapItem($item) {
        $oldValue = $this->getOldValue($item);
        $newValue = $this->getNewValue($item);

        return [
            'logId' => $item->logId,
            'action' => $item->action,
            'user' => UserHelper::getSlimUser($item->userId),
            'oldValue' => $oldValue,
            'newValue' => $newValue,
            'createdAt' => $item->createdAt->timestamp
        ];
    }

    public function getSupportedActionIds() {
        return [
            LogType::getAction(LogType::CREATED_USER_SUBSCRIPTION),
            LogType::getAction(LogType::UPDATED_USER_SUBSCRIPTION),
            LogType::getAction(LogType::DELETED_USER_SUBSCRIPTION),
            LogType::getAction(LogType::UPDATED_USERS_BASIC_SETTINGS),
            LogType::getAction(LogType::UPDATED_USERS_GROUPS),
            LogType::getAction(LogType::CREATED_ACCOLADE),
            LogType::getAction(LogType::UPDATED_ACCOLADE),
            LogType::getAction(LogType::DELETED_ACCOLADE),
            LogType::getAction(LogType::DELETED_AVATAR),
            LogType::getAction(LogType::DELETED_COVER_PHOTO),
            LogType::getAction(LogType::BANNED_USER),
            LogType::getAction(LogType::UNBANNED_USER)
        ];
    }

    private function getNewValue($item) {
        switch ($item->action) {
            case LogType::getAction(LogType::CREATED_USER_SUBSCRIPTION):
            case LogType::getAction(LogType::UPDATED_USER_SUBSCRIPTION):
                return Subscription::withoutGlobalScope('nonHardDeleted')
                    ->where('subscriptionId', $item->getData()->subscriptionId)
                    ->value('title');
            case LogType::getAction(LogType::CREATED_ACCOLADE):
            case LogType::getAction(LogType::UPDATED_ACCOLADE):
                return Accolade::withoutGlobalScope('nonHardDeleted')
                    ->where('accoladeId', $item->getData()->accoladeId)
                    ->value('role');
            case LogType::getAction(LogType::UPDATED_USERS_GROUPS):
                return implode(', ', Group::whereIn('groupId', $item->getData()->after)->pluck('name')->toArray());
            case LogType::getAction(LogType::UPDATED_USERS_BASIC_SETTINGS):
                return 'Nickname: '.$item->getData()->afterNickname.', Habbo: '.$item->getData()->afterHabbo;
            default:
                return '';
        }
    }

    private function getOldValue($item) {
        switch ($item->action) {
            case LogType::getAction(LogType::UPDATED_USER_SUBSCRIPTION):
            case LogType::getAction(LogType::DELETED_USER_SUBSCRIPTION):
                return Subscription::withoutGlobalScope('nonHardDeleted')
                    ->where('subscriptionId', $item->getData()->subscriptionId)
                    ->value('title');
            case LogType::getAction(LogType::UPDATED_ACCOLADE):
            case LogType::getAction(LogType::DELETED_ACCOLADE):
                return Accolade::withoutGlobalScope('nonHardDeleted')
                    ->where('accoladeId', $item->getData()->accoladeId)
                    ->value('role');
            case LogType::getAction(LogType::UPDATED_USERS_GROUPS):
                return implode(', ', Group::whereIn('groupId', $item->getData()->before)->pluck('name')->toArray());
            case LogType::getAction(LogType::UPDATED_USERS_BASIC_SETTINGS):
                return 'Nickname: '.$item->getData()->beforeNickname.', Habbo: '.$item->getData()->beforeHabbo;
            default:
                return '';
        }
    }
}
