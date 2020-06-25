<?php

namespace App\Repositories;

use App\Repositories\Repository\AvatarRepository;
use App\Repositories\Repository\CategoryRepository;
use App\Repositories\Repository\ForumListenerRepository;
use App\Repositories\Repository\GroupRepository;
use App\Repositories\Repository\NotificationRepository;
use App\Repositories\Repository\PageRepository;
use App\Repositories\Repository\SettingRepository;
use App\Repositories\Repository\ShopRepository;
use App\Repositories\Repository\SubscriptionRepository;
use App\Repositories\Repository\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider {


    /**
     * Register any application services.
     *
     * @return void
     */
    public function register() {
        $this->app->singleton(GroupRepository::class, 'App\Repositories\Impl\SettingRepository\GroupRepositoryImpl');
        $this->app->singleton(SubscriptionRepository::class, 'App\Repositories\Impl\SettingRepository\SubscriptionRepositoryImpl');
        $this->app->singleton(SettingRepository::class, 'App\Repositories\Impl\SettingRepository\SettingRepositoryImpl');
        $this->app->singleton(AvatarRepository::class, 'App\Repositories\Impl\AvatarRepository\AvatarRepositoryImpl');
        $this->app->singleton(UserRepository::class, 'App\Repositories\Impl\SettingRepository\UserRepositoryImpl');
        $this->app->singleton(ShopRepository::class, 'App\Repositories\Impl\ShopRepository\ShopRepositoryImpl');
        $this->app->singleton(NotificationRepository::class, 'App\Repositories\Impl\NotificationRepository\NotificationRepositoryImpl');
        $this->app->singleton(ForumListenerRepository::class, 'App\Repositories\Impl\NotificationRepository\ForumListenerRepositoryImpl');
        $this->app->singleton(CategoryRepository::class, 'App\Repositories\Impl\CategoryRepository\CategoryRepositoryImpl');
        $this->app->singleton(PageRepository::class, 'App\Repositories\Impl\PageRepository\PageRepositoryImpl');
    }
}
