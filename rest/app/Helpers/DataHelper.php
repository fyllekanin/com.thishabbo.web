<?php

namespace App\Helpers;

use App\Http\Controllers\Controller;
use App\Models\Radio\RadioSettings;

class DataHelper {

    /**
     * @param $count
     * @param int $perPage
     *
     * @return float|int
     */
    public static function getPage($count, $perPage = 0) {
        if ($perPage == 0) {
            $perPage = Controller::$perPageStatic;
        }
        $page = ceil($count / $perPage);
        return $page > 0 ? $page : 1;
    }

    public static function getOffset($page, $perPage = 0) {
        if ($perPage == 0) {
            $perPage = Controller::$perPageStatic;
        }
        return $page >= 2 ? ($perPage * $page) - $perPage : 0;
    }

    public static function getShoutCastV1Stats() {
        $radio = new RadioSettings(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->radio));

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $radio->ip . ':' . $radio->port . '/sitecp.cgi?mode=viewxml');
        self::setCurlOptionsForRadio($curl, $radio->adminPassword);

        $data = curl_exec($curl);
        curl_close($curl);

        return simplexml_load_string(utf8_encode($data));
    }

    public static function getShoutCastV2Stats() {
        $radio = new RadioSettings(SettingsHelper::getSettingValue(ConfigHelper::getKeyConfig()->radio));

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $radio->ip . ':' . $radio->port . '/stats?sid=1&json=1');
        self::setCurlOptionsForRadio($curl, $radio->adminPassword);

        $data = curl_exec($curl);
        curl_close($curl);

        return json_decode($data);
    }

    private static function setCurlOptionsForRadio($curl, $sitecpPassword) {
        curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, 'sitecp:' . $sitecpPassword);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($curl, CURLOPT_TIMEOUT, 5);
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: text/html; charset=utf-8']);
    }
}
