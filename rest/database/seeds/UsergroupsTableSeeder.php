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
            1 =>
            array (
                'userGroupId' => 2,
                'userId' => 4,
                'groupId' => 40,
                'createdAt' => 1542060249,
                'updatedAt' => 1542060249,
            ),
            2 =>
            array (
                'userGroupId' => 3,
                'userId' => 5,
                'groupId' => 41,
                'createdAt' => 1542060249,
                'updatedAt' => 1542060249,
            ),
            3 =>
            array (
                'userGroupId' => 4,
                'userId' => 6,
                'groupId' => 41,
                'createdAt' => 1542060249,
                'updatedAt' => 1542060249,
            ),
            4 =>
            array (
                'userGroupId' => 5,
                'userId' => 7,
                'groupId' => 40,
                'createdAt' => 1542060249,
                'updatedAt' => 1542060249,
            ),
            5 =>
            array (
                'userGroupId' => 6,
                'userId' => 8,
                'groupId' => 40,
                'createdAt' => 1542060249,
                'updatedAt' => 1542060249,
            ),
        ));
    }
}
