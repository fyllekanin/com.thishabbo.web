<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventsTableSeeder extends Seeder {
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run () {

        DB::table('events')->delete();

        DB::table('events')->insert([
            0 =>
                [
                    'eventId' => 1,
                    'name' => 'Dangerzone',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ],
            1 =>
                [
                    'eventId' => 2,
                    'name' => 'Danger pod',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ]
        ]);

    }
}
