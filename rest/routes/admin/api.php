<?php

use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use Illuminate\Support\Facades\Route;

$permissions = ConfigHelper::getAdminConfig();

Route::prefix('statistics')->group(function () {
    Route::get('/users/{year}/{month}', 'Admin\Statistics\UserStatisticsController@getUsersLoggedIn');
    Route::get('/posts/{year}/{month}', 'Admin\Statistics\ForumStatisticsController@getPosts');
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canSeeLogs)], function () {
    Route::get('/logs/{type}/page/{page}', 'Admin\LogsController@getLogs');
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageTHC)], function () {
    Route::get('/thc/requests', 'Admin\User\UserThcController@getThcRequests');
    Route::put('/thc/requests', 'Admin\User\UserThcController@updateThcRequests');
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageForum)], function () use ($permissions) {
    Route::post('/categories', 'Admin\Forum\CategoriesController@createCategory');
    Route::put('/categories/{categoryId}', 'Admin\Forum\CategoriesController@updateCategory');
    Route::put('/categories/orders/update', 'Admin\Forum\CategoriesController@updateCategoryOrders');
    Route::get('/categories', 'Admin\Forum\CategoriesController@getCategories');
    Route::get('/categories/{categoryId}', 'Admin\Forum\CategoriesController@getCategory');
    Route::delete('/categories/{categoryId}', 'Admin\Forum\CategoriesController@deleteCategory');

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageForumPermissions)], function () {
        Route::get('/categories/permissions/{categoryId}/group/{groupId}', 'Admin\Forum\PermissionController@getGroupForumPermissions');
        Route::put('/categories/permissions/{categoryId}', 'Admin\Forum\PermissionController@updateGroupForumPermissions');
    });
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageShop)], function () {

    Route::get('/shop/categories/page/{page}', 'Admin\Shop\CategoryCrudController@getCategories');
    Route::get('/shop/categories/{shopCategoryId}', 'Admin\Shop\CategoryCrudController@getCategory');
    Route::post('/shop/categories', 'Admin\Shop\CategoryCrudController@createCategory');
    Route::put('/shop/categories/{shopCategoryId}', 'Admin\Shop\CategoryCrudController@updateCategory');
    Route::delete('/shop/categories/{shopCategoryId}', 'Admin\Shop\CategoryCrudController@deleteCategory');
});

Route::prefix('moderation')->group(function () use ($permissions) {
    Route::get('threads', 'Admin\Moderation\ForumController@getModerateThreads');
    Route::get('posts', 'Admin\Moderation\ForumController@getModeratePosts');
    Route::get('polls/page/{page}', 'Moderation\ThreadPollController@getPolls');
    Route::get('polls/{threadId}', 'Moderation\ThreadPollController@getPoll');

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canApprovePublicGroups)], function () {
        Route::get('groups', 'Admin\Group\GroupsController@getGroupApplications');
        Route::post('groups/approve', 'Admin\Group\GroupsController@approveGroupApplication');
        Route::delete('groups/deny/{groupRequestId}', 'Admin\Group\GroupsController@denyGroupApplication');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canDoInfractions)], function () {
        Route::get('infract/{userId}', 'Admin\Moderation\InfractionController@getInfractContext');
        Route::post('infract', 'Admin\Moderation\InfractionController@createInfraction');

        Route::get('infractions/page/{page}', 'Admin\Moderation\InfractionController@getInfractions');
        Route::delete('infraction/{infractionId}', 'Admin\Moderation\InfractionController@deleteInfraction');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageInfractions)], function () {
        Route::get('auto-bans/page/{page}', 'Admin\Moderation\AutoBanController@getAutoBans');
        Route::get('auto-bans/{autoBanId}', 'Admin\Moderation\AutoBanController@getAutoBan');
        Route::post('auto-bans', 'Admin\Moderation\AutoBanController@createAutoBan');
        Route::put('auto-bans/{autoBanId}', 'Admin\Moderation\AutoBanController@updateAutoBan');
        Route::delete('auto-bans/{autoBanId}', 'Admin\Moderation\AutoBanController@deleteAutoBan');

        Route::get('infraction-levels/page/{page}', 'Admin\Moderation\InfractionLevelsController@getInfractionLevels');
        Route::get('infraction-levels/{infractionLevelId}', 'Admin\Moderation\InfractionLevelsController@getInfractionLevel');
        Route::put('infraction-levels/{infractionLevelId}', 'Admin\Moderation\InfractionLevelsController@updateInfractionLevel');
        Route::delete('infraction-levels/{infractionLevelId}', 'Admin\Moderation\InfractionLevelsController@deleteInfractionLevel');
        Route::post('infraction-levels', 'Admin\Moderation\InfractionLevelsController@createInfractionLevel');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canBanUser)], function () {
        Route::get('/bans/page/{page}', 'Admin\User\BansController@getBannedUsers');
    });
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageGroups)], function () {
    Route::post('/groups', 'Admin\Group\GroupsController@createGroup');
    Route::put('/groups/{groupId}', 'Admin\Group\GroupsController@updateGroup');
    Route::get('/groups/list/page/{page}', 'Admin\Group\GroupsController@getGroups');
    Route::get('/groups/{groupId}', 'Admin\Group\GroupsController@getGroup');
    Route::delete('/groups/{groupId}', 'Admin\Group\GroupsController@deleteGroup');
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canSeeIps)], function () {
    Route::get('/users/ip-search', 'IpSearchController@getIpSearch');
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware([$permissions->canEditUserBasic, $permissions->canEditUserAdvanced, $permissions->canEditUserProfile,
    $permissions->canBanUser || $permissions->canManageTHC])], function () use ($permissions) {

    Route::get('/users/list/page/{page}', 'Admin\User\UserController@getUsers');

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageTHC)], function () {
        Route::put('/users/{userId}/thc', 'Admin\User\UserThcController@updateThc');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canMergeUsers)], function () {
        Route::post('/users/merge/source/{srcUserId}/destination/{destUserId}', 'Admin\User\UserController@mergeUsers');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware([$permissions->canEditUserBasic, $permissions->canEditUserAdvanced])], function () {
        Route::get('/users/{userId}/basic', 'Admin\User\UserController@getUserBasic');
        Route::put('/users/{userId}/basic', 'Admin\User\UserController@updateUserBasic');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canEditUserAdvanced)], function () {
        Route::get('/users/{userId}/groups', 'Admin\User\UserGroupsController@getUserGroups');
        Route::put('/users/{userId}/groups', 'Admin\User\UserGroupsController@updateUserGroups');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canBanUser)], function () {
        Route::get('/users/{userId}/bans', 'Admin\User\BansController@getUserBans');
        Route::post('/users/{userId}/ban', 'Admin\User\BansController@createUserBan');
        Route::put('/users/{userId}/lift/{banId}', 'Admin\User\BansController@liftUserBan');
    });
});

Route::prefix('content')->group(function () use ($permissions) {

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canEditWebsiteSettings)], function () {
        Route::get('/staff-of-the-week', 'Admin\Settings\StaffSpotlightController@getStaffOfTheWeek');
        Route::put('/staff-of-the-week', 'Admin\Settings\StaffSpotlightController@updateStaffOfTheWeek');

        Route::get('/member-of-the-month', 'Admin\Settings\StaffSpotlightController@getMemberOfTheMonth');
        Route::put('/member-of-the-month', 'Admin\Settings\StaffSpotlightController@updateMemberOfTheMonth');

        Route::get('/notices', 'Admin\Settings\NoticeController@getNotices');
        Route::delete('/notices/{noticeId}', 'Admin\Settings\NoticeController@deleteNotice');
        Route::post('/notices', 'Admin\Settings\NoticeController@createNotice');
        Route::put('/notices', 'Admin\Settings\NoticeController@updateNoticeOrder');

        Route::get('/welcome-bot', 'Admin\Settings\WelcomeBotController@getWelcomeBotSettings');
        Route::put('/welcome-bot', 'Admin\Settings\WelcomeBotController@updateWelcomeBotSettings');

        Route::get('/maintenance', 'Admin\Settings\GeneralSettingsController@getMaintenance');
        Route::put('/maintenance', 'Admin\Settings\GeneralSettingsController@updateMaintenance');

        Route::get('/navigation', 'Admin\Settings\PageSettingsController@getNavigation');
        Route::put('/navigation', 'Admin\Settings\PageSettingsController@updateNavigation');

        Route::get('/pages', 'Admin\Settings\PageSettingsController@getPages');
        Route::post('/pages', 'Admin\Settings\PageSettingsController@createPage');
        Route::get('/pages/{pageId}', 'Admin\Settings\PageSettingsController@getPage');
        Route::put('/pages/{pageId}', 'Admin\Settings\PageSettingsController@updatePage');
        Route::delete('/pages/{pageId}', 'Admin\Settings\PageSettingsController@deletePage');

        Route::get('/site-messages', 'Admin\Settings\GeneralSettingsController@getSiteMessageS');
        Route::get('/site-messages/{siteMessageId}', 'Admin\Settings\GeneralSettingsController@getSiteMessage');
        Route::post('/site-messages', 'Admin\Settings\GeneralSettingsController@createSiteMessage');
        Route::put('/site-messages/{siteMessageId}', 'Admin\Settings\GeneralSettingsController@updateSiteMessage');
        Route::delete('/site-messages/{siteMessageId}', 'Admin\Settings\GeneralSettingsController@deleteSiteMessage');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageBBcodes)], function () {
        Route::get('/bbcodes', 'Admin\Content\BBcodeController@getBBcodes');
        Route::get('/bbcodes/{bbcodeId}', 'Admin\Content\BBcodeController@getBBcode');
        Route::delete('/bbcodes/{bbcodeId}', 'Admin\Content\BBcodeController@deleteBBcode');
        Route::post('/bbcodes/{bbcodeId}', 'Admin\Content\BBcodeController@updateBBcode');
        Route::post('/bbcodes', 'Admin\Content\BBcodeController@createBBcode');
    });

    Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageGroupsList)], function () {
        Route::get('/groupslist', 'Admin\Group\GroupsListController@getGroupsList');
        Route::put('/groupslist', 'Admin\Group\GroupsListController@updateGroupsList');
    });
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManagePrefixes)], function () {
    Route::get('/prefixes', 'Admin\Forum\PrefixController@getPrefixes');
    Route::post('/prefixes', 'Admin\Forum\PrefixController@createPrefix');
    Route::get('/prefixes/{prefixId}', 'Admin\Forum\PrefixController@getPrefix');
    Route::delete('/prefixes/{prefixId}', 'Admin\Forum\PrefixController@deletePrefix');
    Route::put('/prefixes/{prefixId}', 'Admin\Forum\PrefixController@updatePrefix');
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageBadges)], function () {
    Route::post('/badges', 'Admin\AdminBadgesController@createBadge');
    Route::post('/badges/{badgeId}', 'Admin\AdminBadgesController@updateBadge');
    Route::get('/badges/list/page/{page}', 'Admin\AdminBadgesController@getBadges');
    Route::get('/badges/{badgeId}', 'Admin\AdminBadgesController@getBadge');
    Route::delete('/badges/{badgeId}', 'Admin\AdminBadgesController@deleteBadge');

    Route::get('/badges/{badgeId}/users', 'Admin\AdminBadgesController@getUsersWithBadge');
    Route::put('/badges/{badgeId}/users', 'Admin\AdminBadgesController@updateUsersWithBadge');
});

Route::group(['middleware' => PermissionHelper::getAdminMiddleware($permissions->canManageBetting)], function () {

    Route::get('/betting/categories/{page}', 'Admin\Betting\CategoryController@getBetCategories');
    Route::get('/betting/category/{betCategoryId}', 'Admin\Betting\CategoryController@getBetCategory');
    Route::delete('/betting/category/{betCategoryId}', 'Admin\Betting\CategoryController@deleteBetCategory');
    Route::post('/betting/category', 'Admin\Betting\CategoryController@createBetCategory');
    Route::put('/betting/category/{betCategoryId}', 'Admin\Betting\CategoryController@updateBetCategory');

    Route::get('/betting/bets/{page}', 'Admin\Betting\BetsController@getBets');
    Route::get('/betting/bet/{betId}', 'Admin\Betting\BetsController@getBet');
    Route::post('/betting/bet', 'Admin\Betting\BetsController@createBet');
    Route::put('/betting/bet/{betId}', 'Admin\Betting\BetsController@updateBet');
    Route::delete('/betting/bet/{betId}', 'Admin\Betting\BetsController@deleteBet');
    Route::put('/betting/bet/{betId}/result', 'Admin\Betting\BetsController@setResult');
    Route::put('/betting/bet/{betId}/suspend', 'Admin\Betting\BetsController@suspendBet');
    Route::put('/betting/bet/{betId}/unsuspend', 'Admin\Betting\BetsController@unsuspendBet');
});
