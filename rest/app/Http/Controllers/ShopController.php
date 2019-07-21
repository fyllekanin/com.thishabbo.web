<?php

namespace App\Http\Controllers;

use App\EloquentModels\Shop\LootBox;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\User\User;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\DataHelper;
use App\Helpers\ShopHelper;
use App\Http\Impl\ShopControllerImpl;
use App\Logger;
use App\Models\Logger\Action;
use App\Services\CreditsService;
use App\Utils\Condition;
use Illuminate\Http\Request;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;

class ShopController extends Controller {
    private $myImpl;
    private $creditsService;

    public function __construct(ShopControllerImpl $impl, CreditsService $creditsService) {
        parent::__construct();
        $this->myImpl = $impl;
        $this->creditsService = $creditsService;
    }

    public function getPaymentVerification(Request $request, $orderId) {
        $user = $request->get('auth');
        $environment = null;
        if (config('paypal.settings.mode') == 'sandbox') {
            $environment = new SandBoxEnvironment(config('paypal.client_id'), config('paypal.secret'));
        } else {
            $environment = new ProductionEnvironment(config('paypal.client_id'), config('paypal.secret'));
        }
        $client = new PayPalHttpClient($environment);

        $paypalRequest = new OrdersCaptureRequest($orderId);
        $paypalRequest->prefer('return=representation');

        $subscriptionId = 0;
        try {
            $response = $client->execute($paypalRequest);
            $status = $response->result->status;
            $subscriptionId = $response->result->purchase_units[0]->reference_id;
            Condition::precondition($status != 'COMPLETED', 400, 'Something went wrong!');

            $oneMonth = 2419200;
            $this->myImpl->giveUserSubscription($user, (object)[
                'subscriptionId' => $subscriptionId,
                'subscriptionTime' => $oneMonth
            ]);
        } catch (\HttpException $e) {
            Condition::precondition(true, 400, 'Something went wrong!');
        }

        Logger::user($user->userId, $request->ip(), Action::PAYPAL_SUBSCRIPTION, [], $subscriptionId);
        return response()->json();
    }

    public function sendThc(Request $request) {
        $user = $request->get('auth');

        $amount = $request->input('amount');
        $nickname = $request->input('nickname');

        $receiver = User::withNickname($nickname)->first();
        Condition::precondition(!$receiver, 404, 'No user with that nickname');
        Condition::precondition(!is_numeric($amount), 400, 'Amount need to be a number');
        Condition::precondition($amount < 1, 400, 'You can not send 0 or less THC!');
        Condition::precondition(!$this->creditsService->haveEnoughCredits($user->userId, $amount), 400, 'You do not have enough THC');

        $this->creditsService->giveCredits($receiver->userId, $amount);
        $this->creditsService->takeCredits($user->userId, $amount);

        Logger::user($user->userId, $request->ip(), Action::SENT_THC, [
            'receiver' => $receiver->nickname,
            'amount' => $amount
        ], $receiver->userId);
        NotificationFactory::newSentThc($receiver->userId, $user->userId, $amount);
        return response()->json();
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

    public function buySubscription(Request $request, $subscriptionId) {
        $user = $request->get('auth');
        $oneMonth = 2592000;

        $subscription = Subscription::find($subscriptionId);
        Condition::precondition(!$subscription, 404, 'No subscription with that ID');
        Condition::precondition(!$this->creditsService->haveEnoughCredits($user->userId, $subscription->credits),
            400, 'You do not have enough credits for this subscription!');

        $this->creditsService->takeCredits($user->userId, $subscription->credits);
        $this->myImpl->giveUserSubscription($user, (object)[
            'subscriptionId' => $subscription->subscriptionId,
            'subscriptionTime' => $oneMonth
        ]);

        Logger::user($user->userId, $request->ip(), Action::BOUGHT_SUBSCRIPTION, [], $subscription->subscriptionId);
        return response()->json();
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
