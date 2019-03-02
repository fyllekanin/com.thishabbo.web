<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\LogModel;

class LogStaff extends LogModel {
    protected $table = 'log_staff';
    protected $primaryKey = 'logId';
    protected $fillable = ['userId', 'ip', 'action', 'data'];
}
