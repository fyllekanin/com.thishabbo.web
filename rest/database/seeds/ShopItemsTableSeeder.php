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
                'title' => 'Icon',
                'description' => 'This is an icon',
                'rarity' => 50,
                'type' => 2,
                'isDeleted' => 0,
                'data' => '{"subscriptionTime":null,"subscriptionId":null}',
                'createdBy' => 0,
                'createdAt' => 1562137827,
                'updatedAt' => 1562137827,
            ),
            1 => 
            array (
                'shopItemId' => 2,
                'title' => 'Effect',
                'description' => 'This is a name effect',
                'rarity' => 30,
                'type' => 3,
                'isDeleted' => 0,
                'data' => '{"subscriptionTime":null,"subscriptionId":null}',
                'createdBy' => 0,
                'createdAt' => 1562137852,
                'updatedAt' => 1562137852,
            ),
            2 => 
            array (
                'shopItemId' => 3,
                'title' => 'Subscription',
                'description' => 'This is an subscription',
                'rarity' => 10,
                'type' => 4,
                'isDeleted' => 0,
                'data' => '{"subscriptionTime":86400,"subscriptionId":1}',
                'createdBy' => 0,
                'createdAt' => 1562137893,
                'updatedAt' => 1562137893,
            ),
            3 => 
            array (
                'shopItemId' => 4,
                'title' => 'New Subscription',
                'description' => 'Avatar Subscription - 1 month',
                'rarity' => 10,
                'type' => 4,
                'isDeleted' => 1,
                'data' => '{"subscriptionTime":2419200,"subscriptionId":4}',
                'createdBy' => 0,
                'createdAt' => 1562312921,
                'updatedAt' => 1562312922,
            ),
            4 => 
            array (
                'shopItemId' => 5,
                'title' => 'Month Subscription - Avatar',
                'description' => 'Cool',
                'rarity' => 10,
                'type' => 4,
                'isDeleted' => 0,
                'data' => '{"subscriptionTime":2419200,"subscriptionId":4}',
                'createdBy' => 0,
                'createdAt' => 1562313056,
                'updatedAt' => 1562313056,
            ),
        ));
        
        
    }
}