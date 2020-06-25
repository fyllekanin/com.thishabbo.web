<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\UnixTimeModel;

/**
 * Class RadioStatsLog
 *
 * @package App\EloquentModels\Log
 *
 * @property mixed radioStatsLogId
 * @property mixed userId
 * @property mixed listeners
 * @property mixed song
 */
class RadioStatsLog extends UnixTimeModel {

    protected $table = 'radio_stats_log';
    protected $primaryKey = 'radioStatsLogId';
    protected $fillable = ['userId', 'listeners', 'song'];
}
