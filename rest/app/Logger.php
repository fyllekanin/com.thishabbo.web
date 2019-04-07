<?php

namespace App;

use App\EloquentModels\Log\LogAdmin;
use App\EloquentModels\Log\LogMod;
use App\EloquentModels\Log\LogStaff;
use App\EloquentModels\Log\LogUser;
use App\EloquentModels\User\Login;
use App\Models\Logger\Action;
use App\Utils\Condition;

class Logger {
    /**
     * Creates a log in the table "login"
     *
     * @param $userId
     * @param $ipAddress
     * @param $success
     */
    public static function login ($userId, $ipAddress, $success) {
        $login = new Login([
            'userId' => $userId,
            'ip' => $ipAddress,
            'success' => $success
        ]);
        $login->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param array $action
     * @param $contentId
     * @param array $data
     */
    public static function admin ($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogAdmin([
            'userId' => $userId,
            'ip' => $ipAddress,
            'action' => Action::getAction($action),
            'contentId' => $contentId,
            'data' => json_encode($data)
        ]);
        $log->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param array $action
     * @param $contentId
     * @param array $data
     */
    public static function staff ($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogStaff([
            'userId' => $userId,
            'ip' => $ipAddress,
            'action' => Action::getAction($action),
            'contentId' => $contentId,
            'data' => json_encode($data)
        ]);
        $log->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param array $action
     * @param $contentId
     * @param array $data
     */
    public static function mod ($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogMod([
            'userId' => $userId,
            'ip' => $ipAddress,
            'action' => Action::getAction($action),
            'contentId' => $contentId,
            'data' => json_encode($data)
        ]);
        $log->save();
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param array $action
     * @param int $contentId
     * @param array $items
     */
    public static function modMultiple ($userId, $ipAddress, Array $action, Array $items = [], $contentId = 0){
        foreach($items as $data) {
            self::mod($userId, $ipAddress, $action, $contentId, $data);
        }
    }

    /**
     * @param $userId
     * @param $ipAddress
     * @param array $action
     * @param int $contentId
     * @param array $data
     */
    public static function user ($userId, $ipAddress, Array $action, Array $data = [], $contentId = 0) {
        $data = self::checkData($data);
        $log = new LogUser([
            'userId' => $userId,
            'ip' => $ipAddress,
            'action' => Action::getAction($action),
            'contentId' => $contentId,
            'data' => json_encode($data)
        ]);
        $log->save();
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
