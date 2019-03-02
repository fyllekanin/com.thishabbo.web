<?php

namespace App\EloquentModels;

use App\EloquentModels\Models\DeletableModel;
use App\Helpers\UserHelper;
use Illuminate\Database\Eloquent\Builder;

class Timetable extends DeletableModel {

    protected $table = 'timetable';
    protected $primaryKey = 'timetableId';
    protected $fillable = ['userId', 'day', 'hour', 'isPerm', 'type', 'eventId', 'isActive'];
    protected $hidden = ['userId', 'eventId', 'permShow'];
    protected $appends = ['user', 'event'];

    public function event () {
        return $this->hasMany('App\EloquentModels\Event', 'eventId', 'eventId');
    }

    public function getUserAttribute () {
        return UserHelper::getUser($this->userId);
    }

    public function getEventAttribute () {
        return Event::find($this->eventId);
    }

    public function timetableData () {
        return $this->hasOne('App\EloquentModels\TimetableData', 'timetableId');
    }

    public function getPermShowAttribute () {
        return isset($this->timetableData) ? [
            'timetableId' => $this->timetableId,
            'day' => $this->day,
            'hour' => $this->hour,
            'name' => $this->timetableData->name,
            'nickname' => $this->user->nickname,
            'description' => $this->timetableData->description,
            'createdAt' => $this->timetableData->createdAt->timestamp
        ] : [];

    }

    public function scopeIsActive ($query) {
        return $query->where('isActive', true);
    }

    public function scopeRadio (Builder $query) {
        return $query->where('type', false);
    }

    public function scopeIsPerm (Builder $query) {
        return $query->where('isPerm', true);
    }

    public function scopeEvents (Builder $query) {
        return $query->where('type', true);
    }

}
