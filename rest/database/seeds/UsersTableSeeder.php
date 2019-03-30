<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        \DB::table('users')->delete();

        \DB::table('users')->insert(array (
            0 =>
            array (
                'userId' => 1,
                'username' => 'Tovven',
                'nickname' => 'Tovven',
                'habbo' => 'bear94',
                'password' => Hash::make('test1234'),
                'displayGroupId' => 0,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 30,
                'threads' => 25,
                'ignoredNotifications' => 0,
                'lastActivity' => 1552159896,
                'createdAt' => 1538578022,
                'updatedAt' => 1552159896,
            ),
            1 =>
            array (
                'userId' => 2,
                'username' => 'test',
                'nickname' => 'test',
                'habbo' => 'optra',
                'password' => Hash::make('test1234'),
                'displayGroupId' => 0,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'lastActivity' => 0,
                'createdAt' => 1538578022,
                'updatedAt' => 1538578022,
            ),
            2 =>
            array (
                'userId' => 3,
                'username' => 'test1234',
                'nickname' => 'test1234',
                'habbo' => 'felicia',
                'password' => Hash::make('test1234'),
                'displayGroupId' => 0,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'lastActivity' => 0,
                'createdAt' => 1542051979,
                'updatedAt' => 1542051979,
            ),
            3 =>
            array (
                'userId' => 4,
                'username' => 'dean',
                'nickname' => 'dean',
                'habbo' => 'pankos',
                'password' => Hash::make('dean'),
                'displayGroupId' => 40,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'lastActivity' => 0,
                'createdAt' => 1542051979,
                'updatedAt' => 1542051979,
            ),
            4 =>
            array (
                'userId' => 5,
                'username' => 'queen',
                'nickname' => 'queen',
                'habbo' => 'snooze',
                'password' => Hash::make('123'),
                'displayGroupId' => 41,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'lastActivity' => 0,
                'createdAt' => 1542051979,
                'updatedAt' => 1542051979,
            ),
            5 =>
            array (
                'userId' => 6,
                'username' => 'samuel',
                'nickname' => 'samuel',
                'habbo' => 'velvice',
                'password' => Hash::make('456'),
                'displayGroupId' => 41,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'lastActivity' => 0,
                'createdAt' => 1542051979,
                'updatedAt' => 1542051979,
            ),
            6 =>
            array (
                'userId' => 7,
                'username' => 'heidi',
                'nickname' => 'heidi',
                'habbo' => 'zalophus',
                'password' => Hash::make('abc123'),
                'displayGroupId' => 40,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'lastActivity' => 0,
                'createdAt' => 1542051979,
                'updatedAt' => 1542051979,
            ),
            7 =>
            array (
                'userId' => 8,
                'username' => 'Andy',
                'nickname' => 'Andy',
                'habbo' => 'Andings',
                'password' => Hash::make('123bro'),
                'displayGroupId' => 40,
                'referralId' => 0,
                'gdpr' => 0,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'lastActivity' => 0,
                'createdAt' => 1542051979,
                'updatedAt' => 1542051979,
            )
        ));


    }
}
