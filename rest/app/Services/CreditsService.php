<?php

namespace App\Services;

use App\Helpers\UserHelper;
use App\Utils\Condition;

class CreditsService {

    /**
     * @param $userId
     *
     * @return mixed
     */
    public function getUserCredits($userId) {
        return UserHelper::getUserDataOrCreate($userId)->credits;
    }

    /**
     * @param $userId
     * @param $credits
     */
    public function setUserCredits($userId, $credits) {
        Condition::precondition(!is_numeric($credits) || $credits < 0, 400,
            'Credits need to be numeric and a positive number');

        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->credits = $credits;
        $userData->save();
    }

    /**
     * @param $userId
     * @param $credits
     *
     * @return bool
     */
    public function haveEnoughCredits($userId, $credits) {
        Condition::precondition(!is_numeric($credits) || $credits < 0, 400,
            'Credits need to be numeric and a positive number');

        return $this->getUserCredits($userId) >= $credits;
    }

    /**
     * @param $userId
     * @param $credits
     */
    public function takeCredits($userId, $credits) {
        Condition::precondition(!is_numeric($credits) || $credits < 0, 400,
            'Credits need to be numeric and a positive number');

        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->credits = ($userData->credits - $credits) < 0 ? 0 : $userData->credits - $credits;
        $userData->save();
    }

    /**
     * @param $userId
     * @param $credits
     */
    public function giveCredits($userId, $credits) {
        Condition::precondition(!is_numeric($credits) || $credits < 0, 400,
            'Credits need to be numeric and a positive number');

        $userData = UserHelper::getUserDataOrCreate($userId);
        $userData->credits += $credits;
        $userData->save();
    }
}
