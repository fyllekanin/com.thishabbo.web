<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use App\Helpers\PermissionHelper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class Ban extends UnixTimeModel {
    protected $primaryKey = 'banId';
    protected $fillable = ['bannedId', 'userId', 'reason', 'expiresAt', 'lifterId', 'liftReason', 'isLifted'];

    public function scopeIsBanned(Builder $query, $userId) {
        return $query->where('bannedId', $userId)->active();
    }

    public function scopeActive(Builder $query) {
        return $query->where('isLifted', '<', 1)
            ->where(function (Builder $qry) {
                $qry->where('expiresAt', '<', 1)
                    ->orWhere('expiresAt', '>', time());
            });
    }

    public function scopeWithNicknameLike(Builder $query, $nickname) {
        $userIds = User::withNicknameLike($nickname)->pluck('userId');
        return $query->whereIn('bannedId', $userIds);
    }

    public function scopeWithImmunityLessThan(Builder $query, $immunity) {
        return $query->leftJoin(DB::raw(
            "(SELECT users.userId, MAX(groups.immunity) AS highest_immunity
                         FROM users
                         LEFT JOIN user_groups
                         ON users.userId = user_groups.userId
                         INNER JOIN groups
                         ON groups.groupId = user_groups.groupId
                         GROUP BY users.userId)
                        as sub"), 'bans.bannedId', '=', 'sub.userId')
            ->where('highest_immunity', '<', $immunity)
            ->whereNotIn('bannedId', PermissionHelper::getSuperAdmins());
    }
}
