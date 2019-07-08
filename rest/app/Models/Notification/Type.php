<?php

namespace App\Models\Notification;

class Type {

    public static function getType($type) {
        return $type['type'];
    }

    const MENTION = [
        'type' => 1,
        'description' => 'When user is tagged in post'
    ];

    const QUOTE = [
        'type' => 2,
        'description' => 'When users post is quoted'
    ];

    const BADGE = [
        'type' => 3,
        'description' => 'When user receives badge'
    ];

    const THREAD_SUBSCRIPTION = [
        'type' => 4,
        'description' => 'When user have subscribed to a thread with a new post'
    ];

    const CATEGORY_SUBSCRIPTION = [
        'type' => 5,
        'description' => 'When user have subscribed to a category with a new thread'
    ];

    const INFRACTION_GIVEN = [
        'type' => 6,
        'description' => 'When user is given an infraction'
    ];

    const INFRACTION_DELETED = [
        'type' => 7,
        'description' => 'When infraction on a user is deleted'
    ];

    const FOLLOWED = [
        'type' => 8,
        'description' => 'When a user have received a new follower'
    ];

    const VISITOR_MESSAGE = [
        'type' => 9,
        'description' => 'When a user have posted a new visitor message'
    ];

    const LIKE_POST = [
        'type' => 10,
        'description' => 'When a user have liked a post'
    ];

    const LIKE_DJ = [
        'type' => 11,
        'description' => 'When a user have liked the DJ'
    ];
}
