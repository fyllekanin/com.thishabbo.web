<?php

namespace App\Http\Middleware;

use App\Helpers\PermissionHelper;
use Closure;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckAdminPermission {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @param $permission
     *
     * @return mixed
     */
    public function handle($request, Closure $next, $permission) {
        $user = $request->get('auth');
        $haveAccess = strpos($permission, '|') !== false ?
            $this->anyGroupHaveAccess($user, $permission) :
            PermissionHelper::haveAdminPermission($user->userId, $permission);

        if (!$haveAccess) {
            throw new HttpException(403);
        }
        return $next($request);
    }

    private function anyGroupHaveAccess($user, $permission) {
        $permissions = explode('|', $permission);
        foreach ($permissions as $permission) {
            if (PermissionHelper::haveAdminPermission($user->userId, $permission)) {
                return true;
            }
        }

        return false;
    }
}
