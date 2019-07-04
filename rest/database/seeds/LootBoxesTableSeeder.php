<?php

use Illuminate\Database\Seeder;

class LootBoxesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('loot_boxes')->delete();
        
        \DB::table('loot_boxes')->insert(array (
            0 => 
            array (
                'lootBoxId' => 1,
                'title' => 'Random',
                'items' => '[2,1,3]',
                'boxId' => 5,
                'credits' => 200,
                'isDeleted' => 0,
                'createdAt' => 1562232464,
                'updatedAt' => 1562232464,
            ),
        ));
        
        
    }
}