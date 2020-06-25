<?php

namespace App\Console\Commands;

use App\Constants\RadioServerTypes;
use App\Constants\SettingsKeys;
use App\EloquentModels\Log\RadioStatsLog;
use App\EloquentModels\Staff\Timetable;
use App\EloquentModels\User\User;
use App\Models\Radio\RadioSettings;
use App\Providers\Service\RadioService;
use App\Repositories\Repository\SettingRepository;
use App\Utils\CurlBuilder;
use App\Utils\Value;
use Illuminate\Console\Command;

class RadioStats extends Command {
    private $myRadioService;
    private $mySettingRepository;

    protected $signature = 'queue:radio';

    public function __construct(RadioService $radioService, SettingRepository $settingRepository) {
        parent::__construct();
        $this->myRadioService = $radioService;
        $this->mySettingRepository = $settingRepository;
    }

    public function handle() {
        $radio = $this->myRadioService->getRadioSettings();
        $currentMinute = date('i', time());

        $radio = $this->updateStats($radio);
        $radio->djSays = $currentMinute == '00' ? '' : $radio->djSays;

        if ($currentMinute == '00' || ((int) $currentMinute % 5 == 0)) {
            RadioStatsLog::create(
                [
                    'userId' => $radio->userId,
                    'listeners' => $radio->listeners,
                    'song' => $radio->song
                ]
            );
        }

        $this->mySettingRepository->createOrUpdate(SettingsKeys::RADIO, json_encode($radio));
    }

    private function updateStats($radio) {
        $statsData = $this->getStatsData($radio);

        if (!$statsData) {
            return $radio;
        }

        $user = $this->getCurrentDjUser((string) $statsData->servergenre);
        $radio->nextDjId = $this->getNextDj();
        $radio->likes = $user->likes;
        $radio->userId = $user->userId;
        $radio->listeners = (string) $statsData->currentlisteners;
        $radio->song = (string) $statsData->songtitle;
        $radio->albumArt = $this->getAlbumArt((string) $statsData->songtitle);
        return $radio;
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

        $nextSlot = Timetable::radio()->isActive()->where('day', $day)->where('hour', $hour)->first();
        return $nextSlot ? $nextSlot->user->userId : null;
    }

    private function getStatsData(RadioSettings $radio) {
        switch ($radio->serverType) {
            case RadioServerTypes::SHOUT_CAST_V2:
                return $this->myRadioService->getShoutCastV2Stats();
            case RadioServerTypes::ICE_CAST_V2:
                return $this->myRadioService->getIceCastV2Stats();
            case RadioServerTypes::SHOUT_CAST_V1:
            default:
                return $this->myRadioService->getShoutCastV1Stats();
        }
    }

    private function getCurrentDjUser($nickname) {
        $user = User::withNickname($nickname)->first();
        return (object) [
            'userId' => Value::objectProperty($user, 'userId', 0),
            'nickname' => Value::objectProperty($user, 'nickname', 'unknown'),
            'likes' => Value::objectProperty($user, 'likes', 0)
        ];
    }

    private function getAlbumArt($song) {
        $url = 'https://itunes.apple.com/search?term='.urlencode($song).'&entity=album&limit=1';
        $data = CurlBuilder::newBuilder($url)
            ->exec();
        if (!$data) {
            return '';
        }

        $formatted = json_decode($data);
        if ($formatted && $formatted->resultCount == 0 && strpos($song, '-') !== false) {
            $artist = explode('-', $song);
            return count($artist) > 0 ? $this->getAlbumArt($artist[0]) : '';
        }

        $isDataDefined = isset($formatted) && is_array($formatted->results) && count($formatted->results) > 0;
        return $isDataDefined ? $formatted->results[0]->artworkUrl100 : '';
    }
}
