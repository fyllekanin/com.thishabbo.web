<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;

/**
 * Class RequestThc
 *
 * @package App\EloquentModels
 *
 * @property mixed requestThcId
 */
class RequestThc extends DeletableModel {

    protected $table = 'request_thc';
    protected $primaryKey = 'requestThcId';
    protected $fillable = ['requesterId', 'receiverId', 'amount', 'reason'];

    public function receiver() {
        return $this->belongsTo('App\EloquentModels\User\User', 'receiverId');
    }
}
