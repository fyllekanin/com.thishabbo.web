<?php

namespace App\EloquentModels\Infraction;

use App\EloquentModels\Models\DeletableModel;

class AutoBan extends DeletableModel {
    protected $table = 'auto_bans';
    protected $primaryKey = 'autoBanId';
    protected $fillable = ['title', 'amount', 'banLength', 'reason'];
}
