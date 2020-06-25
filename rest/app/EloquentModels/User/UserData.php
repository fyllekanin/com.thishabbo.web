<?php

namespace App\EloquentModels\User;

use App\EloquentModels\Models\UnixTimeModel;
use App\Providers\Service\ContentService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

/**
 * @property mixed userdataId
 * @property mixed userId
 * @property mixed signature
 * @property mixed avatarUpdatedAt
 * @property mixed postBit
 * @property mixed credits
 * @property mixed homePage
 * @property mixed discord
 * @property mixed twitter
 * @property mixed badges
 * @property mixed createdAt
 * @property mixed updatedAt
 * @property false|string nameColor
 * @property mixed namePosition
 * @property mixed xp
 * @property false|string activeBadges
 * @property mixed barColor
 * @property mixed customFields
 * @property mixed effectId
 * @property mixed iconId
 * @property array|string|null iconPosition
 */
class UserData extends UnixTimeModel {

    /**
     *
     *
     * @var ContentService
     */
    private $myContentService;

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

    public function __construct(array $attributes = []) {
        parent::__construct($attributes);
        $this->myContentService = App::make(ContentService::class);
    }

    public function user() {
        return $this->belongsTo('App\EloquentModels\User\User', 'userId', 'userId');
    }

    public function scopeUserId(Builder $query, $userId) {
        return $query->where('userId', $userId);
    }

    public function getParsedSignature() {
        return $this->myContentService->getParsedContent($this->signature);
    }
}
