<?php

namespace App\Repositories\Impl\UserRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int userProfileVisitId
 * @property int userId
 * @property int profileId
 *
 * @method visitorsOfUserId(int $userId)
 * @method whereVisitOnProfileId(int $userId, int $profileId)
 */
class UserProfileVisitDBO extends CreatedUpdatedAt {

    protected $table = 'user_profile_visits';
    protected $primaryKey = 'userProfileVisitId';
    protected $fillable = [
        'userId',
        'profileId'
    ];

    public function scopeVisitorsOfUserId(Builder $builder, int $userId) {
        return $builder->where('profileId', $userId);
    }

    public function scopeWhereVisitOnProfileId(Builder $builder, int $userId, int $profileId) {
        return $builder->where('profileId', $profileId)->where('userId', $userId);
    }
}
