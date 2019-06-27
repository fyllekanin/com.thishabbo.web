<?php

namespace App\Models\User;

class Point {

    CONST POST = [
        'description' => 'When a user post on the forum, credits/xp taken from owning category',
        'xp' => 0,
        'credits' => 0,
        'isCustom' => true
    ];

    CONST THREAD = [
        'description' => 'When a user create a thread on the forum, credits/xp taken from owning category',
        'xp' => 0,
        'credits' => 0,
        'isCustom' => true
    ];


    const VISITOR_MESSAGE = [
        'description' => 'When a user post a visitor message',
        'xp' => 4,
        'credits' => 0,
        'isCustom' => false
    ];
}