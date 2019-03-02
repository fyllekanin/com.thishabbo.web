<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('notifications')->delete();
        DB::table('notifications')->insert(array (
            0 =>
            array (
                'notificationId' => 1,
                'userId' => 1,
                'senderId' => 2,
                'type' => 1,
                'contentId' => 1,
                'readAt' => 0,
                'createdAt' => 1549388004
            ),
            1 =>
            array (
                'notificationId' => 2,
                'userId' => 1,
                'senderId' => 2,
                'type' => 2,
                'contentId' => 3,
                'readAt' => 0,
                'createdAt' => 1549388004
            ),
            2 =>
            array (
                'notificationId' => 3,
                'userId' => 1,
                'senderId' => 2,
                'type' => 3,
                'contentId' => 1,
                'readAt' => 0,
                'createdAt' => 1549388004
            ),
            3 =>
            array (
                'notificationId' => 4,
                'userId' => 1,
                'senderId' => 2,
                'type' => 4,
                'contentId' => 1,
                'readAt' => 0,
                'createdAt' => 1549388004
            ),
            4 =>
            array (
                'notificationId' => 5,
                'userId' => 1,
                'senderId' => 2,
                'type' => 5,
                'contentId' => 2,
                'readAt' => 0,
                'createdAt' => 1549388004
            ),
        ));
    }
}