<?php

namespace App\Services;

use App\Helpers\ConfigHelper;
use App\Utils\Condition;
use Illuminate\Support\Arr;

class HabboService {

    public function getBasicHabbo ($name) {
        $agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';
        $url = 'http://www.habbo.com/api/public/users?name=' . $name;

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Accept-Encoding: gzip, deflate, sdch']);
        curl_setopt($curl, CURLOPT_USERAGENT, $agent);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl, CURLOPT_PROXY, Arr::random(ConfigHelper::getProxies()));
        $data = json_decode(curl_exec($curl));

        Condition::precondition(!$data, 500, 'Habbo API down');
        Condition::precondition(curl_getinfo($curl, CURLINFO_HTTP_CODE) == 404, 404,
            'No habbo with the name ' . $name . ' exists');

        curl_close($curl);
        return $data;
    }

    /**
     * @param $name
     * @param $postFix
     */
    public function validateHabbo ($name, $postFix) {
        $habbo = $this->getBasicHabbo($name);
        Condition::precondition(strtotime($habbo->memberSince) > strtotime('-1 week'),
            400, 'Your habbo is to young, needs to be at least 1 week');
        Condition::precondition(strtolower($habbo->motto) != 'thishabbo-' . $postFix, 400, 'Motto did not match');
    }
}
