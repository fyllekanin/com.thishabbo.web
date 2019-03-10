<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PagesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('pages')->delete();
        DB::table('pages')->insert(array (
            0 =>
            array (
                'pageId' => 1,
                'path' => 'rules',
                'title' => 'Site Rules',
                'content' => 'All rules apply to all ThisHabbo related services. If you have an issue regarding a giveaway or some form of event on Habbo, then please report this to the Habbo Moderators and not ourselves. Staff are not excluded from these rules below.

[center][b][size=6][u]Global Rules[/u][/size][/b][/center]
[b]1. Intimidating or Abusive Behaviour:[/b]
Users are not permitted to be intimidating or inappropriate towards other members of the site. This includes but is not limited to arguing, bullying and the use of derogatory language and/or insults with intent to hurt the feelings of another user. Any user found breaching this rule will be sanctioned appropriately. 

[b]2. Multiple Accounts:[/b]
ThisHabbo allows users to only have access to one single account which is not to be shared with others. We have a system in place to make sure only one person is active on each account, any breach of this rule and you will be caught out. If you are found to breach this rule your account will be limited until you speak to Site Management requiring you must post a thread in the ban appeals section of the forum. If you don\'t provide a good reason for the multiple login your account will be dealt with fairly and efficiently.

[b]3. Undermining a Moderator\'s or Administrator\'s Decision:[/b]
Any user found undermining the actions taken by a Moderator or Administrator will be sanctioned accordingly. This includes but is not limited to removing post edits remaking closed threads and discussion of punishments such as infractions and bans, whether their own or others. If you disagree with the course of action taken by a Moderator, you may appeal the decision in the appropriate subforum. Moderators and Administrators reserve the right to remove posts, avatars, signatures and cover photos without warning.

[b]4. Private and Personal Information:[/b]
Users of ThisHabbo are discouraged from posting any form of private and personal information such as email addresses, Discord usernames and/or other form of social media. This also includes but is not limited to posting images of another user without permission. Any user found sharing this information will be doing so at their own risk; ThisHabbo will not be held liable for any negative consequences. Additionally, sharing the private and personal information of any other user without their permission whether in text or images is a punishable offence. The sanctions are down to the sole discretion of ThisHabbo Moderation and Administration.

[b]5. Illegal Activity and Inappropriate Content:[/b]
Any content posted on ThisHabbo deemed inappropriate will be removed by our Moderation department without prior notice. The user(s) in question may also incur penalties such as warnings and infractions. This includes but is not limited to illegal activity, scamming and scripting pornographic content and images/videos of "self-harm". Under no circumstances is pornography allowed to be posted on the forum. All NSFW content will be removed and you will be punished appropriately.

[b]6. Pointless Posting:[/b]
Pointless posting regards any post that does not contribute to the topic of the thread and was simply posted with aims of gaining post count. This includes posting the same "on topic" answer over and over again in a short space of time. Any user found pointless posting will be warned/infracted accordingly.

[b]7. Thread Bumping:[/b]
Users are not permitted to post in a thread that is over five months old (with the exception of stickied threads, spam section and trade city within reason - bumps of exceptionally old threads will see appropriate action taken). We aim to encourage new, fresh and current discussion. Users found obstructing this aim by breaching this rule outside of the exceptions will be sanctioned and the thread will be closed.

[b]8. Breaking Individual Thread Rules:[/b]
Specific threads, such as "Things you\'d like to say to someone but can\'t!" feature individual rules that must be followed within the thread. If a thread contains individual rules, they will be located on the first page. Failure to comply to these rules will result in warning/infractions and thread bans where appropriate. If an Administrator member is failing to abide to these rules, then you are free to go off topic within the thread without punishment. A moderator will then step in and post when thread rules are being abided again.

[b]9. Misuse of Donator:[/b]
ThisHabbo prohibits users misusing and abusing of ThisHabboClub. It is not to be set to resemble that of Management or Administration. Names must also be visible at all times. This means white names are not to be used on white avatars or outside of the avatar space or black on black. In regards to white names, #FFFFFF is not allowed, the "whitest" hex code allowed to be used is #EEEEEE, this allows the name to also be visible on the forum homepage. Please bear this in mind when choosing your donator colour - feel free to ask Community Admins or Moderators to see if your colour is acceptable.

[b]9.1 Misuse of Forum Tools:[/b]
ThisHabbo prohibits users misusing and/or abusing the likes, mentioning, quotes feature, reporting system, staff BB codes, and shop items. Any user found excessively tagging, quoting or liking other people\'s posts will be sanctioned accordingly. Users are not allowed to use Staff BB codes outside of the group that they belong to. For example, if you are not a moderator on the forum you are not privvy to using the moderator BB code. Any users seen misusing the staff BB codes may see themselves sanctioned. Abuse of ThisHabboShop features and THC will also not be accepted.

[b]10. Inappropriate Signatures/Avatars/Usernames/Profiles:[/b]
Users are not permitted to post an inappropriate signature. This includes but is not limited to images/usernames that stretch the skin or cause a nuisance such as excessive flashing. Failure to comply by this rule will result in the distribution of warnings/infractions. This rule also extends to avatars, no nudity or excessive flashing is permitted. Usernames are also prohibited from containing explicit language, or language that may offend others, usernames should also not contain an excessive amount of characters in which it would attempt to alter or change the regular skin limits. This rule must also be respected when it comes to the décor of profiles - inappropriate pieces of artwork will not be accepted.

[b]11. Unauthorised Radio Access[/b]
Only ThisHabbo Administrators, Management & Radio Staff have authorised access to ThisHabbo Radio.  An unauthorised connection to ThisHabbo Radio will be investigated and dealt with accordingly.  Please note, if you were once staff and are no longer, this does indeed mean you no longer have authorised access to the radio - whether you have the encoder details or not. 

[b]12. [/b][b]Selling Habbo Accounts/Coins[/b]
It is prohibited to use the forum to advertise the selling of Habbo coins, accounts, furniture or anything of a similar nature in exchange for real money. Anyone doing so will be sanctioned appropriately.

Any user who feels they have been unfairly sanctioned by the moderation team are encouraged to contact Site Management or a member of Administration. Any user found undermining or attempting to go against a Moderator\'s decision will have their punishment worsened and possibly be banned. We do not condone any abusive or intimidating messages towards members of our moderation department who work tirelessly hard to keep the website a safe and happy environment; offenders will be punished.

ThisHabbo reserves the right at any time to remove, edit, move or close any thread for any reason; change the rules; change any of the settings or usergroup permissions based on accounts when necessary; temporarily suspend or remove your access to this website without prior notice. Your continued usage of this service constitutes your acceptance of the above rules. Alongside that- Dez, Fergie, Kerry and mostly Dan are the people who put money into this fansite. Some of these Admins have put in over £1,000 and clocked up over 5 years of solid dedication. Therefore, Admins can use paid subscription money for any service they see fit. As long as bills are paid for, the money can be moved, sent and used for personal gain between these Administrators.

Whilst we as a fansite of Habbo are heavily moderated, it is impossible to catch every offense committed, we rely on the forum users to inform us through the reporting system. However those posts breaking the forum rules or those of the fansite or Habbo way in general which are not reported are at the liability of the original poster and the user(s) reading the post and not of ThisHabbo. We as Administration respect the views and opinions expressed by our community, but we have to follow and enforce the rules in place.

As a fansite, we are not affiliated with Habbo. As this is the case, anything that happens outside of the website is outwith our control. By using this website, you agree that we hold no liability for issues that occur on, but not limited to: Skype, Discord, Habbo or third party websites. Although we will try to monitor the official staff chats that we use and will try to remove those who are not co-operative, we cannot be held responsible for the actions of those who use such programs. Additionally, the views of the staff outwith the website (such as their twitter accounts) does not necessarily represent the views of ThisHabbo as a whole and whatever they say is their own opinion. We suggest that you use the built in moderation features of such website and program as we cannot take any action and have no permissions or powers over such.

[center][size=6][b][u]Client Rules[/u][/b][/size][/center]

Firstly, ThisHabbo takes absolutely no responsibility of things which happen on Habbo Hotel. If you\'re not happy with a service provided by one of our staff members, please report it to Habbo Staff. You can report it to a Department Manager at ThisHabbo, but we have very limited power.

1 ThisHabbo may contain information that we believe comes from reliable sources. Although, ThisHabbo takes no responsibility for the accuracy of the information.

2. The site "ThisHabbo" gets updated throughout the year. However ThisHabbo excludes any warranties, as to the quality, accuracy, completeness, performance for particular parts to the websites.

3. ThisHabbo is not the fault for any loss of internet connectivity during any Event, Competition or Giveaway.

4. ThisHabbo reserve the right to end or cancel or postpone their event/giveaway without notice.

5. ThisHabbo staff member(s) holding the Event, Competition or Giveaway must give out the prize with evidence on air unless the giveaway needs a target audience to start. If you become a victim of not receiving a prize, please report this to Habbo immediately.

6. Users who choose to take part in ThisHabbo Competitions are playing at their own risk. We have minimum control over our staff and we cannot control how much they give away, nor can we prove whether the prize is given or not.

7. Sulake UK Ltd do not own or operate any events, competitions, giveaways or prizes that ThisHabbo own/hold.

8. Every person who enters any of ThisHabbo’s events, competitions or giveaways are at their own risk. Never will any staff member ask for any kind of information This may include personal information or any Habbo information that may lead your Habbo account being at the risk of getting hacked or scammed. All entrants have all the right to contact an Administrator or member of ThisHabbo Management if they feel that any staff member has broken this rule.

9. Any entrants who win Forum VIP will need to give certain details to the host of the event/competition. Forum VIP can NOT be paused.
[center][/center]

[admin]Last modified: 04-29-2018[/admin]',
                'isDeleted' => 0,
                'isSystem' => 0,
                'createdAt' => 1551197660,
                'updatedAt' => 1551197660,
            ),
            1 =>
                array (
                    'pageId' => 2,
                    'path' => 'access',
                    'title' => 'Access Denied',
                    'content' => 'Access Denied',
                    'isDeleted' => 0,
                    'isSystem' => 1,
                    'createdAt' => 1551197660,
                    'updatedAt' => 1551197660,
                ),
        ));


    }
}
