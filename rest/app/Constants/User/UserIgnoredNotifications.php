<?php

namespace App\Constants\User;

class UserIgnoredNotifications {

    const QUOTE_NOTIFICATIONS = 1;
    const MENTION_NOTIFICATIONS = 2;
    const AUTO_SUBSCRIBE_THREAD = 4;
    const DEPRECATED_DO_NOT_USE = 8;

    public static function getAsOptions() {
        return [
            'QUOTE_NOTIFICATIONS' => 1,
            'MENTION_NOTIFICATIONS' => 2,
            'AUTO_SUBSCRIBE_THREAD' => 4,
            'DEPRECATED_DO_NOT_USE' => 8
        ];
    }
}
