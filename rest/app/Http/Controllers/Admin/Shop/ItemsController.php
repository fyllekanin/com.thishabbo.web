<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ItemsController extends Controller {

    public function getItems() {
        return response()->json([
            'total' => 1,
            'page' => 1,
            'items' => []
        ]);
    }
}
