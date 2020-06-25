<?php

namespace App\EloquentModels\Log;

use App\EloquentModels\Models\LogModel;

/**
 * Class LogMod
 *
 * @package App\EloquentModels\Log
 *
 * @property mixed logId
 * @property mixed userId
 * @property mixed ip
 * @property mixed action
 * @property mixed contentId
 * @property mixed data
 */
class LogMod extends LogModel {

    protected $table = 'log_mod';
    protected $primaryKey = 'logId';
    protected $fillable = ['userId', 'ip', 'action', 'contentId', 'data'];
}
