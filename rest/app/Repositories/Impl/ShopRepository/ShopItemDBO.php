<?php

namespace App\Repositories\Impl\ShopRepository;

use App\Repositories\Impl\SoftDelete;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @property int $shopItemId
 * @property string $title
 * @property string $description
 * @property int $rarity
 * @property int $type
 * @property string $data
 * @property int $createdBy
 *
 * @method whereInShopItemId(string $key)
 * @method whereShopItemId(int $shopItemId)
 */
class ShopItemDBO extends SoftDelete {
    private $myParsedData = null;

    protected $primaryKey = 'shopItemId';
    protected $table = 'shop_items';
    protected $fillable = ['title', 'description', 'rarity', 'type', 'data', 'createdBy'];

    public function scopeWhereInShopItemId(Builder $builder, Collection $ids) {
        return $builder->whereIn($this->primaryKey, $ids);
    }

    public function scopeWhereShopItemId(Builder $builder, int $shopItemId) {
        return $builder->where($this->primaryKey, $shopItemId);
    }

    public function getParsedData() {
        if ($this->myParsedData) {
            return $this->myParsedData;
        }
        $this->myParsedData = $this->data ? json_decode($this->data) : null;
        return $this->myParsedData;
    }
}
