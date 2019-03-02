<?php

namespace App\EloquentModels\User;

use App\Helpers\PermissionHelper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable {
    use Notifiable;

    protected $fillable = ['username', 'nickname', 'email', 'gdpr', 'password', 'likes', 'displayGroupId', 'posts', 'threads', 'lastActivity', 'referralId'];
    protected $hidden = ['username', 'password'];
    protected $primaryKey = 'userId';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    public function getDateFormat () {
        return 'U';
    }

    public function userdata () {
        return $this->hasOne('App\EloquentModels\User\UserData', 'userId', 'userId');
    }

    public function threads () {
        return $this->hasMany('App\EloquentModels\Forum\Thread', 'userId');
    }

    public function userGroups () {
        return $this->hasMany('App\EloquentModels\User\UserGroup', 'userId');
    }

    public function posts () {
        return $this->hasMany('App\EloquentModels\Forum\Post', 'userId');
    }

    public function displayGroup () {
        return $this->belongsTo('App\EloquentModels\Group', 'displayGroupId', 'groupId');
    }

    public function scopeWithNicknameLike (Builder $query, $nickname) {
        return $query->where('nickname', 'LIKE', '%' . $nickname . '%');
    }

    public function scopeWithNickname (Builder $query, $nickname) {
        return $query->whereRaw('lower(nickname) = ?', [strtolower($nickname)]);
    }

    public function scopeWithUsername (Builder $query, $username) {
        return $query->whereRaw('lower(username) = ?', [strtolower($username)]);
    }

    public function scopeWithEmail (Builder $query, $email) {
        return $query->whereRaw('lower(email) = ?', [strtolower($email)]);
    }

    public static function getImmunity ($userId) {
        if (PermissionHelper::isSuperAdmin($userId)) {
            return 101;
        }

        return (int) self::select('users.userId', 'groups.immunity')
            ->where('users.userId', $userId)
            ->leftJoin('user_groups', 'user_groups.userId', '=', 'users.userId')
            ->leftJoin('groups', 'groups.groupId', '=', 'user_groups.groupId')
            ->max('groups.immunity');
    }

    public function getGroupIdsAttribute () {
        $groupIds = $this->userGroups()->getResults()->map(function ($group) {
            return $group->groupId;
        })->toArray();
        array_push($groupIds, 0);
        return $groupIds;
    }

    public function getGroupsAttribute () {
        return $this->userGroups()->getResults();
    }
}
