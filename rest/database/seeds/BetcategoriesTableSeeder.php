<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BetcategoriesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('bet_categories')->delete();
        DB::table('bet_categories')->insert(array (
            0 =>
            array (
                'betCategoryId' => 1,
                'name' => 'Staff',
                'displayOrder' => 2,
                'isDeleted' => 0,
                'createdAt' => 1540112982,
                'updatedAt' => 1540112982,
            ),
            1 =>
            array (
                'betCategoryId' => 2,
                'name' => 'Site',
                'displayOrder' => 1,
                'isDeleted' => 0,
                'createdAt' => 1540112992,
                'updatedAt' => 1540112992,
            ),
        ));
    }
}
