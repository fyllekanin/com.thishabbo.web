<?php

namespace App\Models\User;

/**
 * @SuppressWarnings(PHPMD.ShortVariable)
 */
class CustomUserFields {
    public $role;
    public $tabs = [];

    public function __construct($data) {
        try {
            $data = json_decode($data);
            $this->role = $data->role;
            $this->tabs = $data->tabs;
        } catch (\Exception $exception) {
            $this->tabs = [];
        }
    }

    public function jsonSerialize() {
        return (object)[
            'role' => $this->role,
            'tabs' => $this->tabs
        ];
    }
}