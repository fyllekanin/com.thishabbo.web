<?php

namespace App\Helpers;

use App\Http\Controllers\Controller;

class DataHelper {

    public static function getPage($count) {
        $page = ceil($count / Controller::$perPageStatic);
        return $page > 0 ? $page : 1;
    }
}
