<?php

namespace App\Console\Jobs;

use App\EloquentModels\Staff\Timetable;

class ClearTimetable {

    public function init() {
        $day = date('N');

        switch ($day) {
            case 1:
                $this->clearWeekends();
                break;
            case 6:
                $this->clearWeekDays();
                break;
        }
    }

    private function clearWeekends() {
        Timetable::where('day', '>=', 6)->where('day', '<=', 7)->where('isPerm', '<', 1)->update([
            'isDeleted' => 1,
            'isActive' => 0
        ]);
        Timetable::where('day', '>=', 6)->where('day', '<=', 7)->where('isPerm', '>', 0)->update([
            'isActive' => 1
        ]);
    }

    private function clearWeekDays() {
        Timetable::where('day', '>=', 1)->where('day', '<=', 5)->where('isPerm', '<', 1)->update([
            'isDeleted' => 1,
            'isActive' => 0
        ]);
        Timetable::where('day', '>=', 1)->where('day', '<=', 5)->where('isPerm', '>', 0)->update([
            'isActive' => 1
        ]);
    }
}