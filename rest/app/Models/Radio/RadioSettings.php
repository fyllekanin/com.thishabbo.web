<?php

namespace App\Models\Radio;

use ReflectionClass;

class RadioServerTypes {
    const SHOUT_CAST_V1 = 'shoutCastV1';
    const SHOUT_CAST_V2 = 'shoutCastV2';

    public static function isValidType($type) {
        try {
            foreach (self::getAllConstants() as $serverType) {
                if ($serverType == $type) {
                    return true;
                }
            }
            return false;
        } catch (\ReflectionException $e) {
        }
    }

    /**
     * @return array
     * @throws \ReflectionException
     */
    public static function getAllConstants() {
        return (new ReflectionClass(get_class()))->getConstants();
    }
}

/**
 * @SuppressWarnings(PHPMD.ShortVariable)
 */
class RadioSettings {
    public $ip = '127.0.0.1';
    public $port = 8080;
    public $password = '';
    public $adminPassword = '';
    public $likes = 0;
    public $userId = 0;
    public $listeners = 0;
    public $song = '';
    public $albumArt = '';
    public $djSays = '';
    public $nextDjId = '';
    public $serverType = RadioServerTypes::SHOUT_CAST_V1;

    public function __construct($data) {
        try {
            $data = json_decode($data);
            $this->ip = $data->ip;
            $this->port = $data->port;
            $this->password = $data->password;
            $this->adminPassword = $data->adminPassword;
            $this->likes = $data->likes;
            $this->userId = $data->userId;
            $this->listeners = $data->listeners;
            $this->song = $data->song;
            $this->albumArt = $data->albumArt;
            $this->djSays = $data->djSays;
            $this->serverType = $data->serverType;
        } catch (\Exception $exception) {

        }
    }

    public function jsonSerialize() {
        return (object)[
            'ip' => $this->ip,
            'port' => $this->port,
            'password' => $this->password,
            'adminPassword' => $this->adminPassword,
            'likes' => $this->likes,
            'userId' => $this->userId,
            'listeners' => $this->listeners,
            'song' => $this->song,
            'albumArt' => $this->albumArt,
            'djSays' => $this->djSays,
            'nextDjId' => $this->nextDjId,
            'serverType' => $this->serverType
        ];
    }
}