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
}
