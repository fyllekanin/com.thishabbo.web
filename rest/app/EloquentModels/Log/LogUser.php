<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\LogModel;

class LogUser extends LogModel {
    protected $table = 'log_user';
    protected $primaryKey = 'logId';
    protected $fillable = ['userId', 'ip', 'action', 'data'];
}
