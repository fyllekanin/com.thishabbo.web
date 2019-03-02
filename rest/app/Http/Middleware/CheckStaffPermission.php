<?php

namespace App\Http\Middleware;

use Closure;

use App\Helpers\PermissionHelper;
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
        if (!PermissionHelper::haveStaffPermission($request->token->userId, $permission)) {
            throw new HttpException(403);
        }
        return $next($request);
    }
}
