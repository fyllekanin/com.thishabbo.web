<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsergroupsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('user_groups')->delete();
        
        DB::table('user_groups')->insert(array (
            0 => 
            array (
                'userGroupId' => 1,
                'userId' => 1,
                'groupId' => 3,
                'createdAt' => 1542060249,
                'updatedAt' => 1542060249,
            ),
        ));
        
        
    }
}