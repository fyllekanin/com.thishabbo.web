<?php

namespace App\Utils;

use App\Http\Controllers\Controller;

class PaginationUtil {


    /**
     * Get total amount of pages based on count and how many
     * items per page.
     *
     * @param  int  $count
     * @param  int  $perPage
     *
     * @return float|int
     */
    public static function getTotalPages(int $count, int $perPage = 0) {
        if ($perPage == 0) {
            $perPage = Controller::$perPageStatic;
        }
        $page = ceil($count / $perPage);
        return $page > 0 ? $page : 1;
    }

    /**
     * Get offset where to start to fetch data based on which page
     * to grab.
     *
     * @param  int  $page
     * @param  int  $perPage
     *
     * @return int
     */
    public static function getOffset($page, $perPage = 0) {
        if ($perPage == 0) {
            $perPage = Controller::$perPageStatic;
        }
        return $page >= 2 ? ($perPage * $page) - $perPage : 0;
    }
}
