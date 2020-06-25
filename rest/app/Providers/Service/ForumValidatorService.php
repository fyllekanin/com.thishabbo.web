<?php

namespace App\Providers\Service;

/**
 * Class ForumValidatorService
 *
 * Validate forum request data
 *
 * @package App\Providers\Service
 */
interface ForumValidatorService {


    /**
     * Validate create or update thread data
     *
     * @param $user
     * @param $threadSkeleton
     * @param $category
     * @param $request
     */
    public function validateCreateUpdateThread($user, $threadSkeleton, $category, $request);
}
