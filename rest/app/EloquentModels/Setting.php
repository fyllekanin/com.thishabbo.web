<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\UnixTimeModel;

class Setting extends UnixTimeModel {
    protected $primaryKey = 'settingId';
    protected $fillable = ['key', 'value'];
}
