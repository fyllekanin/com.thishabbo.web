<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ForumPermissionsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('forum_permissions')->delete();
        DB::table('forum_permissions')->insert(array (
            0 =>
            array (
                'categoryId' => 1,
                'groupId' => 0,
                'permissions' => 2183,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            1 =>
            array (
                'categoryId' => 2,
                'groupId' => 0,
                'permissions' => 2183,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            2 =>
            array (
                'categoryId' => 3,
                'groupId' => 0,
                'permissions' => 2183,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            3 =>
            array (
                'categoryId' => 7,
                'groupId' => 0,
                'permissions' => 2183,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            4 =>
            array (
                'categoryId' => 4,
                'groupId' => 0,
                'permissions' => 2183,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            5 =>
            array (
                'categoryId' => 5,
                'groupId' => 0,
                'permissions' => 2183,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            6 =>
            array (
                'categoryId' => 6,
                'groupId' => 0,
                'permissions' => 2183,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            7 =>
            array (
                'categoryId' => 8,
                'groupId' => 0,
                'permissions' => 131,
                'createdAt' => 1547222341,
                'updatedAt' => 1547222341,
            ),
            8 =>
            array (
                'categoryId' => 9,
                'groupId' => 0,
                'permissions' => 131,
                'createdAt' => 1547222341,
                'updatedAt' => 1547222341,
            ),
            9 =>
            array (
                'categoryId' => 10,
                'groupId' => 0,
                'permissions' => 131,
                'createdAt' => 1547222341,
                'updatedAt' => 1547222341,
            ),
            10 =>
            array (
                'categoryId' => 11,
                'groupId' => 0,
                'permissions' => 129,
                'createdAt' => 1547222341,
                'updatedAt' => 1547222769,
            ),
        ));
    }
}
