<?php

namespace App\Http\Middleware;

use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use App\Helpers\UserHelper;
use Closure;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckMaintenance {

    public function handle ($request, Closure $next) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $isMaintenance = SettingsHelper::getSettingValue($settingKeys->isMaintenance);

        if ($isMaintenance && !$this->canPassMaintenance($request)) {
            throw new HttpException(503);
        }

        return $next($request);
    }

    private function canPassMaintenance ($request) {
        $adminPermissions = ConfigHelper::getAdminConfig();
        $user = UserHelper::getUserFromRequest($request);
        return PermissionHelper::haveAdminPermission($user->userId, $adminPermissions->canEditWebsiteSettings);
    }
}
