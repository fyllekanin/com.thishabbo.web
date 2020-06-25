<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;

/**
 * Class Login
 *
 * @package App\EloquentModels\User
 *
 * @property mixed userId
 * @property mixed ip
 * @property mixed success
 */
class Login extends UnixTimeModel {

    protected $table = 'login';
    protected $fillable = ['userId', 'ip', 'success'];
}
