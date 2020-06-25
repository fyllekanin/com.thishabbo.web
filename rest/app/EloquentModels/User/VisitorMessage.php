<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed visitorMessageId
 * @property mixed hostId
 * @property mixed userId
 * @property mixed content
 * @property mixed replies
 * @property mixed parentId
 * @property mixed likes
 * @property mixed createdAt
 */
class VisitorMessage extends DeletableModel {

    protected $table = 'visitor_messages';
    protected $primaryKey = 'visitorMessageId';
    protected $fillable = [
        'hostId',
        'userId',
        'content',
        'likes',
        'parentId',
        'isDeleted'
    ];

    public function host() {
        return $this->hasOne('App\EloquentModels\User\User', 'userId', 'hostId');
    }

    public function user() {
        return $this->hasOne('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function replies() {
        return $this->hasMany('App\EloquentModels\User\VisitorMessage', 'parentId', 'visitorMessageId');
    }

    public function isComment() {
        return $this->parentId > 0;
    }

    public function scopeWithParent(Builder $query, $parentId) {
        return $query->where('parentId', $parentId);
    }

    public function scopeIsSubject(Builder $query) {
        return $query->where('parentId', '<', 1);
    }
}
