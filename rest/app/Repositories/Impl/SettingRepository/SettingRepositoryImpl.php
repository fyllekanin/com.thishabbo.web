<?php

namespace App\Repositories\Impl\SettingRepository;

use App\Repositories\Repository\SettingRepository;
use Illuminate\Support\Facades\Cache;

class SettingRepositoryImpl implements SettingRepository {

    private $myDBO;

    public function __construct() {
        $this->myDBO = new SettingDBO();
    }

    public function getResourcePath(string $path) {
        return str_replace('//', '/', base_path('/resources/'.$path));
    }

    public function getValueOfSetting(string $key) {
        if (Cache::has("setting-{$key}")) {
            return Cache::get("setting-{$key}");
        }
        $item = $this->myDBO->query()->withKey($key)->first();
        $value = $item ? $item->value : null;
        Cache::put("setting-{$key}", $value, 10);
        return $value;
    }

    public function getJsonDecodedValueOfSetting(string $key) {
        return json_decode($this->getValueOfSetting($key));
    }

    public function createOrUpdate(string $key, $value) {
        $item = $this->myDBO->query()->withKey($key)->first();
        $dbo = $item ? $item : new $this->myDBO;

        $dbo->key = $key;
        $dbo->value = $value;
        $dbo->save();
        Cache::put("setting-{$key}", $value, 10);
    }
}
