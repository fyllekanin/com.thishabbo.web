<?php

namespace App\Http\Controllers;

use App\Constants\LogType;
use App\Constants\SettingsKeys;
use App\Constants\Shop\ShopItemTypes;
use App\Constants\Shop\SubscriptionOptions;
use App\EloquentModels\Shop\LootBox;
use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\User;
use App\EloquentModels\User\UserItem;
use App\Factories\Notification\NotificationFactory;
use App\Helpers\ShopHelper;
use App\Logger;
use App\Providers\Service\CreditsService;
use App\Providers\Service\ShopService;
use App\Repositories\Repository\SettingRepository;
use App\Repositories\Repository\ShopRepository;
use App\Repositories\Repository\SubscriptionRepository;
use App\Utils\Condition;
use App\Utils\PaginationUtil;
use Exception;
use Illuminate\Http\Request;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;

class ShopController extends Controller {
    private $myCreditsService;
    private $mySubscriptionRepository;
    private $myShopRepository;
    private $mySettingRepository;
    private $myShopService;

    public function __construct(
        CreditsService $creditsService,
        SubscriptionRepository $subscriptionRepository,
        ShopRepository $shopRepository,
        SettingRepository $settingRepository,
        ShopService $shopService
    ) {
        parent::__construct();
        $this->myCreditsService = $creditsService;
        $this->mySubscriptionRepository = $subscriptionRepository;
        $this->myShopRepository = $shopRepository;
        $this->mySettingRepository = $settingRepository;
        $this->myShopService = $shopService;
    }

    public function buyRotatedItem(Request $request, $shopItemId) {
        $user = $request->get('auth');
        $item = $this->getRotatedItems()->first(
            function ($item) use ($shopItemId) {
                return $item->shopItemId == $shopItemId;
            }
        );
        $shopItem = $this->myShopRepository->getShopItems(collect($item->shopItemId))->first();

        Condition::precondition(!$item, 404, 'No rotated item with that ID');
        Condition::precondition(!$shopItem, 404, 'No item with that shop item id');
        Condition::precondition(
            $this->myShopService->doUserOwnItem($user->userId, $shopItem->shopItemId),
            400,
            'You already own this item'
        );
        Condition::precondition(
            !$this->myCreditsService->haveEnoughCredits($user->userId, $item->credits),
            400,
            'You do not have enough credits'
        );
        $this->myCreditsService->takeCredits($user->userId, $item->credits);
        $this->myShopService->giveUserItem($user->userId, $shopItem->shopItemId);

        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::BOUGHT_ROTATED_SHOP_ITEM,
            ['shopItemId' => $shopItem->shopItemId, 'credits' => $item->credits],
            $shopItem->shopItemId
        );
        return response()->json();
    }

    public function getPaymentVerification(Request $request, $orderId) {
        $user = $request->get('auth');
        $environment = $this->getPaypalEnvironment();
        $client = new PayPalHttpClient($environment);

        $paypalRequest = new OrdersCaptureRequest($orderId);
        $paypalRequest->prefer('return=representation');

        $subscriptionId = 0;
        try {
            $response = $client->execute($paypalRequest);
            $status = $response->result->status;
            $subscriptionId = $response->result->purchase_units[0]->reference_id;
            Condition::precondition($status != 'COMPLETED', 400, 'Something went wrong!');

            $oneMonth = 2592000;
            $this->mySubscriptionRepository->createOrExtendUserSubscription($user->userId, $subscriptionId, $oneMonth);
        } catch (Exception $e) {
            Condition::precondition(true, 400, 'Something went wrong!');
        }

        Logger::user($user->userId, $request->ip(), LogType::PAYPAL_SUBSCRIPTION, [], $subscriptionId);
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
        Condition::precondition(!$this->myCreditsService->haveEnoughCredits($user->userId, $amount), 400, 'You do not have enough THC');

        $this->myCreditsService->giveCredits($receiver->userId, $amount);
        $this->myCreditsService->takeCredits($user->userId, $amount);

        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::SENT_THC,
            ['receiver' => $receiver->nickname, 'amount' => $amount],
            $receiver->userId
        );
        NotificationFactory::newSentThc($receiver->userId, $user->userId, $amount);
        return response()->json();
    }

    public function getDashboard(Request $request) {
        $user = $request->get('auth');

        return response()->json(
            [
                'rotatedItems' => $this->getRotatedItems(),
                'lootBoxes' => $this->getLootBoxesPaginated($user, 3, 0)->items,
                'subscriptions' => $this->getSubscriptionsPaginated($user, 3, 0)->items
            ]
        );
    }

    public function getLootBoxes(Request $request, $page) {
        $user = $request->get('auth');

        $data = $this->getLootBoxesPaginated($user, 12, PaginationUtil::getOffset($page, 12));
        return response()->json(
            [
                'total' => $data->total,
                'page' => $page,
                'items' => $data->items
            ]
        );
    }

    public function getSubscriptions(Request $request, $page) {
        $user = $request->get('auth');

        $data = $this->getSubscriptionsPaginated($user, 12, PaginationUtil::getOffset($page, 12));
        return response()->json(
            [
                'total' => $data->total,
                'page' => $page,
                'items' => $data->items
            ]
        );
    }

    public function buySubscription(Request $request, $subscriptionId) {
        $user = $request->get('auth');
        $oneMonth = 2592000;

        $subscription = Subscription::find($subscriptionId);
        Condition::precondition(!$subscription, 404, 'No subscription with that ID');
        Condition::precondition(
            !$this->myCreditsService->haveEnoughCredits($user->userId, $subscription->credits),
            400, 'You do not have enough credits for this subscription!'
        );

        $this->myCreditsService->takeCredits($user->userId, $subscription->credits);
        $this->mySubscriptionRepository->createOrExtendUserSubscription($user->userId, $subscription->subscriptionId, $oneMonth);

        Logger::user($user->userId, $request->ip(), LogType::BOUGHT_SUBSCRIPTION, [], $subscription->subscriptionId);
        return response()->json();
    }

    public function openLootBox(Request $request, $lootBoxId) {
        $user = $request->get('auth');
        $lootBox = LootBox::find($lootBoxId);
        Condition::precondition(!$lootBox, 404, 'No loot box with that ID');
        Condition::precondition(
            !$this->myCreditsService->haveEnoughCredits($user->userId, $lootBox->credits),
            400, 'You do not have enough credits for this box!'
        );

        $shopItem = ShopHelper::getLootBoxItem($lootBox);
        $this->myCreditsService->takeCredits($user->userId, $lootBox->credits);

        if (!$shopItem || $this->myShopService->doUserOwnItem($user->userId, $shopItem->shopItemId)) {
            $refundedAmount = $this->getRefundedAmount($shopItem, $lootBox);
            $this->myCreditsService->giveCredits($user->userId, $refundedAmount);
            Logger::user(
                $user->userId,
                $request->ip(),
                LogType::OPENED_LOOT_BOX,
                ['isWin' => false],
                $lootBox->lootBoxId
            );
            return response()->json(
                [
                    'isRefund' => true,
                    'amount' => $refundedAmount
                ]
            );
        }

        $this->myShopService->giveUserItem($user->userId, $shopItem->shopItemId);
        Logger::user(
            $user->userId,
            $request->ip(),
            LogType::OPENED_LOOT_BOX,
            ['isWin' => true, 'shopItemId' => $shopItem->shopItemId],
            $lootBox->lootBoxId
        );
        return response()->json(
            [
                'isRefund' => false,
                'amount' => 0,
                'shopItemId' => $shopItem->shopItemId
            ]
        );
    }

    private function getPaypalEnvironment() {
        if (config('paypal.settings.mode') == 'sandbox') {
            return new SandBoxEnvironment(config('paypal.client_id'), config('paypal.secret'));
        } else {
            return new ProductionEnvironment(config('paypal.client_id'), config('paypal.secret'));
        }
    }

    private function getSubscriptionsPaginated($user, $take, $skip) {
        $subscriptions = Subscription::orderBy('createdAt', 'DESC')
            ->take($take)
            ->skip($skip)
            ->whereRaw('(options & '.SubscriptionOptions::IS_LISTED.')')
            ->get()
            ->map(
                function ($subscription) use ($user) {
                    $userSubscription = UserSubscription::where('subscriptionId', $subscription->subscriptionId)
                        ->where('userId', $user->userId)
                        ->where('expiresAt', '>', time())
                        ->first();
                    return [
                        'subscriptionId' => $subscription->subscriptionId,
                        'title' => $subscription->title,
                        'credits' => $subscription->credits,
                        'pounds' => $subscription->pounds,
                        'options' => [
                            'customNameColor' => $subscription->options & SubscriptionOptions::CUSTOM_NAME_COLOR,
                            'customNamePosition' => $subscription->options & SubscriptionOptions::NAME_POSITION,
                            'avatarWidth' => $subscription->avatarWidth,
                            'avatarHeight' => $subscription->avatarHeight
                        ],
                        'expiresAt' => $userSubscription ? $userSubscription->expiresAt : 0
                    ];
                }
            );

        return (object) [
            'items' => $subscriptions,
            'total' => Subscription::whereRaw('(options & '.SubscriptionOptions::IS_LISTED.')')
                ->where('credits', '>', 0)
                ->count()
        ];
    }

    private function getLootBoxesPaginated($user, $take, $skip) {
        $lootBoxes = LootBox::orderBy('createdAt', 'DESC')
            ->take($take)
            ->skip($skip)
            ->get()
            ->map(
                function ($lootBox) use ($user) {
                    return [
                        'lootBoxId' => $lootBox->lootBoxId,
                        'title' => $lootBox->title,
                        'credits' => $lootBox->credits,
                        'boxId' => $lootBox->boxId,
                        'items' => array_map(
                            function ($item) use ($user) {
                                $itemId = $this->getItemId((object) $item);
                                $item['owns'] = UserItem::where('itemId', $itemId)
                                        ->where('userId', $user->userId)
                                        ->where('type', $item['type'])
                                        ->count() > 0;
                                return $item;
                            }, ShopHelper::getLootBoxItems($lootBox)
                        )
                    ];
                }
            );

        return (object) [
            'items' => $lootBoxes,
            'total' => LootBox::count()
        ];
    }

    private function getRefundedAmount($shopItem, $lootBox) {
        if (!$shopItem) {
            return $lootBox->credits;
        }

        return ($lootBox->credits / 100) * $shopItem->rarity;
    }

    private function getItemId($shopItem) {
        switch ($shopItem->type) {
            case ShopItemTypes::BADGE:
                return (is_object($shopItem->data) ? $shopItem->data : json_decode($shopItem->data))->badgeId;
            default:
                return $shopItem->shopItemId;
        }
    }

    private function getRotatedItems() {
        $rotatedItems = collect($this->mySettingRepository->getJsonDecodedValueOfSetting(SettingsKeys::ROTATION_SHOP_ITEMS));
        $shopItemIds = $rotatedItems->map(
            function ($rotatedItem) {
                return $rotatedItem->shopItemId;
            }
        );

        $shopItems = $this->myShopRepository->getShopItems($shopItemIds);

        return $rotatedItems->map(
            function ($rotatedItem) use ($shopItems) {
                $shopItem = $shopItems->first(
                    function ($shopItem) use ($rotatedItem) {
                        return $shopItem->shopItemId == $rotatedItem->shopItemId;
                    }
                );

                $parsedData = $shopItem ? $shopItem->getParsedData() : null;
                return $shopItem ? (object) [
                    'shopItemId' => $shopItem->shopItemId,
                    'rarity' => $shopItem->rarity,
                    'title' => $shopItem->title,
                    'type' => $shopItem->type,
                    'badgeId' => $parsedData && isset($parsedData->badgeId) ? $parsedData->badgeId : null,
                    'credits' => $rotatedItem->credits
                ] : null;
            }
        );
    }
}
