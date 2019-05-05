<?php

namespace App\Models\Radio;

/**
 * @SuppressWarnings(PHPMD.ShortVariable)
 */
class RadioSettings {
    public $ip = '127.0.0.1';
    public $port = 8080;
    public $password = '';
    public $adminPassword = '';
    public $nickname = '';
    public $likes = 0;
    public $userId = 0;
    public $listeners = 0;
    public $song = '';
    public $albumArt = '';
    public $djSays = '';
    public $nextDj = '';

    public function __construct($data) {
        try {
            $data = json_decode($data);
            $this->ip = $data->ip;
            $this->port = $data->port;
            $this->password = $data->password;
            $this->adminPassword = $data->adminPassword;
            $this->nickname = $data->nickname;
            $this->likes = $data->likes;
            $this->userId = $data->userId;
            $this->listeners = $data->listeners;
            $this->song = $data->song;
            $this->albumArt = $data->albumArt;
            $this->djSays = $data->djSays;
            $this->nextDj = $data->nextDj;
        } catch (\Exception $exception) {

        }
    }

    public function jsonSerialize() {
        return (object)[
            'ip' => $this->ip,
            'port' => $this->port,
            'password' => $this->password,
            'adminPassword' => $this->adminPassword,
            'nickname' => $this->nickname,
            'likes' => $this->likes,
            'userId' => $this->userId,
            'listeners' => $this->listeners,
            'song' => $this->song,
            'albumArt' => $this->albumArt,
            'djSays' => $this->djSays,
            'nextDj' => $this->nextDj
        ];
    }
}