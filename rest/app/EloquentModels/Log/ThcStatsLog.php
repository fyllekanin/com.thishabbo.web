<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\UnixTimeModel;

/**
 * Class ThcStatsLog
 *
 * @package App\EloquentModels\Log
 *
 * @property mixed thcStatsLogId
 * @property mixed credits
 */
class ThcStatsLog extends UnixTimeModel {

    protected $table = 'thc_stats_log';
    protected $primaryKey = 'thcStatsLogId';
    protected $fillable = ['credits'];
}
