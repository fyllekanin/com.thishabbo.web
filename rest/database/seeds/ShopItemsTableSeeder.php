<?php

use Illuminate\Database\Seeder;

class ShopItemsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('shop_items')->delete();
        
        \DB::table('shop_items')->insert(array (
            0 => 
            array (
                'shopItemId' => 1,
                'title' => 'icon',
                'description' => 'test',
                'rarity' => 80,
                'type' => 2,
                'isDeleted' => 0,
                'data' => '{"subscriptionTime":null,"subscriptionId":null}',
                'createdAt' => 1560790635,
                'updatedAt' => 1560790635,
            ),
            1 => 
            array (
                'shopItemId' => 2,
                'title' => 'effect',
                'description' => '1',
                'rarity' => 80,
                'type' => 3,
                'isDeleted' => 0,
                'data' => '{"subscriptionTime":null,"subscriptionId":null}',
                'createdAt' => 1560790708,
                'updatedAt' => 1560790708,
            ),
            2 => 
            array (
                'shopItemId' => 3,
                'title' => 'sub',
                'description' => 'test',
                'rarity' => 80,
                'type' => 4,
                'isDeleted' => 0,
                'data' => '{"subscriptionTime":3600,"subscriptionId":1}',
                'createdAt' => 1560790788,
                'updatedAt' => 1560790788,
            ),
        ));
        
        
    }
}