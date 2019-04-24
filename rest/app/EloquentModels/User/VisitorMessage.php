<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed visitorMessageId
 */
class VisitorMessage extends DeletableModel {
    protected $table = 'visitor_messages';
    protected $primaryKey = 'visitorMessageId';
    protected $fillable = [
        'hostId',
        'userId',
        'content',
        'parentId',
        'isDeleted'
    ];

    public function replies() {
        return $this->hasMany('App\EloquentModels\User\VisitorMessage', 'parentId');
    }

    public function scopeIsSubject(Builder $query) {
        return $query->where('parentId', 0);
    }
}
