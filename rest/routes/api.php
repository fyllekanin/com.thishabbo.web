<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use Illuminate\Support\Facades\Route;

Route::get('/ping', 'PageController@getPing');
Route::get('/load/initial', 'Auth\AuthController@getInitialLoad');

Route::get('/puller/pull', 'Puller\StreamController@getPull');
Route::post('/radio/request', 'Staff\RadioController@createRequest');
Route::post('/auth/login', 'Auth\AuthController@login');
Route::post('/auth/logout', 'Auth\AuthController@logout');
Route::get('/auth/refresh', 'Auth\AuthController@refresh');
Route::put('/auth/accept/gdpr', 'Auth\AuthController@acceptGdpr');

Route::get('/maintenance/content', 'PageController@getMaintenanceMessage');

Route::group(['middleware' => ['maintenance']], function () {

    Route::post('/bbcode/parse', 'PageController@parseContent');
    Route::get('/bbcode/emojis', 'PageController@getEmojis');
    Route::get('/search/type/{type}/page/{page}', 'SearchController@getSearch');
    Route::get('/group-list', 'PageController@getGroupList');

    Route::post('/auth/register', 'Auth\AuthController@register');
    Route::get('/auth/register', 'Auth\AuthController@getRegisterPage');

    Route::get('/auth/forgot-password/code/{habbo}', 'Auth\ForgotPasswordController@getCodeForHabbo');
    Route::put('/auth/forgot-password', 'Auth\ForgotPasswordController@changePassword');

    Route::get('/page/versions/page/{page}', 'PageController@getVersions');
    Route::get('/page/profile/{nickname}/page/{page}', 'ProfileController@getProfile');
    Route::get('/page/custom/{page}', 'PageController@getCustomPage');
    Route::get('/page/badge-guides/page/{page}', 'PageController@getBadgeGuides');
    Route::get('/page/home', 'PageController@getHomePage');
    Route::get('/page/register', 'PageController@getRegisterPage');
    Route::get('/page/forum/categories', 'Forum\Category\CategoryCrudController@getForumCategories');
    Route::get('/page/forum/stats/{clientTodayMidnight}', 'Forum\Category\CategoryCrudController@getForumStats');
    Route::get('/page/category/{categoryId}/page/{page}', 'Forum\Category\CategoryCrudController@getCategoryPage');
    Route::get('/page/thread/{threadId}/page/{page}', 'Forum\Thread\ThreadCrudController@getThreadPage');
    Route::get('/page/thread/{threadId}/page/{page}/{postedByUser}', 'Forum\Thread\ThreadCrudController@getThreadPage');
    Route::get('/page/forum/latest-posts/page/{page}', 'Forum\Post\PostCrudController@getLatestPosts');
    Route::get('/page/forum/latest-threads/page/{page}', 'Forum\Thread\ThreadCrudController@getLatestThreads');

    Route::get('puller/notifications/unread', 'Puller\NotificationController@getUnreadNotifications');

    Route::get('radio/timetable', 'Staff\RadioController@getTimetable');
    Route::get('events/timetable', 'Staff\EventsController@getTimetable');

    Route::group(['middleware' => ['auth.check']], function () {
        Route::get('/auth/user', 'Auth\AuthController@getUser');
        Route::post('/radio/like', 'Staff\RadioController@createDjLike');
        Route::post('/event/like', 'Staff\EventsController@createHostLike');


        Route::post('/profile/visitor-message', 'ProfileController@createVisitorMessage');
        Route::post('/profile/visitor-message/{visitorMessageId}/like', 'ProfileController@createVisitorMessageLike');
        Route::delete('/profile/visitor-message/{visitorMessageId}/like', 'ProfileController@deleteVisitorMessageLike');
        Route::post('/profile/visitor-message/{visitorMessageId}/report', 'ProfileController@createReportVisitorMessage');

        Route::put('/puller/notifications/read/all/notifications', 'Puller\NotificationController@readAllNotifications');
        Route::put('/puller/notifications/read/all/messages', 'Puller\NotificationController@readAllMessages');
        Route::put('/puller/notifications/read/{notificationId}', 'Puller\NotificationController@readNotification');

        Route::post('form/job', 'FormController@createApplication');
        Route::post('form/contact', 'FormController@createContact');
        Route::post('form/bug', 'FormController@createBugReport');

        Route::prefix('betting')->group(function () {
            Route::get('/dashboard', 'BettingController@getDashboardPage');
            Route::get('/stats', 'BettingController@getBettingStats');
            Route::post('/bet/{betId}', 'BettingController@createPlaceBet');
            Route::post('/roulette', 'BettingController@createRoulette');
            Route::get('/roulette', 'BettingController@getRoulette');

            Route::prefix('bets')->group(function () {
                Route::get('active', 'BettingController@getMyActiveBets');
                Route::get('history/page/{page}', 'BettingController@getHistoryPage');
            });
        });
    });
});
