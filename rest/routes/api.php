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
Route::get('/settings/navigation', 'Admin\Settings\PageSettingsController@getNavigation');

Route::get('/puller/stream', 'Puller\StreamController@getStream');
Route::post('/radio/request', 'Staff\RadioController@createRequest');
Route::post('/auth/login', 'AuthController@login');
Route::post('/auth/logout', 'AuthController@logout');
Route::get('/auth/refresh', 'AuthController@refresh');
Route::put('/auth/accept/gdpr', 'AuthController@acceptGdpr');

Route::get('/maintenance/content', 'PageController@getMaintenanceMessage');

Route::group(['middleware' => ['maintenance']], function () {

    Route::post('/auth/register', 'AuthController@register');
    Route::get('/auth/register', 'AuthController@getRegisterPage');

    Route::get('/page/profile/{nickname}', 'PageController@getProfile');
    Route::get('/page/custom/{page}', 'PageController@getCustomPage');
    Route::get('/page/home', 'PageController@getHomePage');
    Route::get('/page/register', 'PageController@getRegisterPage');
    Route::get('/page/forum/categories', 'Forum\Category\CategoryCrudController@getForumCategories');
    Route::get('/page/forum/stats/{clientTodayMidnight}', 'Forum\Category\CategoryCrudController@getForumStats');
    Route::get('/page/category/{categoryId}/page/{page}', 'Forum\Category\CategoryCrudController@getCategoryPage');
    Route::get('/page/thread/{threadId}/page/{page}', 'Forum\Thread\ThreadCrudController@getThreadPage');
    Route::get('/page/forum/latest-posts/page/{page}', 'Forum\Post\PostCrudController@getLatestPosts');
    Route::get('/page/forum/latest-threads/page/{page}', 'Forum\Thread\ThreadCrudController@getLatestThreads');

    Route::get('puller/notifications/unread/{createdAfter}', 'Puller\NotificationController@getUnreadNotifications');

    Route::group(['middleware' => ['token.check']], function () {
        Route::get('/auth/user', 'AuthController@getUser');
        Route::get('/bbcode/emojis', 'PageController@getEmojis');
        Route::post('/radio/like', 'Staff\RadioController@createDjLike');

        Route::put('puller/notifications/read/all', 'Puller\NotificationController@readAllNotifications');
        Route::put('puller/notifications/read/{notificationId}', 'Puller\NotificationController@readNotification');

        Route::prefix('betting')->group(function () {
            Route::get('dashboard', 'BettingController@getDashboardPage');
            Route::get('stats', 'BettingController@getBettingStats');
            Route::post('bet/{betId}', 'BettingController@createPlaceBet');
            Route::post('roulette', 'BettingController@createRoulette');
            Route::get('roulette', 'BettingController@getRoulette');

            Route::prefix('bets')->group(function () {
                Route::get('active', 'BettingController@getMyActiveBets');
                Route::get('history/page/{page}', 'BettingController@getHistoryPage');
            });
        });
    });
});
