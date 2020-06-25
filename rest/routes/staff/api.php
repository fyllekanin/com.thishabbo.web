<?php

use App\Constants\Permission\StaffPermissions;
use App\Helpers\PermissionHelper;
use Illuminate\Support\Facades\Route;

Route::post('request-thc', 'Staff\StaffController@createRequestThc');
Route::get('thc-requests-log/page/{page}', 'Staff\StaffController@getThcRequestsLog');

Route::get('/ping', 'PageController@getPing');

Route::prefix('radio')->group(function () {
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_RADIO)], function () {
        Route::post('/timetable', 'Staff\RadioController@createBooking');
        Route::delete('/timetable/{timetableId}', 'Staff\RadioController@deleteBooking');

        Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_BOOK_RADIO_FOR_OTHERS)], function () {
            Route::put('/timetable/{timetableId}', 'Staff\RadioController@updateBooking');
        });

        Route::get('/requests', 'Staff\RadioController@getRequests');
        Route::delete('/requests/{requestId}', 'Staff\RadioController@deleteRequest');
        Route::delete('/requests', 'Staff\RadioController@deleteAllRequests');

        Route::get('/connection', 'Staff\RadioController@getConnectionInformation');

        Route::get('/dj-says', 'Staff\RadioController@getDjSays');
        Route::put('/dj-says', 'Staff\RadioController@updateDjSays');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_SEE_LISTENERS)], function () {
        Route::get('/current-listeners', 'Staff\ManagementController@getCurrentListeners');
        Route::get('/listener-statistics/{year}/{week}', 'Staff\ManagementController@getListenersForWeek');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_KICK_DJ_OFF_AIR)], function () {
        Route::post('kick/dj', 'Staff\RadioController@kickOffDj');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_MANAGE_AUTO_DJ)], function () {
        Route::post('auto-dj/start', 'Staff\RadioController@startAutoDj');
        Route::post('auto-dj/stop', 'Staff\RadioController@stopAutoDj');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_EDIT_RADIO_INFO)], function () {
        Route::get('/manage-connection', 'Staff\RadioController@getSitecpConnectionInformation');
        Route::put('/manage-connection', 'Staff\RadioController@updateConnectionInfo');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_SEE_BOOKING_LOGS)], function () {
        Route::get('/booking/page/{page}', 'Staff\RadioController@getBookingLog');
    });
});

Route::prefix('events')->group(function () {
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_EVENT)], function () {
        Route::post('/timetable', 'Staff\EventsController@createBooking');

        Route::delete('/timetable/{timetableId}', 'Staff\EventsController@deleteBooking');

        Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_BOOK_EVENT_FOR_OTHERS)], function () {
            Route::put('/timetable/{timetableId}', 'Staff\EventsController@updateBooking');
        });

        Route::get('/ban-on-sight', 'Staff\EventsController@getBanOnSightList');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_MANAGE_EVENTS)], function () {
        Route::get('/types/page/{page}', 'Staff\EventsController@getEventTypes');
        Route::post('/types', 'Staff\EventsController@createEventType');
        Route::put('/types/{eventId}', 'Staff\EventsController@updateEventType');
        Route::delete('/types/{eventId}', 'Staff\EventsController@deleteEventType');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_SEE_BOOKING_LOGS)], function () {
        Route::get('/booking/page/{page}', 'Staff\EventsController@getBookingLog');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_SEE_EVENT_STATS)], function () {
        Route::get('/stats', 'Staff\ManagementController@getEventStats');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_MANAGE_BAN_ON_SIGHT)], function () {
        Route::get('/ban-on-sight/{entryId}', 'Staff\EventsController@getBanOnSight');
        Route::delete('/ban-on-sight/{entryId}', 'Staff\EventsController@deleteBanOnSight');
        Route::post('/ban-on-sight', 'Staff\EventsController@createBanOnSight');
        Route::put('/ban-on-sight/{entryId}', 'Staff\EventsController@updateBanOnSight');
    });
});

Route::prefix('management')->group(function () {
    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_SEE_DO_NOT_HIRE)], function () {
        Route::get('/do-not-hire', 'Staff\ManagementController@getDoNotHireList');
        Route::get('/do-not-hire/{nickname}', 'Staff\ManagementController@getDoNotHire');
        Route::delete('/do-not-hire/{nickname}', 'Staff\ManagementController@deleteDoNotHire');
        Route::post('/do-not-hire', 'Staff\ManagementController@createDoNotHire');
        Route::put('/do-not-hire/{nickname}', 'Staff\ManagementController@updateDoNotHire');
    });

    Route::group(['middleware' => PermissionHelper::getStaffMiddleware(StaffPermissions::CAN_MANAGE_PERM_SHOWS)], function () {
        Route::get('/permanent-shows/{timetableId}', 'Staff\ManagementController@getPermShow');
        Route::get('/permanent-shows/page/{page}', 'Staff\ManagementController@getPermShows');
        Route::post('/permanent-shows', 'Staff\ManagementController@createPermShow');
        Route::put('/permanent-shows/{timetableId}', 'Staff\ManagementController@updatePermShow');
        Route::delete('/permanent-shows/{timetableId}', 'Staff\ManagementController@deletePermShow');
    });
});

Route::get('dashboard/{start}/{year}/{month}/points', 'Staff\StaffController@getDashboardStats');
