<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AutoBansTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('auto_bans')->delete();
        DB::table('auto_bans')->insert(array (
            0 =>
            array (
                'autoBanId' => 1,
                'title' => 'Short Ban',
                'amount' => 3,
                'banLength' => 10800,
                'reason' => 'You did something bad!',
                'isDeleted' => 0,
                'createdAt' => 1549186220,
                'updatedAt' => 1549186220
            )
        ));
    }
}