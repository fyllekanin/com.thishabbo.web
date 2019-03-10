<?php

namespace App\Utils;

class Condition {

    public static function precondition($condition, $status, $message = '') {
        if ($condition) {
            abort($status, $message);
        }
    }
}
