<?php

use Illuminate\Support\Facades\Route;

Route::get('groups', 'Usercp\GroupsController@getGroups');
Route::delete('groups/{groupId}', 'Usercp\GroupsController@leaveGroup');
Route::post('groups/apply', 'Usercp\GroupsController@applyForGroup');
Route::put('groups/displaygroup', 'Usercp\GroupsController@updateDisplayGroup');

Route::get('signature', 'Usercp\ProfileSettingsController@getSignature');
Route::put('signature', 'Usercp\ProfileSettingsController@updateSignature');

Route::get('name-settings', 'Usercp\ProfileSettingsController@getNameSettings');
Route::put('name-settings', 'Usercp\ProfileSettingsController@updateNameSettings');

Route::put('password', 'Usercp\AccountController@updatePassword');
Route::put('homepage', 'Usercp\AccountController@updateHomePage');

Route::post('cover', 'Usercp\ProfileSettingsController@updateCover');
Route::post('avatar', 'Usercp\ProfileSettingsController@updateAvatar');
Route::put('avatar/{avatarId}', 'Usercp\ProfileSettingsController@switchToAvatar');
Route::get('avatar', 'Usercp\ProfileSettingsController@getAvatarSize');

Route::get('post-bit', 'Usercp\AccountController@getPostBit');
Route::put('post-bit', 'Usercp\AccountController@updatePostBit');
Route::get('badges', 'Usercp\AccountController@getAvailableBadges');

Route::get('social-networks', 'Usercp\ProfileSettingsController@getSocialNetworks');
Route::put('social-networks', 'Usercp\ProfileSettingsController@updateSocialNetworks');

Route::get('notification-settings', 'Usercp\AccountController@getNotificationSettings');
Route::put('notification-settings', 'Usercp\AccountController@updateNotificationSettings');

Route::get('thread-subscriptions', 'Usercp\AccountController@getThreadSubscriptions');
Route::get('category-subscriptions', 'Usercp\AccountController@getCategorySubscriptions');

Route::get('ignored-threads', 'Usercp\AccountController@getIgnoredThreads');
Route::get('ignored-categories', 'Usercp\AccountController@getIgnoredCategories');

Route::get('habbo', 'Usercp\AccountController@getHabbo');
Route::put('habbo', 'Usercp\AccountController@updateHabbo');

Route::put('nickname', 'Usercp\AccountController@updateNickname');

Route::get('themes', 'Usercp\AccountController@getThemes');
Route::put('themes', 'Usercp\AccountController@updateTheme');

Route::post('voucher-code', 'Usercp\AccountController@claimVoucherCode');

Route::post('profile/follow', 'ProfileController@createFollow');
Route::delete('profile/unfollow/{userId}', 'ProfileController@deleteFollow');

Route::get('profile', 'Usercp\ProfileSettingsController@getProfile');
Route::put('profile', 'Usercp\ProfileSettingsController@updateProfile');

Route::get('followers/page/{page}', 'Usercp\FollowersController@getFollowers');
Route::put('followers/approve/{followerId}', 'Usercp\FollowersController@approveFollower');
Route::delete('followers/deny/{followerId}', 'Usercp\FollowersController@denyFollower');
Route::delete('followers/remove/{followerId}', 'Usercp\FollowersController@removeFollower');

Route::get('notifications/page/{page}', 'Usercp\AccountController@getNotifications');