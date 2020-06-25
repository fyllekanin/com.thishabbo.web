<?php

namespace App\Providers\Impl;

use App\Constants\RadioServerTypes;
use App\Constants\SettingsKeys;
use App\Models\Radio\RadioSettings;
use App\Providers\Service\RadioService;
use App\Repositories\Repository\SettingRepository;
use App\Utils\CurlBuilder;
use App\Utils\Iterables;
use Illuminate\Support\Facades\Cache;

class RadioServiceImpl implements RadioService {
    private $mySettingRepository;
    private $myIcecastListenerRegex = '/\<td\>([0-9]+.[0-9]+.[0-9]+.[0-9]+)\<\/td\>\<td\>([0-9]+)\<\/td\>/im';

    public function __construct(SettingRepository $settingRepository) {
        $this->mySettingRepository = $settingRepository;
    }

    public function getRadioSettings() {
        if (Cache::has('radio')) {
            return Cache::get('radio');
        }
        $settings = new RadioSettings($this->mySettingRepository->getValueOfSetting(SettingsKeys::RADIO));
        Cache::put('radio', $settings, 10);
        return $settings;
    }

    public function updateRadioSettings(RadioSettings $settings) {
        $this->mySettingRepository->createOrUpdate(SettingsKeys::RADIO, json_encode($settings));
        Cache::put('radio', $settings, 10);
    }

    public function getRadioConnection($withAdmin) {
        $settings = $this->getRadioSettings();
        if (!$withAdmin) {
            $settings->adminPassword = null;
            $settings->azuracastApiKey = null;
            $settings->azuracastStationId = null;
        }
        return $settings;
    }

    public function getCurrentListeners() {
        $settings = $this->getRadioSettings();

        switch ($settings->serverType) {
            case RadioServerTypes::SHOUT_CAST_V2:
                return $this->getShoutCastV2Listeners($settings);
            case RadioServerTypes::SHOUT_CAST_V1:
                return $this->getShoutCastV1Listeners($this->getShoutCastV1Stats());
            case RadioServerTypes::ICE_CAST_V2:
                return $this->getIceCastV2Listeners($settings);
            default:
                return [];
        }
    }

    public function getShoutCastV1Stats() {
        $settings = $this->getRadioSettings();
        $data = CurlBuilder::newBuilder("{$settings->ip}:{$settings->port}/admin.cgi?mode=viewxml")
            ->withBasicAuth(CurlBuilder::BASIC_AUTH_ADMIN, $settings->adminPassword)
            ->exec();

        return simplexml_load_string(utf8_encode($data));
    }

    public function getShoutCastV2Stats() {
        $settings = $this->getRadioSettings();
        $data = CurlBuilder::newBuilder("{$settings->ip}:{$settings->port}/stats?sid=1&json=1")
            ->withBasicAuth(CurlBuilder::BASIC_AUTH_ADMIN, $settings->adminPassword)
            ->exec();

        return json_decode($data);
    }

    public function getIceCastV2Stats() {
        $settings = $this->getRadioSettings();
        $data = CurlBuilder::newBuilder("{$settings->ip}:{$settings->port}/admin/status.xsl")
            ->withBasicAuth(CurlBuilder::BASIC_AUTH_ADMIN, $settings->adminPassword)
            ->exec();

        $xml = $data ? new \SimpleXMLElement($data) : null;
        return $xml && isset($xml->icestats) && isset($xml->icestats->source) ? (object) [
            'servergenre' => (string ) $xml->icestats->source->genre,
            'currentlisteners' => count($this->getIceCastV2Listeners($settings)),
            'songtitle' => isset($json->icestats->source->title) ? (string) $xml->icestats->source->title : 'unknown'
        ] : null;
    }

    public function startAzuracastAutoDj() {
        $settings = $this->getRadioSettings();
        if (!$this->isAzuracastStationIdAndApiKeySet($settings)) {
            return;
        }

        CurlBuilder::newBuilder("{$settings->ip}/api/station/{$settings->azuracastStationId}/backend/start")
            ->withAzuracastApiKey($settings->azuracastApiKey)
            ->asPostMethod()
            ->exec();
    }

    public function stopAzuracastAutoDj() {
        $settings = $this->getRadioSettings();
        if (!$this->isAzuracastStationIdAndApiKeySet($settings)) {
            return;
        }

        CurlBuilder::newBuilder("{$settings->ip}/api/station/{$settings->azuracastStationId}/backend/stop")
            ->withAzuracastApiKey($settings->azuracastApiKey)
            ->asPostMethod()
            ->exec();
    }

    public function kickCurrentDj() {
        $settings = $this->getRadioSettings();
        $icecastV2 = $settings->ip.':'.$settings->port.'/admin/killsource.xsl?mount=/live';
        $shoutcast = $settings->ip.':'.$settings->port.'/admin.cgi?mode=kicksrc';
        $url = $settings->serverType == RadioServerTypes::ICE_CAST_V2 ? $icecastV2 : $shoutcast;
        CurlBuilder::newBuilder($url)
            ->withBasicAuth(CurlBuilder::BASIC_AUTH_ADMIN, $settings->adminPassword)
            ->exec();

        return $settings->userId;
    }

    private function isAzuracastStationIdAndApiKeySet(RadioSettings $settings) {
        return $settings->azuracastStationId && $settings->azuracastApiKey;
    }

    private function getIceCastV2Listeners(RadioSettings $settings) {
        $data = CurlBuilder::newBuilder("{$settings->ip}:{$settings->port}/admin/listclients.xsl?mount=/live")
            ->withBasicAuth(CurlBuilder::BASIC_AUTH_ADMIN, $settings->adminPassword)
            ->exec();

        $data = str_replace("\n", '', $data);
        $data = str_replace(' align="center"', '', $data);
        preg_match_all($this->myIcecastListenerRegex, $data, $matches);

        if (!$matches || count($matches) == 0 || count($matches[0]) == 0) {
            return [];
        }

        $list = array_map(
            function ($item) {
                $parts = explode('</td><td>', $item);
                return (object) [
                    'hostname' => str_replace('<td>', '', $parts[0]),
                    'connecttime' => str_replace('</td>', '', $parts[1])
                ];
            },
            $matches[0]
        );

        return Iterables::unique($list, 'hostname');
    }

    private function getShoutCastV2Listeners(RadioSettings $settings) {
        $data = CurlBuilder::newBuilder("{$settings->ip}:{$settings->port}/sitecp.cgi?sid=1&mode=view&page=3")
            ->withBasicAuth(CurlBuilder::BASIC_AUTH_ADMIN, $settings->adminPassword)
            ->exec();

        $listeners = json_decode($data);
        return $listeners ? $listeners : [];
    }

    private function getShoutCastV1Listeners($stats) {
        if ($stats == null || $stats == false) {
            return [];
        }

        $listeners = [];
        foreach ((object) $stats->LISTENERS->LISTENER as $listener) {
            $listeners[] = (object) [
                'hostname' => (string) $listener->HOSTNAME,
                'connecttime' => (string) $listener->CONNECTTIME
            ];
        }
        return $listeners;
    }
}
