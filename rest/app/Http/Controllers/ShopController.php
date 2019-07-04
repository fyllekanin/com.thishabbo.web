<?php

namespace App\Http\Controllers;

use App\Http\Impl\ShopControllerImpl;
use Illuminate\Http\Request;

class ShopController extends Controller {
    private $myImpl;

    public function __construct(ShopControllerImpl $impl) {
        parent::__construct();
        $this->myImpl = $impl;
    }

    public function getDashboard(Request $request) {
        $user = $request->get('auth');

        return response()->json([
            'lootBoxes' => $this->myImpl->getLootBoxes($user, 3, 0)->items,
            'subscriptions' => $this->myImpl->getSubscriptions($user, 3, 0)->items
        ]);
    }
}
