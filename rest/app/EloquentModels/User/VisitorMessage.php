<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\DeletableModel;

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
}
