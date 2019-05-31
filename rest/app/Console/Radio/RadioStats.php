<?php

namespace App\Console\Radio;

use App\EloquentModels\RadioStatsLog;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Models\Radio\RadioServerTypes;
use App\Models\Radio\RadioSettings;
use App\Utils\Value;

class RadioStats {
    private $userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36';
    private $settingKeys;
    private $isRadioDown = false;

    public function __construct() {
        $this->settingKeys = ConfigHelper::getKeyConfig();
    }

    public function init() {
        if ($this->isRadioDown) {
            return;
        }

        $radio = new RadioSettings(SettingsHelper::getSettingValue($this->settingKeys->radio));
        $statsData = $this->getStatsData($radio);

        if (!$statsData) {
            // We did not get any data from the radio!
            $this->isRadioDown = true;
            return;
        } else {
            $this->isRadioDown = false;
        }

        $user = $this->getCurrentDjUser((string)$statsData->servergenre);
        $radio->nextDj = $this->getNextDj();
        $radio->nickname = $user->nickname;
        $radio->likes = $user->likes;
        $radio->userId = $user->userId;
        $radio->listeners = (string)$statsData->currentlisteners;
        $radio->song = (string)$statsData->songtitle;
        $radio->albumArt = $this->getAlbumArt((string)$statsData->songtitle);
        SettingsHelper::createOrUpdateSetting($this->settingKeys->radio, json_encode($radio));
    }

    private function getNextDj() {
        $day = date('N');
        $hour = date('G') + 1;

        if ($hour > 23) {
            $hour -= 24;
            $day += 1;
        }

        if ($day > 7) {
            $day -= 7;
        }

        $nextSlot = Timetable::radio()->where('day', $day)->where('hour', $hour)->first();
        return $nextSlot ? $nextSlot->user->nickname : null;
    }

    private function getStatsData(RadioSettings $radio) {
        switch ($radio->serverType) {
            case RadioServerTypes::SHOUT_CAST_v2:
                return $this->getShoutCastV2Stats($radio);
            case RadioServerTypes::SHOUT_CAST_V1:
            default:
                return $this->getShoutCastV1Stats($radio);
        }
    }

    private function getShoutCastV1Stats(RadioSettings $radio) {
        $url = $radio->ip . ':' . $radio->port . '/admin.cgi?mode=viewxml';
        $radioStats = (object)[
            'servergenre' => '',
            'currentlisteners' => 0,
            'songtitle' => ''
        ];

        $data = $this->doCurl($url, $radio->adminPassword);
        try {
            $xml = simplexml_load_string($data);
            if ($xml != null && $xml != false) {
                $radioStats->servergenre = (string)$xml->SERVERGENRE;
                $radioStats->currentlisteners = (string)$xml->CURRENTLISTENERS;
                $radioStats->songtitle = (string)$xml->SONGTITLE;
            }
        } catch (\Exception $e) {
        }
        return $radioStats;
    }

    private function getShoutCastV2Stats(RadioSettings $radio) {
        $url = $radio->ip . ':' . $radio->port . '/stats?sid=1&json=1';

        return json_decode($this->doCurl($url, $radio->adminPassword));
    }

    private function doCurl($url, $adminPassword) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_USERAGENT, $this->userAgent);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, 'admin:' . $adminPassword);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($curl, CURLOPT_TIMEOUT, 5);

        $data = curl_exec($curl);
        curl_close($curl);
        return $data;
    }

    private function getCurrentDjUser($nickname) {
        $user = User::withNickname($nickname)->first();
        return (object)[
            'userId' => Value::objectProperty($user, 'userId', 0),
            'nickname' => Value::objectProperty($user, 'nickname', 'unknown'),
            'likes' => Value::objectProperty($user, 'likes', 0)
        ];
    }

    private function getAlbumArt($song) {
        $url = 'https://itunes.apple.com/search?term=' . urlencode($song) . '&entity=album&limit=1';
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_USERAGENT, $this->userAgent);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $data = curl_exec($curl);
        curl_close($curl);
        if (!$data) {
            return '';
        }

        $formatted = json_decode($data);
        if ($formatted->resultCount == 0) {
            if (strpos($song, '-' !== false)) {
                $artist = explode('-', $song);
                return count($artist) > 0 ? $this->getAlbumArt($artist[0]) : '';
            }
            return '';
        }

        return isset($formatted) && is_array($formatted->results) && count($formatted->results) > 0 ?
            $formatted->results[0]->artworkUrl100 :
            '';
    }
}
