<?php

namespace App\Models\User;

use Exception;

class CustomUserFields {
    public $role;
    public $tabs = [];

    public function __construct($data) {
        try {
            $data = json_decode($data);
            $this->role = $data->role;
            $this->tabs = $data->tabs;
        } catch (Exception $exception) {
            $this->tabs = [];
        }
    }
}
