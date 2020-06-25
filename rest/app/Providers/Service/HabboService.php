<?php

namespace App\Providers\Service;

interface HabboService {


    /**
     * Get habbo object based on their habbo name
     *
     * @param $name
     *
     * @return mixed|null
     */
    public function getHabboByName($name);

    /**
     * Get list of habbo badges from given habbo user ID
     *
     * @param $habboId
     *
     * @return array|mixed|null
     */
    public function getHabboBadges($habboId);

    /**
     * Do request to habbo API
     *
     * @param  string  $url
     * @param  bool  $isJson
     * @param  bool  $withEncoding
     * @param  bool  $isGzip
     *
     * @return mixed|null
     */
    public function getHabboData($url, $isJson = true, $withEncoding = true, $isGzip = false);
}
