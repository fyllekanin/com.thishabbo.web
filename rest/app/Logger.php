<?php

namespace App;

use App\Constants\LogType;
use App\EloquentModels\Log\LogMod;
use App\EloquentModels\Log\LogSitecp;
use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\User\Login;

class Logger {

    /**
     * Creates a log in the table "login"
     *
     * @param $userId
     * @param $ipAddress
     * @param $success
     */
    public static function login($userId, $ipAddress, $success) {
        $login = new Login();
        $login->userId = $userId;
        $login->ip = $ipAddress;
        $login->success = $success;

        $login->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param  array  $action
     * @param $contentId
     * @param  array  $data
     */
    public static function sitecp($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogSitecp();
        $log->userId = $userId;
        $log->ip = $ipAddress;
        $log->action = LogType::getAction($action);
        $log->contentId = $contentId;
        $log->data = json_encode($data);

        $log->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param  array  $action
     * @param $contentId
     * @param  array  $data
     */
    public static function staff($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogStaff();
        $log->userId = $userId;
        $log->ip = $ipAddress;
        $log->action = LogType::getAction($action);
        $log->contentId = $contentId;
        $log->data = json_encode($data);

        $log->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param  array  $action
     * @param $contentId
     * @param  array  $data
     */
    public static function mod($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogMod();
        $log->userId = $userId;
        $log->ip = $ipAddress;
        $log->action = LogType::getAction($action);
        $log->contentId = $contentId;
        $log->data = json_encode($data);

        $log->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param  array  $action
     * @param  int  $contentId
     * @param  array  $data
     */
    public static function user($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogUser();
        $log->userId = $userId;
        $log->ip = $ipAddress;
        $log->action = LogType::getAction($action);
        $log->contentId = $contentId;
        $log->data = json_encode($data);

        $log->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param  array  $action
     * @param  int  $contentId
     * @param  array  $items
     */
    public static function modMultiple($userId, $ipAddress, Array $action, Array $items = [], $contentId = 0) {
        foreach ($items as $data) {
            self::mod($userId, $ipAddress, $action, $data, $contentId);
        }
    }

    private static function checkData($data) {
        foreach ($data as $key => $value) {
            if (is_array($data)) {
                if (gettype($data[$key]) === 'object' || gettype($data[$key]) === 'array') {
                    $data[$key] = self::checkData($data[$key]);
                } else {
                    $data[$key] = is_numeric($value) ? intval($value) : $value;
                }
            } else {
                if (gettype($data->$key) === 'object' || gettype($data->$key) === 'array') {
                    $data->$key = self::checkData($data->$key);
                } else {
                    $data->$key = is_numeric($value) ? intval($value) : $value;
                }
            }
        }
        return $data;
    }
}
