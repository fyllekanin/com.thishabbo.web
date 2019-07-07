<?php

namespace App\Http\Controllers;

use App\EloquentModels\Shop\LootBox;
use App\Helpers\DataHelper;
use App\Helpers\ShopHelper;
use App\Http\Impl\ShopControllerImpl;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use Illuminate\Http\Request;

class ShopController extends Controller {
    private $myImpl;
    private $creditsService;

    public function __construct(ShopControllerImpl $impl, CreditsService $creditsService) {
        parent::__construct();
        $this->myImpl = $impl;
        $this->creditsService = $creditsService;
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

    public function openLootBox(Request $request, $lootBoxId) {
        $user = $request->get('auth');
        $lootBox = LootBox::find($lootBoxId);
        Condition::precondition(!$lootBox, 404, 'No loot box with that ID');
        Condition::precondition(!$this->creditsService->haveEnoughCredits($user->userId, $lootBox->credits),
            400, 'You do not have enough credits for this box!');

        $shopItem = ShopHelper::getLootBoxItem($lootBox);
        $this->creditsService->takeCredits($user->userId, $lootBox->credits);

        if (!$shopItem || $this->myImpl->doUserOwnItem($user, $shopItem)) {
            $refundedAmount = $this->myImpl->getRefundedAmount($shopItem, $lootBox);
            $this->creditsService->giveCredits($user->userId, $refundedAmount);
            Logger::user($user->userId, $request->ip(), Action::OPENED_LOOT_BOX, [
                'isWin' => false
            ], $lootBox->lootBoxId);
            return response()->json([
                'isRefund' => true,
                'amount' => $refundedAmount
            ]);
        }

        $this->myImpl->giveUserItem($user, $shopItem);
        Logger::user($user->userId, $request->ip(), Action::OPENED_LOOT_BOX, [
            'isWin' => true,
            'shopItemId' => $shopItem->shopItemId
        ], $lootBox->lootBoxId);
        return response()->json([
            'isRefund' => false,
            'amount' => 0,
            'shopItemId' => $shopItem->shopItemId
        ]);
    }
}
