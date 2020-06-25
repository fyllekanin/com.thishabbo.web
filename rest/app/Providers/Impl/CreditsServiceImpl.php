<?php

namespace App\Providers\Impl;

use App\Helpers\UserHelper;
use App\Providers\Service\CreditsService;
use App\Utils\Condition;

class CreditsServiceImpl implements CreditsService {


    public function getUserCredits($userId) {
        return UserHelper::getUserDataOrCreate($userId)->credits;
    }

    public function haveEnoughCredits($userId, $credits) {
        Condition::precondition(
            !is_numeric($credits) || $credits < 0,
            400,
            'Credits need to be numeric and a positive number'
        );

        return $this->getUserCredits($userId) >= $credits;
    }

    public function takeCredits($userId, $credits) {
        Condition::precondition(
            !is_numeric($credits) || $credits < 0,
            400,
            'Credits need to be numeric and a positive number'
        );

        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->credits = $userData->credits - $credits;
        $userData->save();
    }

    public function giveCredits($userId, $credits) {
        Condition::precondition(
            !is_numeric($credits) || $credits < 0,
            400,
            'Credits need to be numeric and a positive number'
        );

        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->credits += $credits;
        $userData->save();
    }

    public function setCredits($userId, $credits) {
        Condition::precondition(
            !is_numeric($credits),
            400,
            'Credits need to be numeric and a positive number'
        );

        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->credits = $credits;
        $userData->save();
    }
}
