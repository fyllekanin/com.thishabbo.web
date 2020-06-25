<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use Illuminate\Database\Eloquent\Builder;

class Ban extends UnixTimeModel {

    protected $primaryKey = 'banId';
    protected $fillable = ['bannedId', 'userId', 'reason', 'expiresAt', 'lifterId', 'liftReason', 'isLifted'];

    public function scopeIsBanned(Builder $query, $userId) {
        return $query->where('bannedId', $userId)->active();
    }

    public function scopeActive(Builder $query) {
        return $query->where('isLifted', '<', 1)
            ->where(
                function (Builder $qry) {
                    $qry->where('expiresAt', '<', 1)
                        ->orWhere('expiresAt', '>', time());
                }
            );
    }

    public function scopeWithNicknameLike(Builder $query, $nickname) {
        $userIds = User::withNicknameLike($nickname)->pluck('userId');
        return $query->whereIn('bannedId', $userIds);
    }
}
