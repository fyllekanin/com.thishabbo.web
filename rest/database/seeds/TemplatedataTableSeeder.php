<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TemplatedataTableSeeder extends Seeder {

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run () {

        DB::table('template_data')->delete();

        DB::table('template_data')->insert([
            0 =>
                [
                    'templateDataId' => 1,
                    'threadId' => 3,
                    'badge' => 'UK946',
                    'tags' => 'AVAILABLE,EASY,FREE',
                ],
            1 =>
                [
                    'templateDataId' => 2,
                    'threadId' => 5,
                    'badge' => 'UK951',
                    'tags' => 'AVAILABLE,EASY,FREE',
                ],
            2 =>
                [
                    'templateDataId' => 3,
                    'threadId' => 6,
                    'badge' => 'PT086',
                    'tags' => 'AVAILABLE,EASY,FREE',
                ],
            3 =>
                [
                    'templateDataId' => 4,
                    'threadId' => 7,
                    'badge' => 'DE65C',
                    'tags' => 'AVAILABLE,EASY,FREE',
                ],
            4 =>
                [
                    'templateDataId' => 5,
                    'threadId' => 8,
                    'badge' => 'IT878',
                    'tags' => 'EASY,FREE',
                ],
            5 =>
                [
                    'templateDataId' => 6,
                    'threadId' => 9,
                    'badge' => 'FR829',
                    'tags' => 'AVAILABLE,EASY,FREE',
                ],
        ]);

    }
}
