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
     * @param bool $isJson
     *
     * @param bool $withEncoding
     *
     * @return mixed|null
     */
    public function getHabboData($url, $isJson = true, $withEncoding = true) {
        $headers = [
            'Cookie: ' . $this->cookies,
            'Content-Type: text/html; charset=utf-8'
        ];
        if ($withEncoding) {
            $headers[] = 'Accept-Encoding: gzip, deflate, sdch';
        }
        $curl = DataHelper::getBasicCurl($url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 1);

        $data = $isJson ? json_decode(curl_exec($curl)) : curl_exec($curl);
        curl_close($curl);
        return isset($data) ? $data : null;
    }
}
