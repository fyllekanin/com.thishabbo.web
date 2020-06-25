<?php

namespace App\Providers\Service;

interface CreditsService {


    /**
     * Get the amount of credits a given user have
     *
     * @param  integer  $userId
     *
     * @return mixed
     */
    public function getUserCredits($userId);

    /**
     * Check if the given user have the credit amount given
     *
     * @param  integer  $userId
     * @param  integer  $credits
     *
     * @return bool
     */
    public function haveEnoughCredits($userId, $credits);

    /**
     * Take away given credits from given user
     *
     * @param  integer  $userId
     * @param  integer  $credits
     */
    public function takeCredits($userId, $credits);

    /**
     * Give the given user credits
     *
     * @param  integer  $userId
     * @param  integer  $credits
     */
    public function giveCredits($userId, $credits);

    /**
     * Set a fixed amount of credits to a user
     *
     * @param $userId
     * @param $credits
     */
    public function setCredits($userId, $credits);
}
