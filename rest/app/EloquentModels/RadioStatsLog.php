<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\UnixTimeModel;

class RadioStatsLog extends UnixTimeModel {
    protected $table = 'radio_stats_logs';
    protected $primaryKey = 'logId';
    protected $fillable = ['listeners', 'song', 'genre'];
}
