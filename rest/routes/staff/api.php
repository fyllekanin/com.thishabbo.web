<?php

use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use Illuminate\Support\Facades\Route;

$permissions = ConfigHelper::getStaffConfig();

Route::post('request-thc', 'Staff\StaffController@createRequestThc');
Route::get('dashboard/{start}', 'Staff\StaffController@getDashboardStats');

Route::get('/ping', 'PageController@getPing');

Route::prefix('radio')->group(function () use ($permissions) {
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canRadio)], function () {
        Route::post('/timetable', 'Staff\RadioController@createBooking');
        Route::delete('/timetable/{timetableId}', 'Staff\RadioController@deleteBooking');

        Route::get('/requests', 'Staff\RadioController@getRequests');
        Route::get('/connection', 'Staff\RadioController@getConnectionInformation');

        Route::get('/dj-says', 'Staff\RadioController@getDjSays');
        Route::put('/dj-says', 'Staff\RadioController@updateDjSays');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canSeeListeners)], function () {
        Route::get('/current-listeners', 'Staff\ManagementController@getCurrentListeners');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canKickDjOffAir)], function () {
        Route::post('kick/dj', 'Staff\RadioController@kickOffDj');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canEditRadioInfo)], function () {
        Route::get('/manage-connection', 'Staff\RadioController@getSitecpConnectionInformation');
        Route::put('/manage-connection', 'Staff\RadioController@updateConnectionInfo');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canSeeBookingLogs)], function () {
        Route::get('/booking/page/{page}', 'Staff\RadioController@getBookingLog');
    });
});

Route::prefix('events')->group(function () use ($permissions) {
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canEvent)], function () {
        Route::get('/timetable', 'Staff\EventsController@getTimetable');
        Route::post('/timetable', 'Staff\EventsController@createBooking');
        Route::delete('/timetable/{timetableId}', 'Staff\EventsController@deleteBooking');
        Route::get('/ban-on-sight', 'Staff\EventsController@getBanOnSightList');
    });
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canManageEvents)], function () {
        Route::get('/types/page/{page}', 'Staff\EventsController@getEventTypes');
        Route::post('/types', 'Staff\EventsController@createEventType');
        Route::put('/types/{eventId}', 'Staff\EventsController@updateEventType');
        Route::delete('/types/{eventId}', 'Staff\EventsController@deleteEventType');
    });
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canSeeBookingLogs)], function () {
        Route::get('/booking/page/{page}', 'Staff\EventsController@getBookingLog');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canManageBanOnSight)], function () {
        Route::get('/ban-on-sight/{entryId}', 'Staff\EventsController@getBanOnSight');
        Route::delete('/ban-on-sight/{entryid}', 'Staff\EventsController@deleteBanOnSight');
        Route::post('/ban-on-sight', 'Staff\EventsController@createBanOnSight');
        Route::put('/ban-on-sight/{entryid}', 'Staff\EventsController@updateBanOnSight');
    });
});

Route::prefix('management')->group(function () use ($permissions) {
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canSeeDoNotHire)], function () {
        Route::get('/do-not-hire', 'Staff\ManagementController@getDoNotHireList');
        Route::get('/do-not-hire/{nickname}', 'Staff\ManagementController@getDoNotHire');
        Route::delete('/do-not-hire/{nickname}', 'Staff\ManagementController@deleteDoNotHire');
        Route::post('/do-not-hire', 'Staff\ManagementController@createDoNotHire');
        Route::put('/do-not-hire/{nickname}', 'Staff\ManagementController@updateDoNotHire');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware($permissions->canManagePermShows)], function () {
        Route::get('/permanent-shows/{timetableId}', 'Staff\ManagementController@getPermShow');
        Route::get('/permanent-shows/page/{page}', 'Staff\ManagementController@getPermShows');
        Route::post('/permanent-shows', 'Staff\ManagementController@createPermShow');
        Route::put('/permanent-shows/{timetableId}', 'Staff\ManagementController@updatePermShow');
        Route::delete('/permanent-shows/{timetableId}', 'Staff\ManagementController@deletePermShow');
    });
});
