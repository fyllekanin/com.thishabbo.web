<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;

/**
 * @property mixed title
 * @property mixed noticeId
 */
class Notice extends DeletableModel {
    protected $table = 'notices';
    protected $primaryKey = 'noticeId';
    protected $fillable = ['title', 'text', 'backgroundColor', 'order', 'userId'];
}
