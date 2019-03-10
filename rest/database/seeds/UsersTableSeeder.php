<?php

use Illuminate\Database\Seeder;

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
                'email' => 'tovven@thishabbo.com',
                'password' => '$2y$10$ullW4n8.1Ugdg.maBp.Yr.6raiZOfJ6EmXcnNESH.oyZKbb7XS9gW',
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
                'email' => 'test@thishabbo.com',
                'password' => '$2y$10$GbGbcZOwKVxr5DF9.8OfNOthB3ESF1TbHEnD0c/UfwkvgEgtF12E2',
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
                'email' => 'test1234@thishabbo.com',
                'password' => '$2y$10$IWQJrLjKH2TQrnkBp5n/UeM2kAQ3YTucsNYjKdDd.pCufhU9dATyO',
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
        ));
        
        
    }
}