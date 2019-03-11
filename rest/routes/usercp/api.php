<?php

use Illuminate\Support\Facades\Route;

Route::get('groups', 'Usercp\GroupsController@getGroups');
Route::delete('groups/{groupId}', 'Usercp\GroupsController@leaveGroup');
Route::post('groups/apply', 'Usercp\GroupsController@applyForGroup');
Route::put('groups/displaygroup', 'Usercp\GroupsController@updateDisplayGroup');

Route::get('signature', 'Usercp\ProfileController@getSignature');
Route::put('signature', 'Usercp\ProfileController@updateSignature');

Route::put('password', 'Usercp\AccountController@updatePassword');
Route::put('homepage', 'Usercp\AccountController@updateHomePage');

Route::post('cover', 'Usercp\ProfileController@updateCover');
Route::post('avatar', 'Usercp\ProfileController@updateAvatar');
Route::get('avatar', 'Usercp\ProfileController@getAvatarSize');

Route::get('post-bit', 'Usercp\AccountController@getPostBit');
Route::put('post-bit', 'Usercp\AccountController@updatePostBit');

Route::get('social-networks', 'Usercp\ProfileController@getSocialNetworks');
Route::put('social-networks', 'Usercp\ProfileController@updateSocialNetworks');

Route::get('notification-settings', 'Usercp\AccountController@getNotificationSettings');
Route::put('notification-settings', 'Usercp\AccountController@updateNotificationSettings');

Route::get('thread-subscriptions', 'Usercp\AccountController@getThreadSubscriptions');
Route::get('category-subscriptions', 'Usercp\AccountController@getCategorySubscriptions');

Route::get('ignored-threads', 'Usercp\AccountController@getIgnoredThreads');
Route::get('ignored-categories', 'Usercp\AccountController@getIgnoredCategories');

Route::put('nickname', 'Usercp\AccountController@updateNickname');
