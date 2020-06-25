<?php

namespace App\Http\Controllers\Sitecp;

use App\EloquentModels\Forum\Post;
use App\EloquentModels\Forum\Thread;
use App\EloquentModels\Shop\UserSubscription;
use App\EloquentModels\User\UserData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class SitecpDashboardController extends Controller {

    /**
     * @param $clientTodayMidnight
     *
     * @return JsonResponse
     */
    public function getDashboard($clientTodayMidnight) {
        return response()->json(
            [
                'stats' => [
                    'posts' => Post::where('createdAt', '>=', $clientTodayMidnight)->count('postId'),
                    'threads' => Thread::where('createdAt', '>=', $clientTodayMidnight)->count('threadId'),
                    'credits' => UserData::where('credits', '>', 0)->sum('credits'),
                    'subscriptions' => UserSubscription::isActive()->count('userSubscriptionId')
                ]
            ]
        );
    }
}
