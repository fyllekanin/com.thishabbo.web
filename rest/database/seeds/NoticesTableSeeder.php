<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoticesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('notices')->insert([
            'title' => 'VX Sign up bonus!',
            'text' => 'Access all our exclusive features for FREE \\n if you register today!',
            'backgroundColor' => 'rgb(226, 137, 44)',
            'order' => 1,
            'userId' => 1,
            'createdAt' => time(),
            'updatedAt' => time()
        ]);

        DB::table('notices')->insert([
            'title' => 'VX Log in bonus!',
            'text' => 'Don\'t worry - we don\'t forget our members. \\n Log in and claim free ThisHabboClub for free!',
            'backgroundColor' => '#5c84cc',
            'order' => 2,
            'userId' => 1,
            'createdAt' => time(),
            'updatedAt' => time()
        ]);

        DB::table('notices')->insert([
            'title' => 'We pay our staff!',
            'text' => 'With our no minimums system, work for us \\n when you want and we\'ll pay you for the time \\n you dedicate!',
            'backgroundColor' => '#21252f',
            'order' => 3,
            'userId' => 1,
            'createdAt' => time(),
            'updatedAt' => time()
        ]);
    }
}
