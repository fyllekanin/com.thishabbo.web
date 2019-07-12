<?php

namespace App\Utils;

class Iterables {

    public static function unique ($list, $property) {
        $arr = [];
        $keys = [];
        $index = 0;

        foreach($list as $val) {
            if (!in_array($val->$property, $keys)) {
                $keys[$index] = $val->$property;
                $arr[$index] = $val;
                $index++;
            }
        }
        return $arr;
    }

    public static function find ($list, $callback) {
        foreach ($list as $item) {
            if (call_user_func($callback, $item)) {
                return $item;
            }
        }
        return null;
    }

    public static function filter ($list, $callback) {
        return array_values(array_filter($list, $callback));
    }

    public static function sortByPropertyAsc ($list, $property) {

        if (count($list) < 1) {
            return $list;
        }

        $arr = function ($aItem, $bItem) use ($property) {
            if ($aItem[$property] > $bItem[$property]) {
                return 1;
            } else if ($bItem[$property] > $aItem[$property]) {
                return -1;
            }
            return 0;
        };

        $obj = function ($aItem, $bItem) use ($property) {
            if ($aItem->$property > $bItem->$property) {
                return 1;
            } else if ($bItem->$property > $aItem->$property) {
                return -1;
            }
            return 0;
        };

        $isObj = gettype($list[0]) === 'object';
        usort($list, $isObj ? $obj : $arr);

        return $list;
    }

    public static function sortByPropertyDesc ($list, $property) {

        if (count($list) < 1) {
            return $list;
        }

        $arr = function ($aItem, $bItem) use ($property) {
            if ($aItem[$property] > $bItem[$property]) {
                return -1;
            } else if ($bItem[$property] > $aItem[$property]) {
                return 1;
            }
            return 0;
        };

        $obj = function ($aItem, $bItem) use ($property) {
            if ($aItem->$property > $bItem->$property) {
                return -1;
            } else if ($bItem->$property > $aItem->$property) {
                return 1;
            }
            return 0;
        };

        $isObj = gettype($list[0]) === 'object';
        usort($list, $isObj ? $obj : $arr);

        return $list;
    }

    public static function every($list, $callback) {
        foreach ($list as $item) {
            if (!call_user_func($callback, $item)) {
                 return false;
            }
        }
        return true;
    }
}
