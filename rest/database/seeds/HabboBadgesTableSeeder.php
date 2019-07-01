<?php

use Illuminate\Database\Seeder;

class HabboBadgesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('habbo_badges')->delete();
        
        \DB::table('habbo_badges')->insert(array (
            0 => 
            array (
                'habboBadgeId' => '0404C',
                'description' => 'Something wicked this way comes...',
                'createdAt' => 1561969123,
                'updatedAt' => 1561969123,
            ),
            1 => 
            array (
                'habboBadgeId' => '0404E',
                'description' => 'Something wicked this way comes...',
                'createdAt' => 1561969123,
                'updatedAt' => 1561969123,
            ),
            2 => 
            array (
                'habboBadgeId' => '0404R',
                'description' => 'Something wicked this way comes...',
                'createdAt' => 1561969123,
                'updatedAt' => 1561969123,
            ),
            3 => 
            array (
                'habboBadgeId' => '0404S',
                'description' => 'Something wicked this way comes...',
                'createdAt' => 1561969123,
                'updatedAt' => 1561969123,
            ),
            4 => 
            array (
                'habboBadgeId' => '0404T',
                'description' => 'Something wicked this way comes...',
                'createdAt' => 1561969123,
                'updatedAt' => 1561969123,
            ),
            5 => 
            array (
                'habboBadgeId' => '040E2',
                'description' => 'Something wicked this way comes...',
                'createdAt' => 1561969123,
                'updatedAt' => 1561969123,
            ),
        ));
        
        
    }
}