<?php

namespace App\Factories\Notification;

use App\Constants\NotificationTypes;
use App\EloquentModels\User\VisitorMessage;
use App\Factories\Notification\Views\BadgeView;
use App\Factories\Notification\Views\CategoryView;
use App\Factories\Notification\Views\FollowerView;
use App\Factories\Notification\Views\InfractionView;
use App\Factories\Notification\Views\ThreadView;
use App\Factories\Notification\Views\UserView;
use App\Factories\Notification\Views\VisitorMessageView;
use App\Utils\Iterables;
use Illuminate\Support\Facades\DB;

/**
 * Class NotificationFactory
 *
 * @package                                      App\Factories\Notification
 * @SuppressWarnings(PHPMD.TooManyPublicMethods)
 */
class NotificationFactory {

    /**
     * @param $notification
     *
     * @param $user
     *
     * @return BadgeView|CategoryView|FollowerView|InfractionView|ThreadView|VisitorMessageView|null
     */
    public static function ofType($notification, $user) {
        $item = null;
        switch ($notification->type) {
            case NotificationTypes::BADGE:
                $item = new BadgeView($notification);
                break;
            case NotificationTypes::CATEGORY_SUBSCRIPTION:
                $item = new CategoryView($notification);
                break;
            case NotificationTypes::MENTION:
            case NotificationTypes::QUOTE:
            case NotificationTypes::THREAD_SUBSCRIPTION:
            case NotificationTypes::LIKE_POST:
                $item = new ThreadView($notification, $user);
                break;
            case NotificationTypes::INFRACTION_GIVEN:
            case NotificationTypes::INFRACTION_DELETED:
                $item = new InfractionView($notification);
                break;
            case NotificationTypes::FOLLOWED:
                $item = new FollowerView($notification);
                break;
            case NotificationTypes::VISITOR_MESSAGE:
                $item = new VisitorMessageView($notification);
                break;
            case NotificationTypes::LIKE_DJ:
            case NotificationTypes::LIKE_HOST:
            case NotificationTypes::RADIO_REQUEST:
            case NotificationTypes::REFERRAL:
            case NotificationTypes::SENT_CREDITS:
                $item = new UserView($notification);
                break;
        }

        return $item;
    }

    public static function newSentThc($userId, $senderId, $logId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::SENT_CREDITS,
                'contentId' => $logId,
                'createdAt' => time()
            ]
        );
    }

    public static function newReferral($userId, $senderId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::REFERRAL,
                'contentId' => 0,
                'createdAt' => time()
            ]
        );
    }

    public static function newRadioRequest($userId, $senderId, $requestId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::RADIO_REQUEST,
                'contentId' => $requestId,
                'createdAt' => time()
            ]
        );
    }

    public static function newLikeHost($userId, $senderId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::LIKE_HOST,
                'contentId' => 0,
                'createdAt' => time()
            ]
        );
    }

    public static function newLikeDj($userId, $senderId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::LIKE_DJ,
                'contentId' => 0,
                'createdAt' => time()
            ]
        );
    }

    public static function newLikePost($userId, $senderId, $contentId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::LIKE_POST,
                'contentId' => $contentId,
                'createdAt' => time()
            ]
        );
    }

    public static function newInfractionGiven($userId, $senderId, $contentId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::INFRACTION_GIVEN,
                'contentId' => $contentId,
                'createdAt' => time()
            ]
        );
    }

    public static function newInfractionDeleted($userId, $senderId, $contentId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::INFRACTION_DELETED,
                'contentId' => $contentId,
                'createdAt' => time()
            ]
        );
    }

    public static function followedUser($userId, $senderId) {
        DB::table('notifications')->insert(
            [
                'userId' => $userId,
                'senderId' => $senderId,
                'type' => NotificationTypes::FOLLOWED,
                'contentId' => 0,
                'createdAt' => time()
            ]
        );
    }

    public static function newVisitorMessage(VisitorMessage $visitorMessage) {
        $receiverIds = array ();

        if ($visitorMessage->parentId > 0) {
            $receiverIds = VisitorMessage::where('parentId', $visitorMessage->parentId)
                ->orWhere('visitorMessageId', $visitorMessage->parentId)
                ->pluck('userId')
                ->toArray();
        }

        $receiverIds[] = $visitorMessage->hostId;

        $receiverIds = Iterables::filter(
            $receiverIds,
            function ($userId) use ($visitorMessage) {
                return $userId != $visitorMessage->userId;
            }
        );
        $notifications = array_map(
            function ($userId) use ($visitorMessage) {
                return [
                    'userId' => $userId,
                    'senderId' => $visitorMessage->userId,
                    'type' => NotificationTypes::VISITOR_MESSAGE,
                    'contentId' => $visitorMessage->visitorMessageId,
                    'createdAt' => time()
                ];
            },
            array_unique($receiverIds)
        );

        DB::table('notifications')->insert($notifications);
    }
}
