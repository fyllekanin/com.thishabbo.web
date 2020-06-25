<?php

namespace App\Repositories\Impl\NotificationRepository;

use App\Repositories\Impl\BaseModel;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property int $notificationId
 * @property int $userId
 * @property int $senderId
 * @property int $type
 * @property int $contentId
 * @property int $readAt
 * @property int $createdAt
 *
 * @method whereType(int $type)
 * @method whereContentId(int $contentId)
 */
class NotificationDBO extends BaseModel {

    protected $table = 'notifications';
    protected $primaryKey = 'notificationId';
    protected $fillable = ['userId', 'senderId', 'type', 'contentId', 'readAt', 'createdAt'];

    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;

    public function scopeWhereType(Builder $builder, int $type) {
        return $builder->where('type', $type);
    }

    public function scopeWhereContentId(Builder $builder, int $contentId) {
        return $builder->where('contentId', $contentId);
    }
}
