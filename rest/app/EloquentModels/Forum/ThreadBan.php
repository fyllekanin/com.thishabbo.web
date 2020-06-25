<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\DeletableModel;

/**
 * @property mixed threadBanId
 * @property mixed userId
 * @property mixed bannedById
 * @property mixed createdAt
 */
class ThreadBan extends DeletableModel {

    protected $table = 'thread_bans';
    protected $primaryKey = 'threadBanId';
    protected $fillable = ['userId', 'bannedById', 'threadId'];
}
