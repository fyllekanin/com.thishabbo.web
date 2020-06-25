<?php

namespace App\Http\Middleware;

use App\Constants\Permission\SiteCpPermissions;
use App\Constants\SettingsKeys;
use App\Helpers\PermissionHelper;
use App\Repositories\Repository\SettingRepository;
use Closure;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CheckMaintenance {

    private $mySettingRepository;

    public function __construct(SettingRepository $settingRepository) {
        $this->mySettingRepository = $settingRepository;
    }

    public function handle($request, Closure $next) {
        $isMaintenance = $this->mySettingRepository->getValueOfSetting(SettingsKeys::IS_MAINTENANCE);

        if ($isMaintenance && !$this->canPassMaintenance($request)) {
            throw new HttpException(503);
        }

        return $next($request);
    }

    private function canPassMaintenance($request) {
        $user = $request->get('auth');
        return PermissionHelper::haveSitecpPermission($user->userId, SiteCpPermissions::CAN_EDIT_WEBSITE_SETTINGS);
    }
}
