<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BetsTableSeeder extends Seeder {

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run() {
        DB::table('bets')->delete();
        DB::table('bets')->insert(array(
            0 =>
                array(
                    'betId' => 1,
                    'betCategoryId' => 2,
                    'name' => 'Owen to join VX development',
                    'leftSide' => 1,
                    'rightSide' => 9,
                    'isFinished' => 0,
                    'result' => NULL,
                    'displayOrder' => 1,
                    'isDeleted' => 0,
                    'createdAt' => 1540113017,
                    'updatedAt' => 1540113017,
                ),
            1 =>
                array(
                    'betId' => 2,
                    'betCategoryId' => 2,
                    'name' => 'Dez to upload changes before november',
                    'leftSide' => 2,
                    'rightSide' => 1,
                    'isFinished' => 0,
                    'result' => NULL,
                    'displayOrder' => 2,
                    'isDeleted' => 0,
                    'createdAt' => 1540113045,
                    'updatedAt' => 1540113045,
                ),
            2 =>
                array(
                    'betId' => 3,
                    'betCategoryId' => 1,
                    'name' => 'New developer before december',
                    'leftSide' => 3,
                    'rightSide' => 1,
                    'isFinished' => 0,
                    'result' => NULL,
                    'displayOrder' => 3,
                    'isDeleted' => 0,
                    'createdAt' => 1540113079,
                    'updatedAt' => 1540113079,
                ),
        ));
    }
}
