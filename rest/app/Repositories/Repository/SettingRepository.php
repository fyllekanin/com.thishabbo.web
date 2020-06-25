<?php

namespace App\Repositories\Repository;

interface SettingRepository {


    /**
     * Get the full path to a resource
     *
     * @param  string  $path
     *
     * @return string
     */
    public function getResourcePath(string $path);

    /**
     * Get the value of a setting based on key
     *
     * @param  string  $key
     *
     * @return mixed
     */
    public function getValueOfSetting(string $key);

    /**
     * Get the value of a setting based key with json_decode
     *
     * @param  string  $key
     *
     * @return array|object
     */
    public function getJsonDecodedValueOfSetting(string $key);

    /**
     * Create or update a setting
     *
     * @param  string  $key
     * @param  mixed  $value
     */
    public function createOrUpdate(string $key, $value);
}
