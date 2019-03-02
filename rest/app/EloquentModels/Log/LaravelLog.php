<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\UnixTimeModel;

class LaravelLog extends UnixTimeModel {
    protected $table = 'laravel_logs';
    protected $primaryKey = 'laravelLogId';
    protected $fillable = ['message', 'code', 'file', 'line', 'trace'];
}
