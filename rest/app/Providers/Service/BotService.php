<?php

namespace App\Providers\Service;

use Illuminate\Validation\ValidationException;

interface BotService {


    /**
     * Create multiple accounts detection thread if settings are set
     *
     * @param $user
     * @param $ip
     * @param $userIds
     *
     * @return mixed
     */
    public function triggerMultipleAccounts($user, $ip, $userIds);

    /**
     * Posts the welcome thread for the provided user if settings are set
     *
     * @param $user
     *
     * @throws ValidationException
     */
    public function triggerWelcomeBot($user);
}
