<?php

namespace App\Http\Controllers;

use App\Helpers\DataHelper;
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

    public function getLootBoxes(Request $request, $page) {
        $user = $request->get('auth');

        $data = $this->myImpl->getLootBoxes($user, 12, DataHelper::getOffset($page, 12));
        return response()->json([
            'total' => $data->total,
            'page' => $page,
            'items' => $data->items
        ]);
    }

    public function getSubscriptions(Request $request, $page) {
        $user = $request->get('auth');

        $data = $this->myImpl->getSubscriptions($user, 12, DataHelper::getOffset($page, 12));
        return response()->json([
            'total' => $data->total,
            'page' => $page,
            'items' => $data->items
        ]);
    }
}
