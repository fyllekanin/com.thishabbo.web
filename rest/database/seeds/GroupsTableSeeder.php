<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('groups')->delete();
        
        DB::table('groups')->insert(array (
            0 => 
            array (
                'groupId' => 1,
                'name' => 'Male',
                'nameStyling' => '',
                'userBarStyling' => '',
                'immunity' => 0,
                'adminPermissions' => 0,
                'staffPermissions' => 0,
                'isDeleted' => 0,
                'options' => 0,
                'isPublic' => 1,
                'avatarWidth' => 0,
                'avatarHeight' => 0,
                'createdAt' => 1542051937,
                'updatedAt' => 1542051937,
            ),
            1 => 
            array (
                'groupId' => 2,
                'name' => 'Female',
                'nameStyling' => '',
                'userBarStyling' => '',
                'immunity' => 0,
                'adminPermissions' => 0,
                'staffPermissions' => 0,
                'isDeleted' => 0,
                'options' => 0,
                'isPublic' => 1,
                'avatarWidth' => 0,
                'avatarHeight' => 0,
                'createdAt' => 1542051937,
                'updatedAt' => 1542051937,
            ),
            2 => 
            array (
                'groupId' => 3,
                'name' => 'Admin',
                'nameStyling' => 'font-weight: 800;
color: #ad6262;',
                'userBarStyling' => 'border-radius: 3px;
box-shadow: inset 0 0 0 1px rgba(0,0,0,.18), inset 0 0 0 2px rgba(255,255,255,.18), 0 2px 0 rgba(0,0,0,.16);
color: #fff;
font-style: normal;
position: relative;
text-align: center;
background-color: #ad6262;
font-weight: 800;
padding: 0.5rem 0;',
                'immunity' => 0,
                'adminPermissions' => 1,
                'staffPermissions' => 0,
                'isDeleted' => 0,
                'options' => 0,
                'isPublic' => 0,
                'avatarWidth' => 0,
                'avatarHeight' => 0,
                'createdAt' => 1542051937,
                'updatedAt' => 1542060206,
            ),
        ));
        
        
    }
}