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
                'habbo' => 'bear94',
                'password' => '$2y$10$eQBE1Dj.0/utvVNPLdthm.ldJFDXztDPZFewptu1lKuw9j65bRqBu',
                'displayGroupId' => 0,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 33,
                'threads' => 26,
                'ignoredNotifications' => 0,
                'theme' => 0,
                'lastActivity' => 1553982771,
                'createdAt' => 1538578022,
                'updatedAt' => 1553982771,
            ),
            1 => 
            array (
                'userId' => 2,
                'username' => 'test',
                'nickname' => 'test',
                'habbo' => 'optra',
                'password' => '$2y$10$iWdGdTc6PgEVm2FwZLrIjO0.dkOtDQkaE.XrRWuyXAJ4VoPwSsvdK',
                'displayGroupId' => 0,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 1,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'theme' => 0,
                'lastActivity' => 0,
                'createdAt' => 1538578022,
                'updatedAt' => 1553979288,
            ),
            2 => 
            array (
                'userId' => 3,
                'username' => 'test1234',
                'nickname' => 'test1234',
                'habbo' => 'felicia',
                'password' => '$2y$10$8QDesp4Lo0Pq1EHVuwMdrek7SRldZJ5ooCHxtBkVfsDMEsW17s3h2',
                'displayGroupId' => 0,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'theme' => 0,
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
                'password' => '$2y$10$Sc4A5IhmLoC1ucxa/eh46.sYHL6BoqCphBzpXfzkb7miLPGAlakMu',
                'displayGroupId' => 40,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'theme' => 0,
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
                'password' => '$2y$10$HNk5nhUjSM70Aavcv/OK8O7Z/O17oP.HnplA/IO1Mi1JUigaczHl2',
                'displayGroupId' => 41,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'theme' => 0,
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
                'password' => '$2y$10$upeEMgtLRBr0s7XFCaNl1u/GiFkPF9mIFr0.eTJfqHi2ckPKh5Za.',
                'displayGroupId' => 41,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'theme' => 0,
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
                'password' => '$2y$10$rU87oBc96E5hYIVVTDhW7.MiSnAxs5ME.HFbXvpO97WIdmm6FLPPO',
                'displayGroupId' => 40,
                'referralId' => 0,
                'gdpr' => 1,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'theme' => 0,
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
                'password' => '$2y$10$fIB8li3A2Ubu2x5vQByuFulAOdQe37/spRTTu.C5n0EcMOkQTR3Ey',
                'displayGroupId' => 40,
                'referralId' => 0,
                'gdpr' => 0,
                'likes' => 0,
                'posts' => 0,
                'threads' => 0,
                'ignoredNotifications' => 0,
                'theme' => 0,
                'lastActivity' => 0,
                'createdAt' => 1542051979,
                'updatedAt' => 1542051979,
            ),
        ));
        
        
    }
}