<?php

namespace App\EloquentModels\Forum;

use App\EloquentModels\Models\UnixTimeModel;

class CategorySubscription extends UnixTimeModel {
    protected $table = 'category_subscriptions';
    protected $fillable = ['userId', 'categoryId'];

    public function category () {
        return $this->belongsTo('App\EloquentModels\Forum\Category', 'categoryId', 'categoryId');
    }
}
