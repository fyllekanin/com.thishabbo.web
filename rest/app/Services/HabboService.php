<?php

namespace App\Services;

class HabboService {
    private $agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';
    private $cookies = 'browser_token=thisisabrowsertoken;session.id=thisisasessionid;';
    private $habboApi = 'http://www.habbo.com/api/public/';

    /**
     * @param $name
     * @return mixed|null
     */
    public function getHabboByName($name) {
        return $this->getData($this->habboApi . 'users?name=' . $name);
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

        $data = json_decode(curl_exec($curl));
        return isset($data) && is_object($data) && !isset($data->error) ? $data : null;
    }
}
