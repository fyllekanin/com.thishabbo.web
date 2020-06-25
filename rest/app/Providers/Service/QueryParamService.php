<?php

namespace App\Providers\Service;

interface QueryParamService {


    /**
     * Gets the correct DB column for the sorted by query parameter
     *
     * @param $sortedBy
     *
     * @return string
     */
    public function getSortedBy($sortedBy);

    /**
     * Get the integer offset from the filtering query parameter
     *
     * @param $fromThe
     *
     * @return integer the timestamp equal to the offset
     */
    public function getFromThe($fromThe);
}
