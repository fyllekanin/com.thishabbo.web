<?php

namespace App\Repositories\Impl\ShopRepository;

use App\Repositories\Impl\SoftDelete;

/**
 * @property int $lootBoxId
 * @property string $title
 * @property string $items
 * @property int $boxId
 * @property int $credits
 *
 * @method withKey(string $key)
 */
class LootBoxDBO extends SoftDelete {

    protected $table = 'loot_boxes';
    protected $primaryKey = 'lootBoxId';
    protected $fillable = ['title', 'items', 'boxId', 'credits'];
}
