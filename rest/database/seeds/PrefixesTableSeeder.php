<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrefixesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        DB::table('prefixes')->delete();

        DB::table('prefixes')->insert(array (
            0 =>
            array (
                'prefixId' => 1,
                'text' => 'News',
                'style' => 'font-weight: bold;',
                'categoryIds' => '-1',
                'isDeleted' => 0,
                'createdAt' => time(),
                'updatedAt' => time(),
            ),
            1 =>
            array (
                'prefixId' => 2,
                'text' => 'Badge',
                'style' => 'font-weight: bold; color: #bf2929;',
                'categoryIds' => '4',
                'isDeleted' => 0,
                'createdAt' => time(),
                'updatedAt' => time(),
            ),
        ));


    }
}
