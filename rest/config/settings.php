<?php

$settingKeys = new \stdClass();
$settingKeys->botUserId = 'welcome_bot_userId';
$settingKeys->welcomeBotMessage = 'welcome_bot_message';
$settingKeys->welcomeBotCategoryId = 'welcome_bot_categoryId';

$settingKeys->isMaintenance = 'is_maintenance';
$settingKeys->maintenanceContent = 'maintenance_content';

$settingKeys->radio = 'radio';
$settingKeys->navigation = 'navigation';

$settingKeys->staffOfTheWeek = 'staff_of_the_week';
$settingKeys->memberOfTheMonth = 'member_of_the_month';
$settingKeys->banOnSight = 'ban_on_sight';
$settingKeys->doNotHire = 'do_not_hire';

$ignoredNotificationKeys = new \stdClass();
$ignoredNotificationKeys->QUOTE_NOTIFICATIONS = 1;
$ignoredNotificationKeys->MENTION_NOTIFICATIONS = 2;
$ignoredNotificationKeys->AUTO_SUBSCRIBE_THREAD = 4;

return [
    'KEYS' => $settingKeys,
    'IGNORED_NOTIFICATIONS' => $ignoredNotificationKeys
];
