<?php

namespace App\Repositories\Impl\UserRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string nickname
 * @property string username
 * @property string habbo
 * @property bool gdpr
 * @property string password
 * @property int likes
 * @property int displayGroupId
 * @property int posts
 * @property int threads
 * @property int theme
 * @property int lastActivity
 * @property int referralId
 *
 * @method forUserId(int $userId)
 * @method whereNickname(string $nickname)
 * @method whereNicknameSearch(string $nickname)
 */
class UserDBO extends CreatedUpdatedAt {
    protected $table = 'users';
    protected $primaryKey = 'userId';
    protected $fillable = [
        'username', 'nickname', 'habbo', 'gdpr', 'password',
        'likes', 'displayGroupId', 'posts', 'threads', 'theme', 'lastActivity', 'referralId'
    ];
    protected $hidden = ['username', 'password'];

    public function scopeForUserId(Builder $builder, $userId) {
        return $builder->where($this->primaryKey, $userId);
    }

    public function scopeWhereNickname(Builder $builder, $nickname) {
        return $builder->whereRaw('lower(nickname) LIKE ?', [strtolower($nickname)]);
    }

    public function scopeWhereNicknameSearch(Builder $builder, $nickname) {
        return $builder->whereRaw('lower(nickname) LIKE ?', ['%'.strtolower($nickname).'%']);
    }
}
