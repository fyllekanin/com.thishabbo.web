<?php

namespace App\Http\Middleware;

use Closure;

use App\Helpers\PermissionHelper;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckStaffPermission {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param $permission
     * @return mixed
     */
    public function handle($request, Closure $next, $permission)
    {
        $user = Cache::get('auth');
        if (!PermissionHelper::haveStaffPermission($user->userId, $permission)) {
            throw new HttpException(403);
        }
        return $next($request);
    }
}
