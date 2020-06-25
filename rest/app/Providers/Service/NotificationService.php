<?php

namespace App\Providers\Service;

interface NotificationService {


    /**
     * Check if given content id and type for user is a valid notification
     *
     * @param  integer  $contentId
     * @param  integer  $type
     * @param $user
     *
     * @return mixed
     */
    public function isNotificationValid($contentId, $type, $user);
}
