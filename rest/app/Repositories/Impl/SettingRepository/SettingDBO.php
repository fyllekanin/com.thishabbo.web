<?php

namespace App\Repositories\Impl\SettingRepository;

use App\Repositories\Impl\CreatedUpdatedAt;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $key
 * @property mixed $value
 *
 * @method withKey(string $key)
 */
class SettingDBO extends CreatedUpdatedAt {

    protected $table = 'settings';
    protected $primaryKey = 'settingId';
    protected $fillable = ['key', 'value'];

    public function scopeWithKey(Builder $builder, $key) {
        return $builder->where('key', $key);
    }
}
