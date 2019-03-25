<?php

use Illuminate\Database\Seeder;

class SettingsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        \DB::table('settings')->delete();

        \DB::table('settings')->insert(array (
            0 =>
            array (
                'settingId' => 1,
                'key' => 'welcome_bot_userId',
                'value' => '1',
                'createdAt' => 1537887624,
                'updatedAt' => 1537887624,
            ),
            1 =>
            array (
                'settingId' => 2,
                'key' => 'welcome_bot_message',
                'value' => 'Welcome :nickname: to thishabbo!
Hope you will have a fun time here and join our team! ',
                'createdAt' => 1537887624,
                'updatedAt' => 1537887624,
            ),
            2 =>
            array (
                'settingId' => 3,
                'key' => 'welcome_bot_categoryId',
                'value' => '7',
                'createdAt' => 1537887624,
                'updatedAt' => 1537887624,
            ),
            3 =>
            array (
                'settingId' => 4,
                'key' => 'radio',
                'value' => '{"ip":"http://sc.thishabbo.com","port":"8080","password":"c6354K3AzhTUDhC","adminPassword":"THAdminbC9asoLk","nickname":"","likes":0,"userId":0,"listeners":0,"song":"","albumArt":"","djSays":""}',
                'createdAt' => 1548703886,
                'updatedAt' => 1548703886,
            ),
            4 =>
            array (
                'settingId' => 5,
                'key' => 'do_not_hire',
                'value' => '[]',
                'createdAt' => 1537888069,
                'updatedAt' => 1537888854,
            ),
            5 =>
            array (
                'settingId' => 6,
                'key' => 'ban_on_sight',
                'value' => '[]',
                'createdAt' => 1537888069,
                'updatedAt' => 1537888854,
            ),
            6 =>
            array (
                'settingId' => 7,
                'key' => 'navigation',
                'value' => '[{"children":[{"label":"Home Page","url":"\\/home"},{"isDivider":true},{"label":"History","url":"\\/"},{"label":"Staff Members","url":"\\/"},{"isDivider":true},{"label":"Habbo Imager","url":"\\/goodies\\/habbo-imager"},{"isDivider":true},{"label":"Contact Us","url":"\\/"},{"label":"Rules","url":"\\/page\\/rules","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false},{"label":"test","url":"\\/page\\/test","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false}],"label":"TH", "isHomePage": true,"icon":"fas fa-home"},{"children":[{"label":"Quests Hub","url":"\\/"},{"isDivider":true},{"label":"Badge Guides","url":"\\/"},{"isDivider":true},{"label":"Badge Scanner","url":"\\/"},{"label":"Top 25 Collected","url":"\\/"},{"isDivider":true},{"label":"Apply","url":"\\/"}],"label":"Quests","icon":"fa fa-book"},{"children":[{"label":"Around the World","url":"\\/"},{"isDivider":true},{"label":"Entertainment & Lifestyle","url":"\\/"},{"label":"Happy Hour","url":"\\/"},{"label":"Columns Corner","url":"\\/"},{"label":"In the community","url":"\\/"},{"label":"Debates Corner","url":"\\/"},{"isDivider":true},{"label":"Apply","url":"\\/"}],"label":"Media","icon":"fas fa-newspaper"},{"children":[],"label":"Seasons","url":"\\/pages\\/seasons","loginRequired":false,"isOnMobile":false,"icon":"fas fa-users","isDivider":false},{"children":[],"label":"Betting Hub","url":"\\/betting\\/dashboard","loginRequired":false,"isOnMobile":false,"icon":"fas fa-ticket-alt","isDivider":false},{"children":[{"label":"Clan Hub","url":"\\/"},{"isDivider":true},{"label":"Clan Leaderboard","url":"\\/"},{"isDivider":true},{"label":"Create a Clan","url":"\\/"}],"label":"Clans","icon":"fas fa-shield-alt"},{"children":[{"label":"Latest Posts","url":"\\/forum\\/latest-posts\\/page\\/1"},{"label":"Latest Threads","url":"\\/forum\\/latest-threads\\/page\\/1"},{"isDivider":true},{"isDivider":true},{"label":"Public Groups","url":"\\/"}],"label":"Forum","icon":"far fa-comment-alt","url":"\\/forum"},{"children":[{"label":"Recruitment Hub","url":"\\/"},{"isDivider":true},{"label":"Apply","url":"\\/"}],"label":"Jobs","icon":"fas fa-bookmark"},{"children":[],"label":"Logout","icon":"fas fa-sign-out-alt","loginRequired":true,"isLogout":true,"isOnMobile":true}]',
                'createdAt' => 1549751879,
                'updatedAt' => 1552085033,
            ),
            7 =>
            array (
                'settingId' => 8,
                'key' => 'staff_of_the_week',
                'value' => '{"globalManagement":1,"europeManagement":1,"oceaniaManagement":1,"northAmericanManagement":1,"europeRadio":1,"oceaniaRadio":1,"northAmericanRadio":1,"europeEvents":1,"oceaniaEvents":1,"northAmericanEvents":1,"moderation":1,"media":1,"quests":1,"graphics":1,"audioProducer":1}',
                'createdAt' => 1550517547,
                'updatedAt' => 1550518041,
            ),
        ));


    }
}