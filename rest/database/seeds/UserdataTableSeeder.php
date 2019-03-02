<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserdataTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('userdata')->delete();

        DB::table('userdata')->insert(array (
            0 =>
            array (
                'userdataId' => 1,
                'userId' => 1,
                'signature' => NULL,
                'habbo' => 'bear94',
                'postBit' => 0,
                'avatarUpdatedAt' => 0,
                'credits' => 50,
                'habboCheckedAt' => 1539549039,
                'createdAt' => 1539549027,
                'updatedAt' => 1539549039
            ),
            1 =>
            array (
                'userdataId' => 2,
                'userId' => 2,
                'signature' => NULL,
                'habbo' => 'test',
                'postBit' => 0,
                'avatarUpdatedAt' => 0,
                'credits' => 50,
                'habboCheckedAt' => 1539549039,
                'createdAt' => 1539549027,
                'updatedAt' => 1539549039
            ),
            2 =>
            array (
                'userdataId' => 3,
                'userId' => 3,
                'signature' => NULL,
                'habbo' => 'test1234',
                'postBit' => 0,
                'avatarUpdatedAt' => 0,
                'credits' => 50,
                'habboCheckedAt' => 1539549039,
                'createdAt' => 1539549027,
                'updatedAt' => 1539549039
            )
        ));
    }
}
