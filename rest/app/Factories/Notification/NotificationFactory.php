<?php

namespace App\Factories\Notification;

use App\EloquentModels\User\VisitorMessage;
use App\Factories\Notification\Views\BadgeView;
use App\Factories\Notification\Views\CategoryView;
use App\Factories\Notification\Views\FollowerView;
use App\Factories\Notification\Views\InfractionView;
use App\Factories\Notification\Views\ThreadView;
use App\Factories\Notification\Views\VisitorMessageView;
use App\Models\Notification\Type;
use Illuminate\Support\Facades\DB;

class NotificationFactory {

    /**
     * @param $notification
     * @param $user
     *
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     *
     * @return BadgeView|CategoryView|FollowerView|InfractionView|ThreadView|VisitorMessageView|null
     */
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
                break;
            case Type::getType(Type::FOLLOWED):
                $item = new FollowerView($notification);
                break;
            case Type::getType(Type::VISITOR_MESSAGE):
                $item = new VisitorMessageView($notification);
                break;
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

    public static function followedUser($userId, $senderId) {
        DB::table('notifications')->insert([
            'userId' => $userId,
            'senderId' => $senderId,
            'type' => Type::getType(Type::FOLLOWED),
            'contentId' => 0,
            'createdAt' => time()
        ]);
    }

    public static function newVisitorMessage(VisitorMessage $visitorMessage) {
        $receiverIds = [$visitorMessage->hostId];
        if ($visitorMessage->parentId > 0) {
            VisitorMessage::where('parentId', $visitorMessage->parentId)->orWhere('visitorMessageId', $visitorMessage->parentId)->pluck('userId')
                ->filter(function ($userId) use ($visitorMessage) {
                    return $userId != $visitorMessage->userId;
                })
                ->each(function ($userId) use ($receiverIds) {
                    $receiverIds[] = $userId;
                });
        }

        $notifications = array_map(function ($userId) use ($visitorMessage) {
            return [
                'userId' => $userId,
                'senderId' => $visitorMessage->userId,
                'type' => Type::getType(Type::VISITOR_MESSAGE),
                'contentId' => $visitorMessage->visitorMessageId,
                'createdAt' => time()
            ];
        }, array_unique($receiverIds));

        DB::table('notifications')->insert($notifications);
    }
}