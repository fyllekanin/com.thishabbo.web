<?php

namespace App\Utils;

class Value {


    public static function objectProperty($object, $property, $orElse) {
        return isset($object->$property) ? $object->$property : $orElse;
    }

    public static function objectJsonProperty($object, $property, $orElse) {
        return isset($object->$property) ? json_decode($object->$property) : $orElse;
    }

    public static function arrayProperty($object, $property, $orElse) {
        return isset($object[$property]) ? $object[$property] : $orElse;
    }

    public static function validateHexColors($colors) {
        $regex = '/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/';
        return Iterables::every(
            $colors,
            function ($color) use ($regex) {
                return preg_match($regex, $color);
            }
        );
    }

    public static function getFilterValue($request, $value) {
        if (self::isExactFilter($request)) {
            return $value;
        } elseif (self::isFromStartFilter($request)) {
            return $value.'%';
        }
        return '%'.$value.'%';
    }

    private static function isExactFilter($request) {
        $type = $request->input('searchType');
        return $type == 'exact';
    }

    private static function isFromStartFilter($request) {
        $type = $request->input('searchType');
        return $type == 'fromStart';
    }
}
