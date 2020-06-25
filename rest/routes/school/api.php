<?php

use Illuminate\Support\Facades\Route;

Route::prefix('demo')->group(function () {
    Route::get('/search-users', 'School\DemoController@searchUsers');
});

Route::prefix('joshua')->group(function () {
    Route::get('/search-users', 'School\JoshuaController@searchUsers');
});

Route::prefix('jxsh')->group(function () {

});

Route::prefix('reece')->group(function () {

});

Route::prefix('rora')->group(function () {
    Route::get('/search-users', 'School\RoraController@searchUsers');
});

Route::prefix('dez')->group(function () {

});
