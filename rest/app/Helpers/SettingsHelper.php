<?php

namespace App\Helpers;

use App\EloquentModels\Setting;
use App\Models\Radio\RadioSettings;

class SettingsHelper {

    public static function getSettingValue($key) {
        $setting = self::getSetting($key);
        return $setting ? $setting->value : null;
    }

    public static function getSetting($key) {
        return Setting::where('key', $key)->getQuery()->first();
    }

    public static function createOrUpdateSetting($key, $value) {
        if (!isset($value) && $value != '') {
            return;
        }

        $setting = Setting::where('key', $key)->first();
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

    public static function getRadioConnectionInformation($withSitecpPassword = false) {
        $settingKeys = ConfigHelper::getKeyConfig();
        $radio = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));

        return [
            'ip' => $radio->ip,
            'port' => $radio->port,
            'password' => $radio->password,
            'sitecpPassword' => $withSitecpPassword ? $radio->sitecpPassword : null,
            'serverType' => $radio->serverType
        ];
    }
}
