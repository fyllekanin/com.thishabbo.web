<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;

class Login extends UnixTimeModel {
    protected $table = 'login';
    protected $fillable = ['userId', 'ip', 'success'];
}
