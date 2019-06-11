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
        return Iterables::every($colors, function ($color) use ($regex) {
            return preg_match($regex, $color);
        });
    }

    public static function getFilterValue($request, $value) {
        return self::isExactFilter($request) ? $value : '%' . $value . '%';
    }

    private static function isExactFilter($request) {
        $type = $request->input('type');
        return $type == 'exact';
    }
}
