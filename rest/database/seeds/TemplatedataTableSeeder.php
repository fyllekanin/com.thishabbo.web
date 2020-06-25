<?php

use Illuminate\Database\Seeder;

class TemplateDataTableSeeder extends Seeder {

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run () {


        \DB::table('template_data')->delete();

        \DB::table('template_data')->insert(array (
            0 =>
                array (
                    'templateDataId' => 1,
                    'threadId' => 3,
                    'badges' => '["UK946"]',
                    'tags' => 'AVAILABLE,EASY,FREE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            1 =>
                array (
                    'templateDataId' => 2,
                    'threadId' => 5,
                    'badges' => '["UK951"]',
                    'tags' => 'AVAILABLE,EASY,FREE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            2 =>
                array (
                    'templateDataId' => 3,
                    'threadId' => 6,
                    'badges' => '["PT086"]',
                    'tags' => 'AVAILABLE,EASY,FREE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            3 =>
                array (
                    'templateDataId' => 4,
                    'threadId' => 7,
                    'badges' => '["DE65C"]',
                    'tags' => 'AVAILABLE,EASY,FREE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            4 =>
                array (
                    'templateDataId' => 5,
                    'threadId' => 8,
                    'badges' => '["IT878"]',
                    'tags' => 'EASY,FREE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            5 =>
                array (
                    'templateDataId' => 6,
                    'threadId' => 9,
                    'badges' => '["FR829"]',
                    'tags' => 'AVAILABLE,EASY,FREE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            6 =>
                array (
                    'templateDataId' => 7,
                    'threadId' => 19,
                    'badges' => '["NT312"]',
                    'tags' => 'AVAILABLE,EASY',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            7 =>
                array (
                    'templateDataId' => 8,
                    'threadId' => 20,
                    'badges' => '["DE08C"]',
                    'tags' => 'CLOSED',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            8 =>
                array (
                    'templateDataId' => 9,
                    'threadId' => 21,
                    'badges' => '["ES13B"]',
                    'tags' => 'CLOSED',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            9 =>
                array (
                    'templateDataId' => 10,
                    'threadId' => 22,
                    'badges' => '["UK501"]',
                    'tags' => 'FREE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            10 =>
                array (
                    'templateDataId' => 11,
                    'threadId' => 23,
                    'badges' => '["V1806"]',
                    'tags' => 'EASY',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
            11 =>
                array (
                    'templateDataId' => 12,
                    'threadId' => 24,
                    'badges' => '["KIT15"]',
                    'tags' => 'AVAILABLE',
                    'createdAt' => time(),
                    'updatedAt' => time()
                ),
        ));


    }
}
