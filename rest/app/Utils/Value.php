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

    public static function validateHexColours($colours) {
        $regex = '/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/';
        return Iterables::every($colours, function ($colour) use ($regex) {
            return preg_match($regex, $colour);
        });
    }
}
