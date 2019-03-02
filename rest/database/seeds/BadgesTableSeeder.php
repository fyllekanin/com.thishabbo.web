<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadgesTableSeeder extends Seeder {
    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('badges')->delete();

        DB::table('badges')->insert(array (
            0 =>
                array (
                    'badgeId' => 1,
                    'name' => 'My First Badge',
                    'description' => 'UK946',
                    'points' => 1,
                    'isSystem' => 0,
                    'createdAt' => time(),
                    'updatedAt' => time(),
                ),
            1 =>
                array (
                    'badgeId' => 2,
                    'name' => 'My Second Badge',
                    'description' => 'UK946',
                    'points' => 1,
                    'isSystem' => 0,
                    'createdAt' => time(),
                    'updatedAt' => time(),
                ),
            2 =>
                array (
                    'badgeId' => 3,
                    'name' => 'My Third Badge',
                    'description' => 'UK946',
                    'points' => 1,
                    'isSystem' => 0,
                    'createdAt' => time(),
                    'updatedAt' => time(),
                ),
        ));
    }
}
