<?php

namespace App\Console\Radio;

use App\EloquentModels\RadioStatsLog;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\SettingsHelper;
use App\Models\Radio\RadioSettings;
use App\Utils\Value;

class RadioStats {
    private $userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36';
    private $settingKeys;
    private $isRadioDown = false;

    public function __construct () {
        $this->settingKeys = ConfigHelper::getKeyConfig();
    }

    public function init () {
        if ($this->isRadioDown) {
            return;
        }

        $radio = new RadioSettings(SettingsHelper::getSettingValue($this->settingKeys->radio));
        $statsData = $this->getStatsData($radio);
        $formatted = json_decode($statsData);

        if (!$formatted) {
            // We did not get any data from the radio!
            $this->isRadioDown = true;
            return;
        } else {
            $this->isRadioDown = false;
        }

        $user = $this->getCurrentDjUser((string)$formatted->servergenre);
        $radio->nickname = $user->nickname;
        $radio->likes = $user->likes;
        $radio->userId = $user->userId;
        $radio->listeners = (string)$formatted->currentlisteners;
        $radio->song = (string)$formatted->songtitle;
        $radio->albumArt = $this->getAlbumArt((string)$formatted->songtitle);
        SettingsHelper::createOrUpdateSetting($this->settingKeys->radio, json_encode($radio));

        $this->saveToLog($formatted);
    }

    private function saveToLog($formatted) {
        $log = new RadioStatsLog([
            'listeners' => $formatted->currentlisteners,
            'song' => (string)$formatted->songtitle,
            'genre' => (string)$formatted->servergenre
        ]);
        $log->save();
    }

    private function getStatsData (RadioSettings $radio) {
        $url = $radio->ip . ':' . $radio->port . '/stats?sid=1&json=1';

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_USERAGENT, $this->userAgent);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($curl, CURLOPT_USERPWD, 'admin:' . $radio->adminPassword);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($curl, CURLOPT_TIMEOUT, 5);

        $data = curl_exec($curl);
        curl_close($curl);
        return $data;
    }

    private function getCurrentDjUser ($nickname) {
        $user = User::withNickname($nickname)->first();
        return (object)[
            'userId' => Value::objectProperty($user, 'userId', 0),
            'nickname' => Value::objectProperty($user, 'nickname', 'unknown'),
            'likes' => Value::objectProperty($user, 'likes', 0)
        ];
    }

    private function getAlbumArt ($song) {
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
        if ($formatted->resultCount > 0) {
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
