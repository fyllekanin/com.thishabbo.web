<?php

namespace App\Constants\User;

class PostBit {

    const HIDE_JOIN_DATE = 1;
    const HIDE_POST_COUNT = 2;
    const HIDE_LIKES_COUNT = 4;
    const HIDE_SOCIALS = 8;
    const HIDE_HABBO = 16;

    public static function getAsOptions() {
        return [
            'hideJoinDate' => self::HIDE_JOIN_DATE,
            'hidePostCount' => self::HIDE_POST_COUNT,
            'hideLikesCount' => self::HIDE_LIKES_COUNT,
            'hideSocials' => self::HIDE_SOCIALS,
            'hideHabbo' => self::HIDE_HABBO
        ];
    }
}
