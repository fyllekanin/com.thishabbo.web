<?php

namespace App\EloquentModels\Staff;

use App\EloquentModels\Models\UnixTimeModel;

class TimetableData extends UnixTimeModel {

    protected $fillable = ['timetableId', 'name', 'description'];
    protected $table = 'timetable_data';
    protected $primaryKey = 'timetableDataId';
}
