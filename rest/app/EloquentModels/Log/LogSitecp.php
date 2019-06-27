<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\LogModel;

class LogSitecp extends LogModel {
    protected $table = 'log_sitecp';
    protected $primaryKey = 'logId';
    protected $fillable = ['userId', 'ip', 'action', 'contentId', 'data'];
}
