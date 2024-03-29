<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider {

    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map() {
        $this->mapApiRoutes();

        $this->mapApiSitecpRoutes();

        $this->mapApiForumRoutes();

        $this->mapApiShopRoutes();

        $this->mapApiStaffRoutes();

        $this->mapApiUsercpRoutes();

        $this->mapApiArcadeRoutes();

        $this->mapApiSchoolRoutes();

        Route::prefix('/')
            ->namespace($this->namespace)
            ->group(base_path('routes/base-route.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes() {
        Route::prefix('api')
            ->middleware(['api', 'user.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiSitecpRoutes() {
        Route::prefix('api/sitecp')
            ->middleware(['api', 'user.check', 'auth.check', 'gdpr.check', 'maintenance'])
            ->namespace($this->namespace)
            ->group(base_path('routes/sitecp/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiForumRoutes() {
        Route::prefix('api/forum')
            ->middleware(['api', 'user.check', 'maintenance', 'habbo_verify.check', 'gdpr.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/forum/api.php'));
    }

    protected function mapApiShopRoutes() {
        Route::prefix('api/shop')
            ->middleware(['api', 'user.check', 'auth.check', 'maintenance', 'habbo_verify.check', 'gdpr.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/shop/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiStaffRoutes() {
        Route::prefix('api/staff')
            ->middleware(['api', 'user.check', 'auth.check', 'maintenance', 'gdpr.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/staff/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiUsercpRoutes() {
        Route::prefix('api/usercp')
            ->middleware(['api', 'user.check', 'auth.check', 'maintenance', 'gdpr.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/usercp/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiArcadeRoutes() {
        Route::prefix('api/arcade')
            ->middleware(['api', 'user.check', 'maintenance', 'gdpr.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/arcade/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiSchoolRoutes() {
        Route::prefix('api/school')
            ->middleware(['api'])
            ->namespace($this->namespace)
            ->group(base_path('routes/school/api.php'));
    }
}
