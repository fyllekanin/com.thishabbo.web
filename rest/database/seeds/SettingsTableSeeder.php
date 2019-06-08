<?php

use Illuminate\Database\Seeder;

class SettingsTableSeeder extends Seeder {

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run() {


        \DB::table('settings')->delete();

        \DB::table('settings')->insert(array(
            0 =>
                array(
                    'settingId' => 1,
                    'key' => 'welcome_bot_userId',
                    'value' => '1',
                    'createdAt' => 1537887624,
                    'updatedAt' => 1537887624,
                ),
            1 =>
                array(
                    'settingId' => 2,
                    'key' => 'welcome_bot_message',
                    'value' => 'Welcome :nickname: to thishabbo!
Hope you will have a fun time here and join our team! ',
                    'createdAt' => 1537887624,
                    'updatedAt' => 1537887624,
                ),
            2 =>
                array(
                    'settingId' => 3,
                    'key' => 'welcome_bot_categoryId',
                    'value' => '7',
                    'createdAt' => 1537887624,
                    'updatedAt' => 1537887624,
                ),
            3 =>
                array(
                    'settingId' => 4,
                    'key' => 'radio',
                    'value' => '{"ip":"http:\\/\\/sc.thishabbo.com","port":8080,"password":"THpassdwad434543dwadawdaRADIO","adminPassword":"THpasswodwadaw43454dwadawAAaadmin","nickname":"","likes":0,"userId":0,"listeners":0,"song":"","albumArt":"","djSays":"","nextDj":"","serverType":"shoutCastV1"}',
                    'createdAt' => 1548703886,
                    'updatedAt' => 1559666814,
                ),
            4 =>
                array(
                    'settingId' => 5,
                    'key' => 'do_not_hire',
                    'value' => '[]',
                    'createdAt' => 1537888069,
                    'updatedAt' => 1537888854,
                ),
            5 =>
                array(
                    'settingId' => 6,
                    'key' => 'ban_on_sight',
                    'value' => '[{"id":"1","name":"test123","reason":"test","addedBy":43325,"createdAt":1559594436}]',
                    'createdAt' => 1537888069,
                    'updatedAt' => 1559594436,
                ),
            6 =>
                array(
                    'settingId' => 7,
                    'key' => 'navigation',
                    'value' => '[{"id":"ba669cc1-4eec-c3e8-81f4-4e3fe1a8cbd9","children":[{"id":"6d55456d-69e6-59e6-ba0c-a7fd3e5a417e","label":"Home Page","url":"\\/home"},{"id":"107d1652-aeb9-8ea0-49e2-32c7b0950212","isDivider":true,"label":"9e9e663a-2aa3-902a-9236-8add02ed830b"},{"id":"a078f714-ed7d-70aa-7d9f-84683d710e3c","label":"History","url":"\\/page\\/about","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"5d315196-f023-6d16-dac4-2632b6f0f588","label":"Staff Members","url":"\\/home\\/staff-list","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"031f056a-f382-bfa4-cc8f-7aa971e036a2","isDivider":true,"label":"c09f0d1c-4e7a-2ebc-9d67-d81bb98815d9"},{"id":"b4af0b5e-cbcb-6813-6242-22f7717e68af","label":"Habbo Imager","url":"\\/goodies\\/habbo-imager"},{"id":"33102ee8-14b4-3e91-ec13-299569e37f16","isDivider":true,"label":"968beeb6-2b02-9244-01a5-1fc909ae7a28"},{"id":"5f02b921-9445-30d4-5551-b6bb397274ec","label":"Contact Us","url":"\\/page\\/contact"},{"id":"4a017c55-8e61-d933-80e0-eed05a87a6ca","label":"Rules","url":"\\/page\\/rules","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false}],"label":"TH","isHomePage":true,"icon":"fas fa-home"},{"id":"e1aa503e-8bf8-32d6-bf06-fe04660980f8","children":[{"id":"fa7bb9c1-ff99-8e91-8a65-1ad101bedf1a","label":"Quests Hub","url":"\\/"},{"id":"263276fe-a721-3f6a-ded6-914c949eb1bc","isDivider":true,"label":"d065c15d-547c-79a5-070e-25b1539dd261"},{"id":"7daa4dd6-8bb2-268b-319c-a7c35c4d62f0","label":"Badge Guides","url":"\\/page\\/badge-articles\\/page\\/1"}],"label":"Quests","icon":"fa fa-book"},{"id":"b52fee42-b532-e6f8-9853-0ef05f7208b0","children":[{"id":"7ba933c7-f0ad-d1f3-38b5-2a41cd156f9d","label":"Around the World","url":"\\/forum\\/category\\/620\\/page\\/1","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"e6f647c5-44c5-8630-6b78-b5c63d274122","isDivider":true,"label":"27ec6b4b-3cbe-9551-6bfd-101c51facb7c"},{"id":"0b9263b7-ee3c-33ab-4427-0d5ce749c919","label":"Entertainment & Lifestyle","url":"\\/forum\\/category\\/68\\/page\\/1","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"9d39c669-9f57-bdad-f54b-754ca9bcabd6","label":"Happy Hour","url":"\\/forum\\/category\\/1119\\/page\\/1","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"a38965a6-7353-a29a-6b51-12443a7ad97f","label":"Columns Corner","url":"\\/forum\\/category\\/67\\/page\\/1","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"ecd84338-1e50-49c9-9f5d-6a366b761a1b","label":"In the community","url":"\\/forum\\/category\\/71\\/page\\/1","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false},{"id":"ae9ba749-5ae1-a7cc-729d-1359c9247ef4","label":"Debates Corner","url":"\\/forum\\/category\\/673\\/page\\/1","loginRequired":false,"isOnMobile":false,"icon":null,"isDivider":false,"isHomePage":false}],"label":"Media","icon":"fas fa-newspaper"},{"id":"d69e4f78-5854-82ca-ae9b-8085beedb8c7","children":[],"label":"Seasons","url":"\\/page\\/leader-board","loginRequired":false,"isOnMobile":false,"icon":"fas fa-users","isDivider":false,"isHomePage":false},{"id":"ad35954a-9a20-1ba0-b04b-e188f878ac69","children":[],"label":"Betting Hub","url":"\\/betting\\/dashboard","loginRequired":false,"isOnMobile":false,"icon":"fas fa-ticket-alt","isDivider":false},{"id":"4bf31b27-7b3e-f6db-a8a9-34115d4f5ff3","children":[{"id":"1e91edc5-2033-bdbf-d3f1-4072b88bd3ac","label":"Latest Posts","url":"\\/forum\\/latest-posts\\/page\\/1"},{"id":"2d816c4d-2d95-53bc-b262-784355ef0067","label":"Latest Threads","url":"\\/forum\\/latest-threads\\/page\\/1"},{"id":"9f8e0557-03ea-8744-7a8c-7231c42c4537","isDivider":true,"label":"f9e3d2d0-b596-20ef-849e-f45b0c5fcba6"},{"id":"994f6bca-cd05-6c62-eee5-910214ecbad4","label":"Public Groups","url":"\/user\/usercp\/account\/groups"}],"label":"Forum","icon":"far fa-comment-alt","url":"\\/forum"},{"id":"fbfebbec-4ec0-0c3e-dadd-5c5fd8c9bcbc","children":[{"id":"dbfa23a6-8d6e-1c71-c80e-53b400afb866","label":"Recruitment Hub","url":"\\/"},{"id":"84e23c7e-52e4-7ffd-5fd1-a2571ac28865","isDivider":true,"label":"91943688-8d40-051f-6c00-8adc93132cba"},{"id":"8c92aa66-f213-f2fa-22ef-c6c055f0c9b4","label":"Apply","url":"\\/page\\/job"}],"label":"Jobs","icon":"fas fa-bookmark"},{"id":"8612de1e-e90f-4d2b-a661-b92983f72551","children":[],"label":"Logout","icon":"fas fa-sign-out-alt","loginRequired":true,"isLogout":true,"isOnMobile":true}]',
                    'createdAt' => 1549751879,
                    'updatedAt' => 1559665386,
                ),
            7 =>
                array(
                    'settingId' => 8,
                    'key' => 'staff_of_the_week',
                    'value' => '{"globalManagement":1,"europeManagement":1,"oceaniaManagement":1,"northAmericanManagement":1,"europeRadio":1,"oceaniaRadio":1,"northAmericanRadio":1,"europeEvents":1,"oceaniaEvents":1,"northAmericanEvents":1,"moderation":1,"media":1,"quests":1,"graphics":1,"audioProducer":1}',
                    'createdAt' => 1550517547,
                    'updatedAt' => 1550518041,
                ),
            8 =>
                array(
                    'settingId' => 9,
                    'key' => 'home_page_threads',
                    'value' => '[2]',
                    'createdAt' => 1558193736,
                    'updatedAt' => 1558193739,
                ),
            9 =>
                array(
                    'settingId' => 10,
                    'key' => 'no_not_hire',
                    'value' => '[{"nickname":"test","reason":"dwada","addedBy":43325,"createdAt":1559594253},{"nickname":"test12","reason":"dwada","addedBy":43325,"createdAt":1559594269},{"nickname":"test1234","reason":"test","addedBy":43325,"createdAt":1559594321}]',
                    'createdAt' => 1559594253,
                    'updatedAt' => 1559594321,
                ),
        ));


    }
}