<?php

namespace App\Repositories\Impl\AvatarRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int avatarId
 * @property int userId
 * @property int width
 * @property int height
 *
 * @method int withId
 * @method int forUserId (int $userId)
 */
class AvatarDBO extends CreatedUpdatedAt {

    protected $table = 'avatars';
    protected $primaryKey = 'avatarId';
    protected $fillable = ['userId', 'width', 'height'];

    /**
     * @param  Builder  $builder
     * @param  int  $avatarId
     *
     * @return Builder
     */
    public function scopeWithId(Builder $builder, int $avatarId) {
        return $builder->where($this->primaryKey, $avatarId);
    }

    /**
     * @param  Builder  $builder
     * @param  int  $userId
     *
     * @return Builder
     */
    public function scopeForUserId(Builder $builder, int $userId) {
        return $builder->where('userId', $userId);
    }
}
