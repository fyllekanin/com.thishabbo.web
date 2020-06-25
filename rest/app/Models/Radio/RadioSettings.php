<?php

namespace App\Models\Radio;

use App\Constants\RadioServerTypes;
use App\Utils\Value;
use Exception;

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
    public $radioUrl = '';
    public $mountPoint = '';
    public $connectionPort = 8005;
    public $serverType = RadioServerTypes::SHOUT_CAST_V1;
    public $isAzuracast = false;
    public $azuracastApiKey = '';
    public $azuracastStationId = 0;

    public function __construct($data) {
        try {
            $data = json_decode($data);
        } catch (Exception $exception) {
            $data = (object) [];
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
        $this->mountPoint = Value::objectProperty($data, 'mountPoint', '');
        $this->connectionPort = Value::objectProperty($data, 'connectionPort', '');
        $this->serverType = Value::objectProperty($data, 'serverType', '');
        $this->azuracastApiKey = Value::objectProperty($data, 'azuracastApiKey', '');
        $this->azuracastStationId = Value::objectProperty($data, 'azuracastStationId', '');
        $this->isAzuracast = Value::objectProperty($data, 'isAzuracast', false);

        if ($this->serverType == RadioServerTypes::ICE_CAST_V2) {
            $this->radioUrl = $this->isAzuracast ? $this->ip.'/radio/'.$this->port.'/live' : $this->ip.':'.$this->port.'/live';
        } else {
            $this->radioUrl = $this->ip.':'.$this->port.'/;stream.nsv';
        }
    }
}
