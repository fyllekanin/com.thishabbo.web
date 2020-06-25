<?php

namespace App\Providers;

use App\Providers\Service\ActivityService;
use App\Providers\Service\AuthService;
use App\Providers\Service\BotService;
use App\Providers\Service\CacheService;
use App\Providers\Service\ContentService;
use App\Providers\Service\CreditsService;
use App\Providers\Service\ForumService;
use App\Providers\Service\ForumValidatorService;
use App\Providers\Service\HabboService;
use App\Providers\Service\NotificationService;
use App\Providers\Service\PointsService;
use App\Providers\Service\QueryParamService;
use App\Providers\Service\RadioService;
use App\Providers\Service\ShopService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot() {
        Schema::defaultStringLength(191);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register() {
        $this->app->singleton(CacheService::class, 'App\Providers\Impl\CacheServiceImpl');
        $this->app->singleton(ActivityService::class, 'App\Providers\Impl\ActivityServiceImpl');
        $this->app->singleton(AuthService::class, 'App\Providers\Impl\AuthServiceImpl');
        $this->app->singleton(BotService::class, 'App\Providers\Impl\BotServiceImpl');
        $this->app->singleton(CreditsService::class, 'App\Providers\Impl\CreditsServiceImpl');
        $this->app->singleton(ForumService::class, 'App\Providers\Impl\ForumServiceImpl');
        $this->app->singleton(ForumValidatorService::class, 'App\Providers\Impl\ForumValidatorServiceImpl');
        $this->app->singleton(HabboService::class, 'App\Providers\Impl\HabboServiceImpl');
        $this->app->singleton(NotificationService::class, 'App\Providers\Impl\NotificationServiceImpl');
        $this->app->singleton(PointsService::class, 'App\Providers\Impl\PointsServiceImpl');
        $this->app->singleton(QueryParamService::class, 'App\Providers\Impl\QueryParamServiceImpl');
        $this->app->singleton(ContentService::class, 'App\Providers\Impl\ContentServiceImpl');
        $this->app->singleton(RadioService::class, 'App\Providers\Impl\RadioServiceImpl');
        $this->app->singleton(ShopService::class, 'App\Providers\Impl\ShopServiceImpl');
    }
}
