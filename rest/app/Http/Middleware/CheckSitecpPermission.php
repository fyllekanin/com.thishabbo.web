<?php

namespace App\Http\Middleware;

use App\Helpers\PermissionHelper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckSitecpPermission {

    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @param $permission
     *
     * @return mixed
     */
    public function handle($request, Closure $next, $permission) {
        $user = $request->get('auth');
        $haveAccess = false;
        if (strpos($permission, '|') !== false) {
            $haveAccess = $this->anyGroupHaveAccess($user, $permission);
        } else {
            $haveAccess = PermissionHelper::haveSitecpPermission($user->userId, $permission);
        }

        if (!$haveAccess) {
            throw new HttpException(403);
        }
        return $next($request);
    }

    private function anyGroupHaveAccess($user, $permission) {
        $permissions = explode('|', $permission);
        foreach ($permissions as $permission) {
            if (PermissionHelper::haveSitecpPermission($user->userId, $permission)) {
                return true;
            }
        }

        return false;
    }
}
