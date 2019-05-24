<?php

namespace App\EloquentModels\User;

use App\Helpers\PermissionHelper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property mixed nickname
 * @property mixed userId
 * @method static withNickname($love)
 *
 * @SuppressWarnings(PHPMD.ExcessivePublicCount)
 */
class User extends Authenticatable {
    use Notifiable;

    protected $fillable = ['username', 'nickname', 'habbo', 'gdpr', 'password',
        'likes', 'displayGroupId', 'posts', 'threads', 'theme', 'lastActivity', 'referralId'];
    protected $hidden = ['username', 'password'];
    protected $primaryKey = 'userId';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    public function getDateFormat() {
        return 'U';
    }

    public function userdata() {
        return $this->hasOne('App\EloquentModels\User\UserData', 'userId', 'userId');
    }

    public function profile() {
        return $this->hasOne('App\EloquentModels\User\UserProfile', 'userId', 'userId');
    }

    public function threads() {
        return $this->hasMany('App\EloquentModels\Forum\Thread', 'userId');
    }

    public function userGroups() {
        return $this->hasMany('App\EloquentModels\User\UserGroup', 'userId');
    }

    public function posts() {
        return $this->hasMany('App\EloquentModels\Forum\Post', 'userId');
    }

    public function displayGroup() {
        return $this->belongsTo('App\EloquentModels\Group\Group', 'displayGroupId', 'groupId');
    }

    public function subscriptions() {
        return $this->hasMany('App\EloquentModels\Shop\UserSubscription', 'userId', 'userId');
    }

    public function scopeWithNicknameLike(Builder $query, $nickname) {
        return $query->where('nickname', 'LIKE', '%' . $nickname . '%');
    }

    public function scopeWithNickname(Builder $query, $nickname) {
        return $query->whereRaw('lower(nickname) = ?', [strtolower($nickname)]);
    }

    public function scopeWithUsername(Builder $query, $username) {
        return $query->whereRaw('lower(username) = ?', [strtolower($username)]);
    }

    public function scopeWithHabbo(Builder $query, $habbo) {
        return $query->whereRaw('lower(habbo) = ?', [strtolower($habbo)]);
    }

    public static function getImmunity($userId) {
        if (PermissionHelper::isSuperAdmin($userId)) {
            return 101;
        }

        return (int)self::select('users.userId', 'groups.immunity')
            ->where('users.userId', $userId)
            ->leftJoin('user_groups', 'user_groups.userId', '=', 'users.userId')
            ->leftJoin('groups', 'groups.groupId', '=', 'user_groups.groupId')
            ->max('groups.immunity');
    }

    public function getGroupIdsAttribute() {
        $groupIds = $this->userGroups()->getResults()->map(function ($group) {
            return $group->groupId;
        })->toArray();
        array_push($groupIds, 0);
        return $groupIds;
    }

    public function getGroupsAttribute() {
        return $this->userGroups()->getResults()->map(function ($group) {
            return $group->group;
        });
    }

    public function getSubscriptionsAttribute() {
        return $this->subscriptions()->getResults()->map(function ($userSubscription) {
            return $userSubscription->subscription;
        });
    }
}
