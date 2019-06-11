<?php

namespace App\Http\Controllers\Sitecp\Shop;

use App\Http\Controllers\Controller;

class ItemsController extends Controller {

    public function getItems() {
        return response()->json([
            'total' => 1,
            'page' => 1,
            'items' => []
        ]);
    }
}
