<?php

namespace App\EloquentModels\Staff;

use App\EloquentModels\Models\DeletableModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed requestId
 */
class RadioRequest extends DeletableModel {
    protected $table = 'requests';
    protected $primaryKey = 'requestId';
    protected $fillable = ['userId', 'nickname', 'content', 'ip'];

    public function scopeTwoHours(Builder $query) {
        return $query->where('createdAt', '>', (time() - 7200));
    }
}
