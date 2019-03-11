<?php

namespace App\Services;

class HabboService {
    private $agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';
    private $cookies = 'browser_token=thisisabrowsertoken;session.id=thisisasessionid;';
    private $habboApi = 'http://www.habbo.com/api/public/';

    /**
     * Check if a certain habbo's motto is according to argument
     *
     * @param $name
     * @param $motto
     * @return bool
     */
    public function isHabboMotto($name, $motto) {
        $habbo = $this->getHabboByName($name);
        return $habbo && $habbo->motto == $motto;
    }

    /**
     * @param $name
     * @return mixed|null
     */
    public function getHabboByName($name) {
        return json_decode($this->getData($this->habboApi . 'users?name=' . $name));
    }

    /**
     * @param $url
     * @return mixed|null
     */
    private function getData($url) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Accept-Encoding: gzip, deflate, sdch', 'Cookie: ' . $this->cookies]);
        curl_setopt($curl, CURLOPT_USERAGENT, $this->agent);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
        return curl_getinfo($curl, CURLINFO_HTTP_CODE) != 200 ? null : json_decode(curl_exec($curl));
    }
}
