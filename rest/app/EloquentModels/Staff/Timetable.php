<?php

namespace App\EloquentModels\Staff;

use App\EloquentModels\Models\DeletableModel;
use App\Helpers\UserHelper;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property mixed timetableId
 */
class Timetable extends DeletableModel {

    protected $table = 'timetable';
    protected $primaryKey = 'timetableId';
    protected $fillable = ['userId', 'day', 'hour', 'isPerm', 'type', 'eventId', 'isActive', 'link'];
    protected $hidden = ['userId', 'eventId', 'permShow'];
    protected $appends = ['user', 'event', 'name', 'timestamp'];

    public function event() {
        return $this->hasMany('App\EloquentModels\Staff\Event', 'eventId', 'eventId');
    }

    public function user() {
        return $this->hasOne('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function getUserAttribute() {
        return UserHelper::getUser($this->userId);
    }

    public function getEventAttribute() {
        return Event::find($this->eventId);
    }

    public function getNameAttribute() {
        $data = $this->timetableData()->first();
        return $data ? $data->name : null;
    }

    public function getTimestampAttribute() {
        $year = date('Y');
        $week = date('W');
        return strtotime((new \DateTime())->setISODate($year, $week, $this->day)->format('Y-m-d')) + 3600 * $this->hour;
    }

    public function timetableData() {
        return $this->hasOne('App\EloquentModels\Staff\TimetableData', 'timetableId');
    }

    public function getPermShowAttribute() {
        return isset($this->timetableData) ? [
            'timetableId' => $this->timetableId,
            'day' => $this->day,
            'hour' => $this->hour,
            'name' => $this->timetableData->name,
            'nickname' => $this->user->nickname,
            'type' => $this->type,
            'link' => $this->link,
            'description' => $this->timetableData->description,
            'createdAt' => $this->timetableData->createdAt->timestamp
        ] : [];

    }

    public function scopeIsActive($query) {
        return $query->where('isActive', '>', 0);
    }

    public function scopeRadio(Builder $query) {
        return $query->where('type', '<', 1);
    }

    public function scopeIsPerm(Builder $query) {
        return $query->where('isPerm', '>', 0);
    }

    public function scopeEvents(Builder $query) {
        return $query->where('type', '>', 0);
    }

}
