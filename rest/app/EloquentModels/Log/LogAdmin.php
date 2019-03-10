<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\LogModel;

class LogAdmin extends LogModel {
    protected $table = 'log_admin';
    protected $primaryKey = 'logId';
    protected $fillable = ['userId', 'ip', 'action', 'data'];
}
