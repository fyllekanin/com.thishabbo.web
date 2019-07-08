<?php

namespace App\Models\User;

/**
 * @SuppressWarnings(PHPMD.ShortVariable)
 */
class CustomUserFields {
    public $role;

    public function __construct($data) {
        try {
            $data = json_decode($data);
            $this->role = $data->role;
        } catch (\Exception $exception) {

        }
    }

    public function jsonSerialize() {
        return (object)[
            'role' => $this->role
        ];
    }
}