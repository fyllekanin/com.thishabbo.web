<?php

namespace App\Http\Controllers\Admin\Shop;

use App\EloquentModels\Shop\Subscription;
use App\EloquentModels\Shop\UserSubscription;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Http\Controllers\Controller;
use App\Jobs\SubscriptionUpdated;
use App\Logger;
use App\Models\Logger\Action;
use App\Utils\Condition;
use App\Utils\Value;
use Illuminate\Http\Request;

class SubscriptionsController extends Controller {

    public function __construct(Request $request) {
        parent::__construct($request);
    }

    public function getSubscriptions(Request $request, $page) {
        $title = $request->input('filter');
        $items = Subscription::orderBy('title', 'ASC');

        if ($title) {
            $items->where('title', 'LIKE', Value::getFilterValue($request, $title));
        }

        return response()->json([
            'page' => $page,
            'total' => DataHelper::getPage($items->count()),
            'items' => $items->take($this->perPage)->skip($this->getOffset($page))->get()->map(function ($subscription) {
                return [
                    'subscriptionId' => $subscription->subscriptionId,
                    'title' => $subscription->title,
                    'membersCount' => UserSubscription::where('subscriptionId', $subscription->subscriptionId)->count()
                ];
            })
        ]);
    }

    public function getSubscription($subscriptionId) {
        $subscription = Subscription::find($subscriptionId);
        Condition::precondition(!$subscription, 404, 'No subscription with that ID');

        return response()->json([
            'subscriptionId' => $subscription->subscriptionId,
            'title' => $subscription->title,
            'avatarWidth' => $subscription->avatarWidth,
            'avatarHeight' => $subscription->avatarHeight,
            'credits' => $subscription->credits,
            'pounds' => $subscription->pounds,
            'options' => $this->convertOptionsToBooleans($subscription),
            'createdAt' => $subscription->createdAt->timestamp
        ]);
    }

    public function createSubscription(Request $request) {
        $data = (object)$request->input('data');
        $this->validateSubscription($data);

        $subscription = new Subscription([
            'title' => $data->title,
            'avatarWidth' => $data->avatarWidth,
            'avatarHeight' => $data->avatarHeight,
            'credits' => $data->credits,
            'pounds' => $data->pounds,
            'options' => $this->convertBooleansToOptions($data)
        ]);
        $subscription->save();

        Logger::admin($this->user->userId, $request->ip(), Action::CREATED_SUBSCRIPTION, [], $subscription->subscriptionId);
        return response()->json();
    }

    public function updateSubscription(Request $request, $subscriptionId) {
        $data = (object)$request->input('data');
        $subscription = Subscription::find($subscriptionId);

        Condition::precondition(!$subscription, 404, 'No subscription with that ID');
        $this->validateSubscription($data);

        SubscriptionUpdated::dispatch($subscriptionId);

        $subscription->title = $data->title;
        $subscription->avatarWidth = $data->avatarWidth;
        $subscription->avatarHeight = $data->avatarHeight;
        $subscription->credits = $data->credits;
        $subscription->pounds = $data->pounds;
        $subscription->options = $this->convertBooleansToOptions($data);
        $subscription->save();

        Logger::admin($this->user->userId, $request->ip(), Action::UPDATED_SUBSCRIPTION, [], $subscription->subscriptionId);
        return response()->json();
    }

    public function deleteSubscription(Request $request, $subscriptionId) {
        $subscription = Subscription::find($subscriptionId);

        $subscription->isDeleted = true;
        $subscription->save();

        UserSubscription::where('subscriptionId', $subscriptionId)->delete();
        SubscriptionUpdated::dispatch($subscriptionId);

        Logger::admin($this->user->userId, $request->ip(), Action::DELETED_SUBSCRIPTION, [], $subscription->subscriptionId);
        return response()->json();
    }

    private function validateSubscription($subscription) {
        Condition::precondition(!isset($subscription->title) || empty($subscription->title), 400,
            'Title can not be empty');
        Condition::precondition(!is_numeric($subscription->avatarWidth),
            400, 'Avatar width needs to numeric');
        Condition::precondition(!is_numeric($subscription->avatarHeight),
            400, 'Avatar height needs to numeric');

        Condition::precondition(!is_numeric($subscription->credits),
            400, 'Credits needs to numeric');
        Condition::precondition(!is_numeric($subscription->pounds),
            400, 'Pounds needs to numeric');
    }

    private function convertBooleansToOptions($subscription) {
        $options = 0;
        foreach (ConfigHelper::getSubscriptionOptions() as $key => $option) {
            if (isset($subscription->options[$key]) && $subscription->options[$key]) {
                $options += $option;
            }
        }
        return $options;
    }

    private function convertOptionsToBooleans($subscription) {
        $options = [];
        foreach (ConfigHelper::getSubscriptionOptions() as $key => $option) {
            $options[$key] = (boolean)$subscription->options & $option;
        }
        return $options;
    }
}
