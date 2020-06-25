<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {

    use DispatchesJobs;

    public $perPage = 10;
    public $bigPerPage = 15;
    public static $perPageStatic = 10;
    public $nowMinus15;

    public function __construct() {
        $this->nowMinus15 = time() - 15;
    }
}
