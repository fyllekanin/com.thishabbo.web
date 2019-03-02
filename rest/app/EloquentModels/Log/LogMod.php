<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\LogModel;

class LogMod extends LogModel {
    protected $table = 'log_mod';
    protected $primaryKey = 'logId';
    protected $fillable = ['userId', 'ip', 'action', 'data'];
}
