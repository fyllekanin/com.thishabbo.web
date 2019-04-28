<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $perPage = 10;
    public static $perPageStatic = 10;
    public $nowMinus15;

    /**
     * Controller constructor.
     * Setup commonly used instance variables used in majority of controllers
     * extending this one.
     */
    public function __construct() {
        $this->nowMinus15 = time() - 15;
    }

    /**
     * Get the offset for fetching items when using pagination
     *
     * @param $page
     *
     * @param int $perPage
     *
     * @return float|int
     */
    public function getOffset($page, $perPage = 0) {
        if ($perPage == 0) {
            $perPage = $this->perPage;
        }
        return $page >= 2 ? ($perPage * $page) - $perPage : 0;
    }
}
