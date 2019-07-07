<?php

namespace App\Helpers;

use App\EloquentModels\Setting;
use App\Models\Radio\RadioSettings;
use Illuminate\Support\Facades\Cache;

class SettingsHelper {

    public static function getResourcesPath($path) {
        return str_replace('//', '/', base_path('/rest/resources/' . $path));
    }

    public static function getSettingValue($key) {
        $setting = self::getSetting($key);
        return $setting ? $setting->value : null;
    }

    public static function getSetting($key) {
        if (Cache::has('setting-' . $key)) {
            return Cache::get('setting-' . $key);
        }
        $setting = Setting::where('key', $key)->first();
        Cache::add('setting-' . $key, $setting, 10);
        return $setting;
    }

    public static function createOrUpdateSetting($key, $value) {
        if (!isset($value) && $value != '') {
            return;
        }

        $setting = self::getSetting($key);
        if ($setting) {
            $setting->value = $value;
            $setting->save();
        } else {
            $newSetting = new Setting([
                'key' => $key,
                'value' => $value
            ]);
            $newSetting->save();
        }
    }

    public static function getRadioConnectionInformation($withAdminPassword = false) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $radio = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));

        return [
            'ip' => $radio->ip,
            'port' => $radio->port,
            'password' => $radio->password,
            'adminPassword' => $withAdminPassword ? $radio->adminPassword : null,
            'serverType' => $radio->serverType
        ];
    }
}
