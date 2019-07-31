<?php

namespace App\Models\Radio;

use App\Utils\Value;
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
            return false;
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
        } catch (\Exception $exception) {
            $data = (object)[];
        }

        $this->ip = Value::objectProperty($data, 'ip', '');
        $this->port = Value::objectProperty($data, 'port', '');
        $this->password = Value::objectProperty($data, 'password', '');
        $this->adminPassword = Value::objectProperty($data, 'adminPassword', '');
        $this->likes = Value::objectProperty($data, 'likes', '');
        $this->userId = Value::objectProperty($data, 'userId', '');
        $this->nextDjId = Value::objectProperty($data, 'nextDjId', '');
        $this->listeners = Value::objectProperty($data, 'listeners', '');
        $this->song = Value::objectProperty($data, 'song', '');
        $this->albumArt = Value::objectProperty($data, 'albumArt', '');
        $this->djSays = Value::objectProperty($data, 'djSays', '');
        $this->serverType = Value::objectProperty($data, 'serverType', '');
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