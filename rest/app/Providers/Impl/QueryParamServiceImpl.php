<?php

namespace App\Providers\Impl;

use App\Providers\Service\QueryParamService;

class QueryParamServiceImpl implements QueryParamService {

    public function getSortedBy($sortedBy) {
        switch ($sortedBy) {
            case 'THREAD_TITLE':
                return 'title';
            case 'THREAD_START_TIME':
                return 'createdAt';
            case 'NUMBER_OF_REPLIES':
                return 'posts';
            case 'LAST_POST_TIME':
            default:
                return 'lastPostId';
        }
    }

    public function getFromThe($fromThe) {
        $now = time();
        switch ($fromThe) {
            case 'LAST_DAY':
                return $now - 86400;
            case 'LAST_TWO_DAYS':
                return $now - 172800;
            case 'LAST_WEEK':
                return $now - 604800;
            case 'LAST_TEN_DAYS':
                return $now - 864000;
            case 'LAST_TWO_WEEKS':
                return $now - 1209600;
            case 'LAST_MONTH':
                return $now - 2592000;
            case 'LAST_FORTY_FIVE_DAYS':
                return $now - 3888000;
            case 'LAST_TWO_MONTHS':
                return $now - 5184000;
            case 'LAST_SEVENTY_FIVE_DAYS':
                return $now - 6480000;
            case 'LAST_HUNDRED_DAYS':
                return $now - 8640000;
            case 'LAST_YEAR':
                return $now - 31536000;
            case 'BEGINNING':
            default:
                return -1;
        }
    }
}
