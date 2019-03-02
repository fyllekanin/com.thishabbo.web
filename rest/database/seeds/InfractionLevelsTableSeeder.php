<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InfractionLevelsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('infraction_levels')->delete();
        DB::table('infraction_levels')->insert(array (
            0 =>
            array (
                'infractionLevelId' => 1,
                'title' => 'Double Post',
                'points' => 1,
                'lifeTime' => 86400,
                'isDeleted' => 0,
                'createdAt' => 1549186237,
                'updatedAt' => 1549186237
            )
        ));
    }
}