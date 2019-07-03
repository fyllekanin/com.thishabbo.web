<?php

use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use Illuminate\Support\Facades\Route;

$permissions = ConfigHelper::getSitecpConfig();

Route::get('/ping', 'PageController@getPing');
Route::get('/dashboard/{clientTodayMidnight}', 'Sitecp\SitecpDashboardController@getDashboard');

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canReadServerLogs)], function () {
    Route::get('server-logs', 'Sitecp\LogsController@getServerLogs');
    Route::get('server-logs/{fileName}', 'Sitecp\LogsController@getServerLog');
});

Route::prefix('statistics')->group(function () {
    Route::get('/users/{year}/{month}', 'Sitecp\Statistics\UserStatisticsController@getUsersLoggedIn');
    Route::get('/posts/{year}/{month}', 'Sitecp\Statistics\ForumStatisticsController@getPosts');
    Route::get('/threads/{year}/{month}', 'Sitecp\Statistics\ForumStatisticsController@getThreads');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canSeeLogs)], function () {
    Route::get('/logs/{type}/page/{page}', 'Sitecp\LogsController@getLogs');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageTHC)], function () {
    Route::get('/thc/requests', 'Sitecp\User\UserThcController@getThcRequests');
    Route::put('/thc/requests', 'Sitecp\User\UserThcController@updateThcRequests');

    Route::get('/voucher-codes/page/{page}', 'Sitecp\User\UserThcController@getVoucherCodes');
    Route::post('/voucher-codes', 'Sitecp\User\UserThcController@createVoucherCode');
    Route::delete('/voucher-codes/{voucherCodeId}', 'Sitecp\User\UserThcController@deleteVoucherCode');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageForum)], function () use ($permissions) {
    Route::post('/categories', 'Sitecp\Forum\CategoriesController@createCategory');
    Route::put('/categories/{categoryId}', 'Sitecp\Forum\CategoriesController@updateCategory');
    Route::put('/categories/orders/update', 'Sitecp\Forum\CategoriesController@updateCategoryOrders');
    Route::get('/categories', 'Sitecp\Forum\CategoriesController@getCategories');
    Route::get('/categories/{categoryId}', 'Sitecp\Forum\CategoriesController@getCategory');
    Route::delete('/categories/{categoryId}', 'Sitecp\Forum\CategoriesController@deleteCategory');

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageForumPermissions)], function () {
        Route::get('/categories/permissions/{categoryId}/group/{groupId}', 'Sitecp\Forum\PermissionController@getGroupForumPermissions');
        Route::put('/categories/permissions/{categoryId}', 'Sitecp\Forum\PermissionController@updateGroupForumPermissions');
    });
});

Route::prefix('moderation')->group(function () use ($permissions) {
    Route::get('threads', 'Sitecp\Moderation\ForumController@getModerateThreads');
    Route::get('posts', 'Sitecp\Moderation\ForumController@getModeratePosts');
    Route::get('polls/page/{page}', 'Moderation\ThreadPollController@getPolls');
    Route::get('polls/{threadId}', 'Moderation\ThreadPollController@getPoll');

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canModerateVisitorMessage)], function () {
        Route::delete('visitor-message/{visitorMessageId}', 'Sitecp\Moderation\VisitorMessageController@deleteVisitorMessage');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canApprovePublicGroups)], function () {
        Route::get('groups', 'Sitecp\Group\GroupsController@getGroupApplications');
        Route::post('groups/approve', 'Sitecp\Group\GroupsController@approveGroupApplication');
        Route::delete('groups/deny/{groupRequestId}', 'Sitecp\Group\GroupsController@denyGroupApplication');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canDoInfractions)], function () {
        Route::get('infract/{userId}', 'Sitecp\Moderation\InfractionController@getInfractionContext');
        Route::post('infract', 'Sitecp\Moderation\InfractionController@createInfraction');

        Route::get('infractions/page/{page}', 'Sitecp\Moderation\InfractionController@getInfractions');
        Route::delete('infraction/{infractionId}', 'Sitecp\Moderation\InfractionController@deleteInfraction');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageInfractions)], function () {
        Route::get('auto-bans/page/{page}', 'Sitecp\Moderation\AutoBanController@getAutoBans');
        Route::get('auto-bans/{autoBanId}', 'Sitecp\Moderation\AutoBanController@getAutoBan');
        Route::post('auto-bans', 'Sitecp\Moderation\AutoBanController@createAutoBan');
        Route::put('auto-bans/{autoBanId}', 'Sitecp\Moderation\AutoBanController@updateAutoBan');
        Route::delete('auto-bans/{autoBanId}', 'Sitecp\Moderation\AutoBanController@deleteAutoBan');

        Route::get('infraction-levels/page/{page}', 'Sitecp\Moderation\InfractionLevelsController@getInfractionLevels');
        Route::get('infraction-levels/{infractionLevelId}', 'Sitecp\Moderation\InfractionLevelsController@getInfractionLevel');
        Route::put('infraction-levels/{infractionLevelId}', 'Sitecp\Moderation\InfractionLevelsController@updateInfractionLevel');
        Route::delete('infraction-levels/{infractionLevelId}', 'Sitecp\Moderation\InfractionLevelsController@deleteInfractionLevel');
        Route::post('infraction-levels', 'Sitecp\Moderation\InfractionLevelsController@createInfractionLevel');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canBanUser)], function () {
        Route::get('/bans/page/{page}', 'Sitecp\User\BansController@getBannedUsers');
    });
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageGroups)], function () {
    Route::post('/groups', 'Sitecp\Group\GroupsController@createGroup');
    Route::put('/groups/{groupId}', 'Sitecp\Group\GroupsController@updateGroup');
    Route::get('/groups/list/page/{page}', 'Sitecp\Group\GroupsController@getGroups');
    Route::get('/groups/{groupId}', 'Sitecp\Group\GroupsController@getGroup');
    Route::delete('/groups/{groupId}', 'Sitecp\Group\GroupsController@deleteGroup');

    Route::get('/groups/{groupId}/forum-permissions', 'Sitecp\Group\GroupPermissionsController@getGroupForumPermissions');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canSeeIps)], function () {
    Route::get('/users/ip-search', 'IpSearchController@getIpSearch');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware([$permissions->canEditUserBasic, $permissions->canEditUserAdvanced,
    $permissions->canBanUser, $permissions->canRemoveEssentials, $permissions->canDoInfractions, $permissions->canManageSubscriptions])], function () use ($permissions) {

    Route::get('/users/list/page/{page}', 'Sitecp\User\UserController@getUsers');
    Route::get('/users/{userId}/history/page/{page}', 'Sitecp\User\UserHistoryController@getHistory');

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageSubscriptions)], function () {
        Route::get('/users/{userId}/subscriptions', 'Sitecp\User\UserSubscriptionsController@getUserSubscriptions');

        Route::post('/users/{userId}/subscriptions', 'Sitecp\User\UserSubscriptionsController@createUserSubscription');
        Route::put('/users/subscriptions/{userSubscriptionId}', 'Sitecp\User\UserSubscriptionsController@updateUserSubscription');
        Route::delete('/users/subscriptions/{userSubscriptionId}', 'Sitecp\User\UserSubscriptionsController@deleteUserSubscription');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canRemoveEssentials)], function () {
        Route::get('/users/{userId}/essentials', 'Sitecp\User\UserEssentialsController@getUser');

        Route::delete('/users/{userId}/avatar', 'Sitecp\User\UserEssentialsController@deleteAvatar');
        Route::delete('/users/{userId}/cover-photo', 'Sitecp\User\UserEssentialsController@deleteCoverPhoto');
        Route::delete('/users/{userId}/signature', 'Sitecp\User\UserEssentialsController@deleteSignature');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canMergeUsers)], function () {
        Route::post('/users/merge/source/{srcUserId}/destination/{destUserId}', 'Sitecp\User\UserController@mergeUsers');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware([$permissions->canEditUserBasic, $permissions->canEditUserAdvanced])], function () {
        Route::get('/users/{userId}/basic', 'Sitecp\User\UserController@getUserBasic');
        Route::put('/users/{userId}/basic', 'Sitecp\User\UserController@updateUserBasic');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canEditUserAdvanced)], function () {
        Route::get('/users/{userId}/groups', 'Sitecp\User\UserGroupsController@getUserGroups');
        Route::put('/users/{userId}/groups', 'Sitecp\User\UserGroupsController@updateUserGroups');

        Route::get('/users/{userId}/accolades', 'Sitecp\User\AccoladesController@getAccoladePage');
        Route::post('/users/{userId}/accolades', 'Sitecp\User\AccoladesController@createAccolade');
        Route::put('/users/{userId}/accolades/{accoladeId}', 'Sitecp\User\AccoladesController@updateAccolade');
        Route::delete('/users/{userId}/accolades/{accoladeId}', 'Sitecp\User\AccoladesController@deleteAccolade');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canBanUser)], function () {
        Route::get('/users/{userId}/bans', 'Sitecp\User\BansController@getUserBans');
        Route::post('/users/{userId}/ban', 'Sitecp\User\BansController@createUserBan');
        Route::put('/users/{userId}/lift/{banId}', 'Sitecp\User\BansController@liftUserBan');
    });
});

Route::prefix('content')->group(function () use ($permissions) {

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canEditWebsiteSettings)], function () {
        Route::get('/staff-of-the-week', 'Sitecp\Settings\StaffSpotlightController@getStaffOfTheWeek');
        Route::put('/staff-of-the-week', 'Sitecp\Settings\StaffSpotlightController@updateStaffOfTheWeek');

        Route::get('/member-of-the-month', 'Sitecp\Settings\StaffSpotlightController@getMemberOfTheMonth');
        Route::put('/member-of-the-month', 'Sitecp\Settings\StaffSpotlightController@updateMemberOfTheMonth');

        Route::get('/notices', 'Sitecp\Settings\NoticeController@getNotices');
        Route::delete('/notices/{noticeId}', 'Sitecp\Settings\NoticeController@deleteNotice');
        Route::post('/notices', 'Sitecp\Settings\NoticeController@createNotice');
        Route::put('/notices', 'Sitecp\Settings\NoticeController@updateNoticeOrder');

        Route::get('/welcome-bot', 'Sitecp\Settings\WelcomeBotController@getWelcomeBotSettings');
        Route::put('/welcome-bot', 'Sitecp\Settings\WelcomeBotController@updateWelcomeBotSettings');

        Route::get('/maintenance', 'Sitecp\Settings\GeneralSettingsController@getMaintenance');
        Route::put('/maintenance', 'Sitecp\Settings\GeneralSettingsController@updateMaintenance');

        Route::get('/navigation', 'Sitecp\Settings\PageSettingsController@getNavigation');
        Route::put('/navigation', 'Sitecp\Settings\PageSettingsController@updateNavigation');

        Route::get('/pages', 'Sitecp\Settings\PageSettingsController@getPages');
        Route::post('/pages', 'Sitecp\Settings\PageSettingsController@createPage');
        Route::get('/pages/{pageId}', 'Sitecp\Settings\PageSettingsController@getPage');
        Route::put('/pages/{pageId}', 'Sitecp\Settings\PageSettingsController@updatePage');
        Route::delete('/pages/{pageId}', 'Sitecp\Settings\PageSettingsController@deletePage');

        Route::get('/site-messages', 'Sitecp\Settings\GeneralSettingsController@getSiteMessageS');
        Route::get('/site-messages/{siteMessageId}', 'Sitecp\Settings\GeneralSettingsController@getSiteMessage');
        Route::post('/site-messages', 'Sitecp\Settings\GeneralSettingsController@createSiteMessage');
        Route::put('/site-messages/{siteMessageId}', 'Sitecp\Settings\GeneralSettingsController@updateSiteMessage');
        Route::delete('/site-messages/{siteMessageId}', 'Sitecp\Settings\GeneralSettingsController@deleteSiteMessage');

        Route::get('/themes', 'Sitecp\Settings\ThemeController@getThemes');
        Route::get('/themes/{themeId}', 'Sitecp\Settings\ThemeController@getTheme');
        Route::post('/themes', 'Sitecp\Settings\ThemeController@createTheme');
        Route::put('/themes/{themeId}', 'Sitecp\Settings\ThemeController@updateTheme');
        Route::delete('/themes/{themeId}', 'Sitecp\Settings\ThemeController@deleteTheme');
        Route::put('/themes/default/clear', 'Sitecp\Settings\ThemeController@clearDefault');
        Route::put('/themes/default/{themeId}', 'Sitecp\Settings\ThemeController@makeThemeDefault');

        Route::get('/home-page-threads', 'Sitecp\Settings\PageSettingsController@getHomePageThreads');
        Route::put('/home-page-threads', 'Sitecp\Settings\PageSettingsController@updateHomePageThreads');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageBBcodes)], function () {
        Route::get('/bbcodes', 'Sitecp\Content\BBcodeController@getBBcodes');
        Route::get('/bbcodes/{bbcodeId}', 'Sitecp\Content\BBcodeController@getBBcode');
        Route::delete('/bbcodes/{bbcodeId}', 'Sitecp\Content\BBcodeController@deleteBBcode');
        Route::post('/bbcodes/{bbcodeId}', 'Sitecp\Content\BBcodeController@updateBBcode');
        Route::post('/bbcodes', 'Sitecp\Content\BBcodeController@createBBcode');
    });

    Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageGroupsList)], function () {
        Route::get('/groupslist', 'Sitecp\Group\GroupsListController@getGroupsList');
        Route::put('/groupslist', 'Sitecp\Group\GroupsListController@updateGroupsList');
    });
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManagePrefixes)], function () {
    Route::get('/prefixes', 'Sitecp\Forum\PrefixController@getPrefixes');
    Route::post('/prefixes', 'Sitecp\Forum\PrefixController@createPrefix');
    Route::get('/prefixes/{prefixId}', 'Sitecp\Forum\PrefixController@getPrefix');
    Route::delete('/prefixes/{prefixId}', 'Sitecp\Forum\PrefixController@deletePrefix');
    Route::put('/prefixes/{prefixId}', 'Sitecp\Forum\PrefixController@updatePrefix');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageBadges)], function () {
    Route::post('/badges', 'Sitecp\BadgesController@createBadge');
    Route::post('/badges/{badgeId}', 'Sitecp\BadgesController@updateBadge');
    Route::get('/badges/list/page/{page}', 'Sitecp\BadgesController@getBadges');
    Route::get('/badges/{badgeId}', 'Sitecp\BadgesController@getBadge');
    Route::delete('/badges/{badgeId}', 'Sitecp\BadgesController@deleteBadge');

    Route::get('/badges/{badgeId}/users', 'Sitecp\BadgesController@getUsersWithBadge');
    Route::put('/badges/{badgeId}/users', 'Sitecp\BadgesController@updateUsersWithBadge');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageShop)], function () {
    Route::get('/shop/items/page/{page}', 'Sitecp\Shop\ItemsController@getItems');
    Route::get('/shop/items/{itemId}', 'Sitecp\Shop\ItemsController@getItem');

    Route::post('/shop/items', 'Sitecp\Shop\ItemsController@createItem');
    Route::post('/shop/items/{itemId}', 'Sitecp\Shop\ItemsController@updateItem');
    Route::delete('/shop/items/{itemId}', 'Sitecp\Shop\ItemsController@deleteItem');

    Route::get('/shop/loot-boxes/page/{page}', 'Sitecp\Shop\LootBoxesController@getItems');
    Route::get('/shop/loot-boxes/{lootBoxId}', 'Sitecp\Shop\LootBoxesController@getItem');
    Route::get('/shop/loot-boxes/items/page/{page}', 'Sitecp\Shop\LootBoxesController@getShopItems');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageSubscriptions)], function () {
    Route::get('/shop/subscriptions/page/{page}', 'Sitecp\Shop\SubscriptionsController@getSubscriptions');
    Route::get('/shop/subscriptions/{subscriptionId}', 'Sitecp\Shop\SubscriptionsController@getSubscription');
    Route::post('/shop/subscriptions', 'Sitecp\Shop\SubscriptionsController@createSubscription');
    Route::put('/shop/subscriptions/{subscriptionId}', 'Sitecp\Shop\SubscriptionsController@updateSubscription');
    Route::delete('/shop/subscriptions/{subscriptionId}', 'Sitecp\Shop\SubscriptionsController@deleteSubscription');
});

Route::group(['middleware' => PermissionHelper::getSitecpMiddleware($permissions->canManageBetting)], function () {

    Route::get('/betting/categories/{page}', 'Sitecp\Betting\CategoryController@getBetCategories');
    Route::get('/betting/category/{betCategoryId}', 'Sitecp\Betting\CategoryController@getBetCategory');
    Route::delete('/betting/category/{betCategoryId}', 'Sitecp\Betting\CategoryController@deleteBetCategory');
    Route::post('/betting/category', 'Sitecp\Betting\CategoryController@createBetCategory');
    Route::put('/betting/category/{betCategoryId}', 'Sitecp\Betting\CategoryController@updateBetCategory');

    Route::get('/betting/bets/{page}', 'Sitecp\Betting\BetsController@getBets');
    Route::get('/betting/bet/{betId}', 'Sitecp\Betting\BetsController@getBet');
    Route::post('/betting/bet', 'Sitecp\Betting\BetsController@createBet');
    Route::put('/betting/bet/{betId}', 'Sitecp\Betting\BetsController@updateBet');
    Route::delete('/betting/bet/{betId}', 'Sitecp\Betting\BetsController@deleteBet');
    Route::put('/betting/bet/{betId}/result', 'Sitecp\Betting\BetsController@setResult');
    Route::put('/betting/bet/{betId}/suspend', 'Sitecp\Betting\BetsController@suspendBet');
    Route::put('/betting/bet/{betId}/unsuspend', 'Sitecp\Betting\BetsController@unsuspendBet');
});
