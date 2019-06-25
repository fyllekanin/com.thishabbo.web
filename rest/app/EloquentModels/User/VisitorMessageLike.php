<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;

/**
 * @property mixed visitorMessageId
 * @property mixed userId
 * @property mixed createdAt
 * @property mixed updatedAt
 */
class VisitorMessageLike extends UnixTimeModel {
    protected $table = 'visitor_message_likes';
    protected $primaryKey = 'visitorMessageLikeId';
    protected $fillable = [
        'visitorMessageId',
        'userId'
    ];
}
