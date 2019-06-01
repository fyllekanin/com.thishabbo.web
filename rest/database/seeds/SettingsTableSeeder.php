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
                'value' => '{"ip":"sc.thishabbo.com","port":"8080","password":"c6354K3AzhTUDhC","adminPassword":"THAdminbC9asoLk","nickname":"","likes":0,"userId":0,"listeners":0,"song":"","albumArt":"","djSays":""}',
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
                'value' => '[{"id":"ba669cc1-4eec-c3e8-81f4-4e3fe1a8cbd9","children":[{"id":"6d55456d-69e6-59e6-ba0c-a7fd3e5a417e","label":"Home Page","url":"\\/home"},{"id":"107d1652-aeb9-8ea0-49e2-32c7b0950212","isDivider":true,"label":"10e60026-e547-94b2-5670-f2d31289129e"},{"id":"a078f714-ed7d-70aa-7d9f-84683d710e3c","label":"History","url":"\\/"},{"id":"5d315196-f023-6d16-dac4-2632b6f0f588","label":"Staff Members","url":"\\/home\\/staff-list","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"031f056a-f382-bfa4-cc8f-7aa971e036a2","isDivider":true,"label":"5d20e2c7-1ea2-02ec-9033-1ca705a74802"},{"id":"b4af0b5e-cbcb-6813-6242-22f7717e68af","label":"Habbo Imager","url":"\\/goodies\\/habbo-imager"},{"id":"33102ee8-14b4-3e91-ec13-299569e37f16","isDivider":true,"label":"21066307-506f-a5a9-b369-3bb1034b7400"},{"id":"5f02b921-9445-30d4-5551-b6bb397274ec","label":"Contact Us","url":"\\/"},{"id":"4a017c55-8e61-d933-80e0-eed05a87a6ca","label":"Rules","url":"\\/page\\/rules","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false},{"id":"b080bc0b-c116-b9de-16a4-d606159a7766","label":"test","url":"\\/page\\/test","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false}],"label":"TH","isHomePage":true,"icon":"fas fa-home"},{"id":"e1aa503e-8bf8-32d6-bf06-fe04660980f8","children":[{"id":"fa7bb9c1-ff99-8e91-8a65-1ad101bedf1a","label":"Quests Hub","url":"\\/"},{"id":"263276fe-a721-3f6a-ded6-914c949eb1bc","isDivider":true,"label":"afb71b37-9455-8622-a5f2-0cf7844569ed"},{"id":"7daa4dd6-8bb2-268b-319c-a7c35c4d62f0","label":"Badge Guides","url":"\\/page\\/badge-articles\\/page\\/1"},{"id":"4255c8dc-c366-0027-e2b4-6405c841149f","isDivider":true,"label":"0b4613e2-c3cf-342c-13b3-d989f12338bd"},{"id":"a08471dd-de84-673d-f195-3e433ae153ee","label":"Badge Scanner","url":"\\/"},{"id":"7831a726-7d9c-4221-a31f-adf3949690d6","label":"Top 25 Collected","url":"\\/"},{"id":"606d4829-d3e3-55d2-c18b-daefb1fda578","isDivider":true,"label":"45b76635-e1d0-ff9c-336a-659b688937d3"},{"id":"771b7775-b6d6-5ed2-b437-a4dc848368b0","label":"Apply","url":"\\/"}],"label":"Quests","icon":"fa fa-book"},{"id":"b52fee42-b532-e6f8-9853-0ef05f7208b0","children":[{"id":"7ba933c7-f0ad-d1f3-38b5-2a41cd156f9d","label":"Around the World","url":"\\/"},{"id":"e6f647c5-44c5-8630-6b78-b5c63d274122","isDivider":true,"label":"974ee2fb-f433-c498-e64b-171d7433ad4c"},{"id":"0b9263b7-ee3c-33ab-4427-0d5ce749c919","label":"Entertainment & Lifestyle","url":"\\/"},{"id":"9d39c669-9f57-bdad-f54b-754ca9bcabd6","label":"Happy Hour","url":"\\/"},{"id":"a38965a6-7353-a29a-6b51-12443a7ad97f","label":"Columns Corner","url":"\\/"},{"id":"ecd84338-1e50-49c9-9f5d-6a366b761a1b","label":"In the community","url":"\\/"},{"id":"ae9ba749-5ae1-a7cc-729d-1359c9247ef4","label":"Debates Corner","url":"\\/"},{"id":"c88ed976-a0bc-d193-634f-fa4ea3b44981","isDivider":true,"label":"7f71d1c4-faac-60fc-aa8b-a722035c5a85"},{"id":"eea71717-5aa7-7d99-f816-997c3da80215","label":"Apply","url":"\\/"}],"label":"Media","icon":"fas fa-newspaper"},{"id":"d69e4f78-5854-82ca-ae9b-8085beedb8c7","children":[],"label":"Seasons","url":"\\/pages\\/leader-board","loginRequired":false,"isOnMobile":false,"icon":"fas fa-users","isDivider":false},{"id":"ad35954a-9a20-1ba0-b04b-e188f878ac69","children":[],"label":"Betting Hub","url":"\\/betting\\/dashboard","loginRequired":false,"isOnMobile":false,"icon":"fas fa-ticket-alt","isDivider":false},{"id":"9187a6e9-87bb-7a7d-3be3-d5de21ff4aa1","children":[{"id":"98cc638f-29e5-0613-5593-eff546727868","label":"Clan Hub","url":"\\/"},{"id":"375d444e-f544-2f14-e1a9-268b674878e1","isDivider":true,"label":"72a73ed6-e12c-4017-7ece-d4d7890e3711"},{"id":"7c164427-3f7c-d775-c49c-2148c79bf168","label":"Clan Leaderboard","url":"\\/"},{"id":"eb3eeff0-e189-3699-3ecc-2e0b3ff950a8","isDivider":true,"label":"252cabcd-5b36-38f0-84a7-2edcd8a4c1cc"},{"id":"75cbd66d-9651-4bec-501a-c47689330132","label":"Create a Clan","url":"\\/"}],"label":"Clans","icon":"fas fa-shield-alt"},{"id":"4bf31b27-7b3e-f6db-a8a9-34115d4f5ff3","children":[{"id":"1e91edc5-2033-bdbf-d3f1-4072b88bd3ac","label":"Latest Posts","url":"\\/forum\\/latest-posts\\/page\\/1"},{"id":"2d816c4d-2d95-53bc-b262-784355ef0067","label":"Latest Threads","url":"\\/forum\\/latest-threads\\/page\\/1"},{"id":"9f8e0557-03ea-8744-7a8c-7231c42c4537","isDivider":true,"label":"e6f8c8e7-4e77-9efb-046e-e572dca4525c"},{"id":"994f6bca-cd05-6c62-eee5-910214ecbad4","label":"Public Groups","url":"\\/"}],"label":"Forum","icon":"far fa-comment-alt","url":"\\/forum"},{"id":"fbfebbec-4ec0-0c3e-dadd-5c5fd8c9bcbc","children":[{"id":"dbfa23a6-8d6e-1c71-c80e-53b400afb866","label":"Recruitment Hub","url":"\\/"},{"id":"84e23c7e-52e4-7ffd-5fd1-a2571ac28865","isDivider":true,"label":"c6554715-a3cb-e748-1afe-f75cab8f5af3"},{"id":"8c92aa66-f213-f2fa-22ef-c6c055f0c9b4","label":"Apply","url":"\\/"}],"label":"Jobs","icon":"fas fa-bookmark"},{"id":"8612de1e-e90f-4d2b-a661-b92983f72551","children":[],"label":"Logout","icon":"fas fa-sign-out-alt","loginRequired":true,"isLogout":true,"isOnMobile":true}]',
                'createdAt' => 1549751879,
                'updatedAt' => 1554543103,
            ),
            7 =>
            array (
                'settingId' => 8,
                'key' => 'staff_of_the_week',
                'value' => '{"globalManagement":1,"europeManagement":1,"oceaniaManagement":1,"northAmericanManagement":1,"europeRadio":1,"oceaniaRadio":1,"northAmericanRadio":1,"europeEvents":1,"oceaniaEvents":1,"northAmericanEvents":1,"moderation":1,"media":1,"quests":1,"graphics":1,"audioProducer":1}',
                'createdAt' => 1550517547,
                'updatedAt' => 1550518041,
            ),
            8 =>
            array (
                'settingId' => 9,
                'key' => 'home_page_threads',
                'value' => '[2]',
                'createdAt' => 1558193736,
                'updatedAt' => 1558193739,
            ),
        ));


    }
}
