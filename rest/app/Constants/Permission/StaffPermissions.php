<?php

namespace App\Constants\Permission;

class StaffPermissions {

    const CAN_RADIO = 1;
    const CAN_EVENT = 2;
    const CAN_BOOK_RADIO_FOR_OTHERS = 4;
    const CAN_BOOK_EVENT_FOR_OTHERS = 8;
    const CAN_MANAGE_EVENTS = 16;
    const CAN_SEE_IPS_AND_DELETE_REQUESTS = 32;
    const CAN_MANAGE_PERM_SHOWS = 64;
    const CAN_KICK_DJ_OFF_AIR = 128;
    const CAN_OVERRIDE_DJ_SAYS = 256;
    const CAN_SEE_BOOKING_LOGS = 512;
    const CAN_EDIT_RADIO_INFO = 1024;
    const CAN_SEE_DO_NOT_HIRE = 2048;
    const CAN_MANAGE_BAN_ON_SIGHT = 4096;
    const CAN_SEE_LISTENERS = 8192;
    const CAN_ALWAYS_SEE_CONNECTION_INFORMATION = 16384;
    const CAN_SEE_EVENT_STATS = 32768;
    const CAN_MANAGE_AUTO_DJ = 65536;

    public static function getAsOptions() {
        return [
            'canRadio' => self::CAN_RADIO,
            'canEvent' => self::CAN_EVENT,
            'canBookRadioForOthers' => self::CAN_BOOK_RADIO_FOR_OTHERS,
            'canBookEventForOthers' => self::CAN_BOOK_EVENT_FOR_OTHERS,
            'canManageEvents' => self::CAN_MANAGE_EVENTS,
            'canSeeIpsAndDeleteRequests' => self::CAN_SEE_IPS_AND_DELETE_REQUESTS,
            'canManagePermShows' => self::CAN_MANAGE_PERM_SHOWS,
            'canKickDjOffAir' => self::CAN_KICK_DJ_OFF_AIR,
            'canOverrideDjSays' => self::CAN_OVERRIDE_DJ_SAYS,
            'canSeeBookingLogs' => self::CAN_SEE_BOOKING_LOGS,
            'canEditRadioInfo' => self::CAN_EDIT_RADIO_INFO,
            'canSeeDoNotHire' => self::CAN_SEE_DO_NOT_HIRE,
            'canManageBanOnSight' => self::CAN_MANAGE_BAN_ON_SIGHT,
            'canSeeListeners' => self::CAN_SEE_LISTENERS,
            'canAlwaysSeeConnectionInformation' => self::CAN_ALWAYS_SEE_CONNECTION_INFORMATION,
            'canSeeEventStats' => self::CAN_SEE_EVENT_STATS,
            'canManageAutoDJ' => self::CAN_MANAGE_AUTO_DJ
        ];
    }
}
