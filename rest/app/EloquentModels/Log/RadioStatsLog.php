<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\UnixTimeModel;

class RadioStatsLog extends UnixTimeModel {
    protected $table = 'radio_stats_log';
    protected $primaryKey = 'radioStatsLogId';
    protected $fillable = ['userId', 'listeners', 'song'];
}
