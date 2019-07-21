<?php

use Illuminate\Support\Facades\Route;

Route::get('/dashboard', 'ShopController@getDashboard');
Route::get('/loot-boxes/page/{page}', 'ShopController@getLootBoxes');
Route::get('/subscriptions/page/{page}', 'ShopController@getSubscriptions');

Route::post('/loot-boxes/open/{lootBoxId}', 'ShopController@openLootBox');
Route::post('/subscriptions/buy/{subscriptionId}', 'ShopController@buySubscription');

Route::post('/send-thc', 'ShopController@sendThc');

Route::get('/payment-verification/{paymentId}/{payerId}', 'ShopController@getPaymentVerification');