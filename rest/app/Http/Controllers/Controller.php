<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {
    use DispatchesJobs;

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
}
