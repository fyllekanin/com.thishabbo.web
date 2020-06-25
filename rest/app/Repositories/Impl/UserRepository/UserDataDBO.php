<?php

namespace App\Repositories\Impl\UserRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int userdataId
 * @property int userId
 * @property string signature
 * @property int avatarUpdatedAt
 * @property int postBit
 * @property int credits
 * @property string homePage
 * @property string discord
 * @property string twitter
 * @property string badges
 * @property string nameColor
 * @property int namePosition
 * @property int xp
 * @property string activeBadges
 * @property string barColor
 * @property string customFields
 * @property int effectId
 * @property int iconId
 * @property string iconPosition
 *
 * @method forUserId(int $userId)
 */
class UserDataDBO extends CreatedUpdatedAt {

    protected $table = 'userdata';
    protected $primaryKey = 'userdataId';
    protected $fillable = [
        'userId',
        'signature',
        'avatarUpdatedAt',
        'postBit',
        'credits',
        'homePage',
        'discord',
        'twitter',
        'badges',
        'nameColor',
        'barColor',
        'namePosition',
        'iconId',
        'iconPosition',
        'xp',
        'effectId',
        'customFields'
    ];

    public function scopeForUserId(Builder $builder, int $userId) {
        return $builder->where('userId', $userId);
    }
}
