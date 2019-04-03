<?php

namespace App\Http\Middleware;

use App\Helpers\ConfigHelper;
use App\Helpers\PermissionHelper;
use App\Helpers\SettingsHelper;
use Closure;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckMaintenance {

    public function handle ($request, Closure $next) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $isMaintenance = SettingsHelper::getSettingValue($settingKeys->isMaintenance);

        if ($isMaintenance && !$this->canPassMaintenance()) {
            throw new HttpException(503);
        }

        return $next($request);
    }

    private function canPassMaintenance () {
        $adminPermissions = ConfigHelper::getAdminConfig();
        $user = Cache::get('auth');

        return PermissionHelper::haveAdminPermission($user->userId, $adminPermissions->canEditWebsiteSettings);
    }
}
