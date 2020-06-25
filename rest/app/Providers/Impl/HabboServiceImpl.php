<?php

namespace App\Providers\Impl;

use App\Providers\Service\HabboService;
use App\Utils\CurlBuilder;
use Exception;

class HabboServiceImpl implements HabboService {

    private $cookies = 'browser_token=thisisabrowsertoken;session.id=thisisasessionid;';
    private $habboApi = 'http://www.habbo.com/api/public/';

    public function getHabboByName($name) {
        $habbo = $this->getHabboData($this->habboApi.'users?name='.$name, true, true, true);
        return is_object($habbo) && !isset($habbo->error) ? $habbo : null;
    }

    public function getHabboBadges($habboId) {
        $data = $this->getHabboData($this->habboApi.'users/'.$habboId.'/badges', true, true, true);
        return is_array($data) ? $data : null;
    }

    public function getHabboData($url, $isJson = true, $withEncoding = true, $isGzip = false) {
        $headers = [
            'Cookie: '.$this->cookies,
            'Content-Type: application/json; charset=utf-8'
        ];
        if ($withEncoding) {
            $headers[] = 'Accept-Encoding: gzip, deflate, sdch';
        }
        $data = CurlBuilder::newBuilder($url)
            ->withHeaders($headers)
            ->withSslVerify()
            ->exec();

        $decoded = null;

        try {
            $decoded = $isJson ? json_decode($isGzip ? gzdecode($data) : $data) : $data;
        } catch (Exception $e) {
            $decoded = $isJson ? json_decode($data) : $data;
        }

        return isset($decoded) ? $decoded : null;
    }
}
