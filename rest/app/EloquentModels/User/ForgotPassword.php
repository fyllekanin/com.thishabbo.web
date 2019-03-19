<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;

class ForgotPassword extends UnixTimeModel {
    protected $table = 'forgot_password';
    protected $fillable = ['userId', 'code'];
}
