<?php

namespace App\Console\Commands;

use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Helpers\ConfigHelper;
use App\Helpers\DataHelper;
use App\Helpers\SettingsHelper;
use App\Models\Radio\RadioServerTypes;
use App\Models\Radio\RadioSettings;
use App\Utils\Value;
use Illuminate\Console\Command;

class RadioStats extends Command {
    private $settingKeys;

    protected $signature = 'queue:radio';

    public function __construct() {
        parent::__construct();
        $this->settingKeys = ConfigHelper::getKeyConfig();
    }

    public function handle() {

        $radio = new RadioSettings(SettingsHelper::getSettingValue($this->settingKeys->radio));
        $statsData = $this->getStatsData($radio);

        if (!$statsData) {
            return;
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
            case RadioServerTypes::SHOUT_CAST_V2:
                return DataHelper::getShoutCastV2Stats();
            case RadioServerTypes::SHOUT_CAST_V1:
            default:
                return $this->getShoutCastV1Stats();
        }
    }

    private function getShoutCastV1Stats() {
        $radioStats = (object)[
            'servergenre' => '',
            'currentlisteners' => 0,
            'songtitle' => ''
        ];

        $data = DataHelper::getShoutCastV1Stats();
        if ($data != null && $data != false) {
            $radioStats->servergenre = (string)$data->SERVERGENRE;
            $radioStats->currentlisteners = (string)$data->REPORTEDLISTENERS;
            $radioStats->songtitle = (string)$data->SONGTITLE;
        }
        return $radioStats;
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
        $curl = DataHelper::getBasicCurl($url);

        $data = curl_exec($curl);
        curl_close($curl);
        if (!$data) {
            return '';
        }

        $formatted = json_decode($data);
        if ($formatted->resultCount == 0 && strpos($song, '-') !== false) {
            $artist = explode('-', $song);
            return count($artist) > 0 ? $this->getAlbumArt($artist[0]) : '';
        }

        return isset($formatted) && is_array($formatted->results) && count($formatted->results) > 0 ?
            $formatted->results[0]->artworkUrl100 :
            '';
    }
}
