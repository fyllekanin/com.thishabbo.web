<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapApiRoutes();

        $this->mapApiAdminRoutes();

        $this->mapApiForumRoutes();

        $this->mapApiStaffRoutes();

        $this->mapApiUsercpRoutes();

        $this->mapApiArcadeRoutes();
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
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
    protected function mapApiAdminRoutes()
    {
        Route::prefix('api/admin')
            ->middleware(['api', 'maintenance', 'token.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/admin/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiForumRoutes()
    {
        Route::prefix('api/forum')
            ->middleware(['api', 'maintenance', 'token.check', 'habbo_verify.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/forum/api.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiStaffRoutes()
    {
        Route::prefix('api/staff')
            ->middleware(['api', 'maintenance', 'token.check'])
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
    protected function mapApiUsercpRoutes()
    {
        Route::prefix('api/usercp')
            ->middleware(['api', 'maintenance', 'token.check'])
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
    protected function mapApiArcadeRoutes()
    {
        Route::prefix('api/arcade')
            ->middleware(['api', 'maintenance', 'token.check'])
            ->namespace($this->namespace)
            ->group(base_path('routes/arcade/api.php'));
    }
}
