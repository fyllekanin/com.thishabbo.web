<?php

namespace App\Http\Middleware;

use Closure;

use App\Helpers\PermissionHelper;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckAdminPermission {
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
        $haveAccess = strpos($permission, '|') !== false ?
            $this->anyGroupHaveAcess($request, $permission) :
            PermissionHelper::haveAdminPermission($request->token->userId, $permission);

        if (!$haveAccess) {
            throw new HttpException(403);
        }
        return $next($request);
    }

    private function anyGroupHaveAcess($request, $permission) {
        $permissions = explode('|', $permission);
        foreach ($permissions as $permission) {
            if (PermissionHelper::haveAdminPermission($request->token->userId, $permission)) {
                return true;
            }
        }

        return false;
    }
}
