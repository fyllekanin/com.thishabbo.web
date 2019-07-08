<?php

namespace App\Factories\Notification;

use App\EloquentModels\User\VisitorMessage;
use App\Factories\Notification\Views\BadgeView;
use App\Factories\Notification\Views\CategoryView;
use App\Factories\Notification\Views\FollowerView;
use App\Factories\Notification\Views\InfractionView;
use App\Factories\Notification\Views\LikeDjView;
use App\Factories\Notification\Views\ThreadView;
use App\Factories\Notification\Views\VisitorMessageView;
use App\Models\Notification\Type;
use App\Utils\Iterables;
use Illuminate\Support\Facades\DB;

class NotificationFactory {

    /**
     * @param $notification
     *
     * @return BadgeView|CategoryView|FollowerView|InfractionView|ThreadView|VisitorMessageView|null
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     *
     */
    public static function ofType($notification) {
        $item = null;
        switch ($notification->type) {
            case Type::getType(Type::BADGE):
                $item = new BadgeView($notification);
                break;
            case Type::getType(Type::CATEGORY_SUBSCRIPTION):
                $item = new CategoryView($notification);
                break;
            case Type::getType(Type::MENTION):
            case Type::getType(Type::QUOTE):
            case Type::getType(Type::THREAD_SUBSCRIPTION):
            case Type::getType(Type::LIKE_POST):
                $item = new ThreadView($notification);
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
            case Type::getType(Type::LIKE_DJ):
                $item = new LikeDjView($notification);
                break;
        }

        return $item;
    }

    public static function newLikeDj($userId, $senderId) {
        DB::table('notifications')->insert([
            'userId' => $userId,
            'senderId' => $senderId,
            'type' => Type::getType(Type::LIKE_DJ),
            'contentId' => 0,
            'createdAt' => time()
        ]);
    }

    public static function newLikePost($userId, $senderId, $contentId) {
        DB::table('notifications')->insert([
            'userId' => $userId,
            'senderId' => $senderId,
            'type' => Type::getType(Type::LIKE_POST),
            'contentId' => $contentId,
            'createdAt' => time()
        ]);
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
                ->each(function ($userId) use ($receiverIds) {
                    $receiverIds[] = $userId;
                });
        }

        $receiverIds = Iterables::filter($receiverIds, function ($userId) use ($visitorMessage) {
            return $userId != $visitorMessage->userId;
        });
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