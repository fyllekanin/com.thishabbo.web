<?php

return [
    'USER_UPDATE_TYPES' => [
        'CLEAR_SUBSCRIPTION' => 1,
        'CLEAR_GROUP' => 2
    ],
    'KEYS' => [
        'botUserId' => 'welcome_bot_userId',
        'welcomeBotMessage' => 'welcome_bot_message',
        'welcomeBotCategoryId' => 'welcome_bot_categoryId',
        'isMaintenance' => 'is_maintenance',
        'maintenanceContent' => 'maintenance_content',
        'radio' => 'radio',
        'navigation' => 'navigation',
        'staffOfTheWeek' => 'staff_of_the_week',
        'memberOfTheMonth' => 'member_of_the_month',
        'banOnSight' => 'ban_on_sight',
        'doNotHire' => 'no_not_hire',
        'eventsSay' => 'events_say',
        'homePageThreads' => 'home_page_threads'
    ],
    'IGNORED_NOTIFICATIONS' => [
        'QUOTE_NOTIFICATIONS' => 1,
        'MENTION_NOTIFICATIONS' => 2,
        'AUTO_SUBSCRIBE_THREAD' => 4
    ],
    'REGEX' => [
        'HABBO_ROOM' => '/(http(s)?:\/\/)?(www.)?habbo\.com\/hotel\?room=([0-9]+|(http(s)?:\/\/)?(www.)?habbo\.com\/hotel\?room=[0-9]+)?/si'
    ],
    'ACCOLADE_TYPES' => [
        [
            'id' => 1,
            'icon' => 'fa fa-trophy',
            'color' => '#FFB400'
        ],
        [
            'id' => 2,
            'icon' => 'fa fa-trophy',
            'color' => '#C66464'
        ],
        [
            'id' => 3,
            'icon' => 'fa fa-trophy',
            'color' => '#79B14E'
        ],
        [
            'id' => 4,
            'icon' => 'fa fa-trophy',
            'color' => '#4E4E4E'
        ],
        [
            'id' => 5,
            'icon' => 'fa fa-trophy',
            'color' => '#B4B6B9'
        ],
        [
            'id' => 6,
            'icon' => 'fa fa-trophy',
            'color' => '#437682'
        ],
        [
            'id' => 7,
            'icon' => 'fa fa-trophy',
            'color' => '#FFC0CB'
        ]
    ]
];
