<?php

namespace App\EloquentModels\User;

use Illuminate\Database\Eloquent\Model;

class Token extends Model {
    public $timestamps = false;
    protected $fillable = ['userId', 'ip', 'accessToken', 'refreshToken', 'expiresAt'];

    public function user() {
        return $this->hasOne('App\EloquentModels\User\User', 'userId', 'userId');
    }
}
