<?php

namespace App\Console\Jobs;

use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Models\Radio\RadioSettings;

class ClearDJSays {

    public function init() {
        $settingKeys = ConfigHelper::getKeyConfig();
        $radio = new RadioSettings(SettingsHelper::getSettingValue($settingKeys->radio));
        $radio->djSays = 'DJ says has not been set!';
        SettingsHelper::createOrUpdateSetting($settingKeys->radio, json_encode($radio));
    }
}
