<?php


namespace App\Constants;

class GroupOptions {
    const CONTENT_NEED_APPROVAL = 1;
    /** @deprecated */
    const CAN_BE_TAGGED = 2;

    public static function getAsOptions() {
        return [
            'contentNeedApproval' => self::CONTENT_NEED_APPROVAL
        ];
    }
}
