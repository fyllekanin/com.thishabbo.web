<?php

namespace App\Http\Impl\Sitecp\Shop;

use App\EloquentModels\Group\Group;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\User\Accolade;
use App\Helpers\UserHelper;
use App\Models\Logger\Action;

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
            Action::getAction(Action::CREATED_USER_SUBSCRIPTION),
            Action::getAction(Action::UPDATED_USER_SUBSCRIPTION),
            Action::getAction(Action::DELETED_USER_SUBSCRIPTION),
            Action::getAction(Action::UPDATED_USERS_BASIC_SETTINGS),
            Action::getAction(Action::UPDATED_USERS_GROUPS),
            Action::getAction(Action::CREATED_ACCOLADE),
            Action::getAction(Action::UPDATED_ACCOLADE),
            Action::getAction(Action::DELETED_ACCOLADE),
            Action::getAction(Action::DELETED_AVATAR),
            Action::getAction(Action::DELETED_COVER_PHOTO),
            Action::getAction(Action::BANNED_USER),
            Action::getAction(Action::UNBANNED_USER)
        ];
    }

    private function getNewValue($item) {
        switch ($item->action) {
            case Action::getAction(Action::CREATED_USER_SUBSCRIPTION):
            case Action::getAction(Action::UPDATED_USER_SUBSCRIPTION):
                return Subscription::withoutGlobalScope('nonHardDeleted')
                    ->where('subscriptionId', $item->getData()->subscriptionId)
                    ->value('title');
            case Action::getAction(Action::DELETED_USER_SUBSCRIPTION):
                return '';
            case Action::getAction(Action::CREATED_ACCOLADE):
            case Action::getAction(Action::UPDATED_ACCOLADE):
                return Accolade::withoutGlobalScope('nonHardDeleted')
                    ->where('accoladeId', $item->getData()->accoladeId)
                    ->value('role');
            case Action::getAction(Action::DELETED_ACCOLADE):
                return '';
            case Action::getAction(Action::UPDATED_USERS_GROUPS):
                return implode(', ', Group::whereIn('groupId', $item->getData()->after)->pluck('name')->toArray());
            case Action::getAction(Action::UPDATED_USERS_BASIC_SETTINGS):
                return 'Nickname: ' . $item->getData()->afterNickname . ', Habbo: ' . $item->getData()->afterHabbo;
            default:
                return '';
        }
    }

    private function getOldValue($item) {
        switch ($item->action) {
            case Action::getAction(Action::CREATED_USER_SUBSCRIPTION):
                return '';
            case Action::getAction(Action::UPDATED_USER_SUBSCRIPTION):
            case Action::getAction(Action::DELETED_USER_SUBSCRIPTION):
                return Subscription::withoutGlobalScope('nonHardDeleted')
                    ->where('subscriptionId', $item->getData()->subscriptionId)
                    ->value('title');
            case Action::getAction(Action::CREATED_ACCOLADE):
                return '';
            case Action::getAction(Action::UPDATED_ACCOLADE):
            case Action::getAction(Action::DELETED_ACCOLADE):
                return Accolade::withoutGlobalScope('nonHardDeleted')
                    ->where('accoladeId', $item->getData()->accoladeId)
                    ->value('role');
            case Action::getAction(Action::UPDATED_USERS_GROUPS):
                return implode(', ', Group::whereIn('groupId', $item->getData()->before)->pluck('name')->toArray());
            case Action::getAction(Action::UPDATED_USERS_BASIC_SETTINGS):
                return 'Nickname: ' . $item->getData()->beforeNickname . ', Habbo: ' . $item->getData()->beforeHabbo;
            default:
                return '';
        }
    }
}