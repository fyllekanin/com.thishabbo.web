<?php

namespace App\Factories\Notification;

use App\Factories\Notification\Views\BadgeView;
use App\Factories\Notification\Views\CategoryView;
use App\Factories\Notification\Views\InfractionView;
use App\Factories\Notification\Views\ThreadView;
use App\Models\Notification\Type;
use Illuminate\Support\Facades\DB;

class NotificationFactory {

    public static function ofType($notification, $user) {
        $item = null;
        switch ($notification->type) {
            case Type::getType(Type::BADGE):
                $item = new BadgeView($notification);
                break;
            case Type::getType(Type::CATEGORY_SUBSCRIPTION):
                $item = new CategoryView($notification, $user);
                break;
            case Type::getType(Type::MENTION):
            case Type::getType(Type::QUOTE):
            case Type::getType(Type::THREAD_SUBSCRIPTION):
                $item = new ThreadView($notification, $user);
                break;
            case Type::getType(Type::INFRACTION_GIVEN):
            case Type::getType(Type::INFRACTION_DELETED):
                $item = new InfractionView($notification);
        }

        return $item;
    }

    public static function newInfractionGiven($userId, $senderId, $contentId) {
        DB::table('notifications')->insert([
            'userId' => $userId,
            'senderId' => $senderId,
            'type' => Type::getType(Type::INFRACTION_GIVEN),
            'contentId' => $contentId,
            'createdAt' => time()
        ]);
    }

    public static function newInfractionDeleted($userId, $senderId, $contentId) {
        DB::table('notifications')->insert([
            'userId' => $userId,
            'senderId' => $senderId,
            'type' => Type::getType(Type::INFRACTION_DELETED),
            'contentId' => $contentId,
            'createdAt' => time()
        ]);
    }
}