<?php

namespace App\Helpers;

use App\Http\Controllers\Controller;

class DataHelper {

    /**
     * @param $count
     * @param int $perPage
     *
     * @return float|int
     */
    public static function getPage($count, $perPage = 0) {
        if ($perPage == 0) {
            $perPage = Controller::$perPageStatic;
        }
        $page = ceil($count / $perPage);
        return $page > 0 ? $page : 1;
    }
}
