<?php

namespace App\Utils;

class Condition {


    /**
     * @param $condition
     * @param $status
     * @param  string  $message
     */
    public static function precondition($condition, $status, $message = '') {
        if ($condition) {
            abort($status, $message);
        }
    }

    /**
     * @param $value
     * @param  string  $message
     *
     * @return mixed
     */
    public static function requireNotNull($value, $message = '') {
        if (!$value) {
            abort(404, $message);
        }
        return $value;
    }
}
