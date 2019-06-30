<?php

namespace App\Services;

use App\Helpers\DataHelper;

class HabboService {
    private $cookies = 'browser_token=thisisabrowsertoken;session.id=thisisasessionid;';
    private $habboApi = 'http://www.habbo.com/api/public/';

    /**
     * @param $name
     *
     * @return mixed|null
     */
    public function getHabboByName($name) {
        return $this->getHabboData($this->habboApi . 'users?name=' . $name);
    }

    /**
     * @param $url
     *
     * @return mixed|null
     */
    public function getHabboData($url) {
        $curl = DataHelper::getBasicCurl($url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Accept-Encoding: gzip, deflate, sdch', 'Cookie: ' . $this->cookies]);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);

        $data = json_decode(curl_exec($curl));
        curl_close($curl);
        return isset($data) && is_object($data) && !isset($data->error) ? $data : null;
    }
}
