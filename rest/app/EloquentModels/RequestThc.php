<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;

class RequestThc extends DeletableModel {
    protected $table = 'request_thc';
    protected $primaryKey = 'requestThcId';
    protected $fillable = ['requesterId', 'receiverId', 'amount', 'reason'];

    public function receiver() {
        return $this->belongsTo('App\EloquentModels\User\User', 'receiverId');
    }
}
