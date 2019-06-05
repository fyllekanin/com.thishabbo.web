<?php

use Illuminate\Database\Seeder;

class PagesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('pages')->delete();
        
        \DB::table('pages')->insert(array (
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
                'canEdit' => 1,
                'createdAt' => 1551197660,
                'updatedAt' => 1551197660,
            ),
            1 => 
            array (
                'pageId' => 2,
                'path' => 'access',
                'title' => 'Access Denied',
                'content' => 'You\'ve been denied access to this page! This could mean several things:

[ol]
[li]Your user account may not have sufficient privileges to access this page. Are you trying to do or access something you shouldn\'t?[/li]
[li]If you are trying to post, the administrator may have disabled your account, or it may be awaiting activation.[/li]
[li]You aren\'t registered to the site at all - please register. You won\'t be able to view threads/posts until you do so.[/li]
[li]You could be banned from the website, but this is very rare.[/li]
[li]If you\'ve already registered then log in as some features are disabled to users who aren\'t logged in![/li]
[/ol]

If you\'re still having problems - tweet us [b]@[url=https://twitter.com/thishabbo]ThisHabbo[/url][/b]!',
                'isDeleted' => 0,
                'isSystem' => 1,
                'canEdit' => 1,
                'createdAt' => 1551197660,
                'updatedAt' => 1551197660,
            ),
            2 => 
            array (
                'pageId' => 3,
                'path' => 'leader-board',
                'title' => 'Leader Board',
                'content' => '',
                'isDeleted' => 0,
                'isSystem' => 1,
                'canEdit' => 0,
                'createdAt' => 1551197660,
                'updatedAt' => 1551197660,
            ),
            3 => 
            array (
                'pageId' => 4,
                'path' => 'badge-articles/page/1',
                'title' => 'Badge Articles',
                'content' => '',
                'isDeleted' => 0,
                'isSystem' => 1,
                'canEdit' => 0,
                'createdAt' => 1551197660,
                'updatedAt' => 1551197660,
            ),
            4 => 
            array (
                'pageId' => 5,
                'path' => 'job',
                'title' => 'Job Form',
                'content' => '',
                'isDeleted' => 0,
                'isSystem' => 1,
                'canEdit' => 0,
                'createdAt' => 1551197660,
                'updatedAt' => 1551197660,
            ),
            5 => 
            array (
                'pageId' => 6,
                'path' => 'about',
                'title' => 'History',
                'content' => '[atitle]The Start[/atitle]
ThisHabbo is a Habbo fansite, currently owned by [b]irDez[/b]. Originally in 2010 the site was owned by [b]Brettles[/b], with [b]irDez [/b]and [b]Farmering [/b]as radio managers. Back then, it was a shake for fansites as Dez and Farmer were probably the best Radio Managers at the time. However, he bottled out before launch and handed the site over to Dez and Farmer.

On [b]April 30th 2010[/b] ThisHabbo launched their forum, waiting almost a month to launch the site on[b] May 22nd 2010![/b] The site was given praise from all angles, everybody seemed to love the layout, and the community kept getting bigger every day! ThisHabbo was going very well and the fanbase was amazing, with a fantastic amount of support from every direction. With this new community continuing to grow and change, something new was needed.

Only two months after Version 1 was launched, the pigs decided to change it up and launch a brand new layout, Version 2! The forum skin went live in early[b] July 2010[/b], with the main site launching on the[b] 18th July 2010[/b]. This was said to be a massive improvement from their first layout, but it wasn\'t enough to keep them going. On the [b]15th August 2010[/b] Farmer resigned from his position as site owner leaving Dez to run the site on his own. The pressure put onto him was immense, and just under two weeks after, on the 2[b]8th August 2010[/b], Dez decided he couldn\'t handle it any more and closed down the site.


[atitle]The Return[/atitle][center][i]\'one last time, we promise!\'[/i][/center]
Soon after closing the site, Dez and Farmer realised how much they missed it and how much the fans missed it, so they had an idea. On the [b]2nd November 2010[/b], they re-launched ThisHabbo with the saying "One last time, we promise". This was met by much criticism from fellow fansite HFFM as they saw more and more of their staff make the switch. ThisHabbo had launched with a older V2 layout for now.

Habbos from all around the globe joined them to start up what was to become one of the biggest fansites in history, although they didn\'t know this yet. A few weeks after launch, [b]Farmering [/b]left the website for again, leaving [b]irDez [/b]to run the website by himself again. 

However, all was not lost since Dez had anticipated Farmer\'s depature, already having DanM2008 on standby as the new site technician, taking over some of Farmer\'s old roles. [b]Version 3 was promised in November 2010[/b], but in the end was delayed right up until [b]March 2011[/b], due to there not being a good design found.  
So on Saturday[b] 26th March 2011[/b] Version 3 was launched, 5 months after they had originally said. 
[b]Legend says, ThisHabbo generally releases layouts in March.
[/b]


[atitle]Version 3[/atitle][center][i][/i][/center]Version 3 received good reviews from the community and Dez proceeded to update the layout [b]throughout 2011 and 2012,[/b] with many changes through the site\'s management team, all making the site stronger. In June 2012, DanM2008 decided to step down as site manager, which meant that there was space for a new site manager to help Dez with running the website. BraveHeart71 was the general manager at the time and had already been dealing with the website coding and so he stepped up to help push the site forward.

From April 2012 to November 2012 ThisHabbo\'s main site was on Version 3.9, the last time version 3 was worked on. [b]The layout had been around for 19 months, a new layout was very overdue[/b], so the search began for a new layout.

[b]ThisHabbo V3 remains to be the most successful layout in history.[/b]


[atitle]Version 4[/atitle][center][i][/i][/center]In true ThisHabbo style Version 4 came months later than promised, but eventually on the [b]10th November 2012[/b] Dez pressed the button which launched the best layout ThisHabbo had ever seen. The site loaded faster, the design was cleaner and best of all there were so many more features making things user-friendly! All we need now is some feedback, then the website will continue to be updated.

After many months, and the site being on [b]Version 4 for nearly four years[/b] (yes stupid!) search began for a new layout, and nothing was working.


[atitle]Version 4.2[/atitle][center][i][/i][/center]Even with the success of Version 4, The Administration team weren\'t happy and wanted to create a more user friendly content packed site for our users to enjoy. On the [b]13th May 2013[/b] Dez launched the new and improved Version 4.2 packed with new content and unique ideas. This site design was much cleaner than the previous and everything was user-friendly and more easy to navigate.

We also seen the introduction of our new department - Habbo events. With this layout came a brand new unreleased habbo furni section dedicated to providing you with hotel updates before they appeared on Habbo! However, it didn\'t take long for ThisHabbo to bottle the department - the community wasn\'t happy with it and the department faded away. ThisHabbo then reverted back to an older style layout. At this point, people were bored of V4 and wanted something new. Statistics were down - people weren\'t posting and even better, MSN had closed making it even harder for ThisHabbo to survive.

[b]Dez was inactive, Fergie was inactive and Dan was busy - ThisHabbo was left for dusk.[/b]


[atitle]Version 5[/atitle][center][i][/i][/center][i][center]V1 sucked - V2 wasn\'t bad - V3 was brilliant - V4 was disappointing - V5 was fantastic.[/center][/i]
[b]Version 4 had been out for four years and people were sick of it[/b]. ThisHabbo had been left behind alongside HFFM and Habbox as newer sites opted not to use vBulletin and code their own systems to manage their content better and more dynamically. This led to the older fansites not being used as much. Fansites were more focused on guides and badges - something ThisHabbo, HFFM and Habbox didn\'t provide.

Dez had returned from his 2 year of inactivity, scaring the current community (who had no idea who this Dez bloke was) that things would go back to it\'s depths - the staff stealing, the drama - however, he came back with one plan: Version 5. This would be a shock to the older fansites - because if ThisHabbo moved to something better, then they\'d be forced to do something similar.

Dez began designing V4.6. However, he was stuck on a query and some guy called [url=https://www.thishabbo.com/profile/Bear94]Optra[/url] (Bear94) helped him with it. Instantly, Dez offered him a place on the Admin team and they began to talk. Eric had been at fansites before - but had never really taken on an Administrator role - ThisHabbo was the perfect site to show his work off.

...And on that day V4.6 was rebranded to V5.[b] September 3rd 2015[/b] development began on Version 5. Dez wanted TH, THF and the staff panel all as one in V2, V3 and V4 but back then, we didn\'t have the ability to make that change - until Eric stressed \'easy\'. Dez then decided that V5 will only be \'our best layout\' if our longest standing members had an influence on it. At that point, ThisHabbos most loyal members were given V5 exclusive access. They tested and tested - to try and make the release as smooth as possible.

They set a date of launching it on ThisHabbos 5th birthday - but the work was just too much. It was pushed back to the first weekend of January. Guess what? It was too much work!

This led to months of Dez designing [i](and getting on Erics nerves)[/i] - and Eric coding. [b]Version 5 was finally launched early March [/b][i](when stated it would come early January, but nothing ever goes to plan here... does it?)[/i] and this one site contained 4 things:
- Badges
- Guides
- Staff Panel
- Forum

The goal for V5 was to make it better than older layouts and increase posting statistics. ThisHabbo decided to move all it\'s staff from Skype and keep everything exclusive to V5. V5 also launched with the return of V2, V3 and V4 skins to ensure everybody liked at least one skin.

ThisHabbos Version 5 hopes to be the stepping stone in fansites. It\'s slick, fast and pretty damn neat.

ThisHabbo has seen an increase in activity and posts since V5 was first announced, with a lot of older members wanting to get involved with such a interesting layout launch.

[b]The newest tagline for ThisHabbo\'s Version 5 (with thanks to [b]Dan[/b]). "Version 5 doesn\'t belong to ThisHabbo, it belongs to you, because its customisable to you" and where V5 takes us from here, only time will tell![/b]


[atitle]Version 6[/atitle][center][i][/i][/center][i][center][/center][/i]Version 5 was the version that reshaped us as a website, and if it weren\'t for V5, a lot of functionality we wanted would have been possible. While V5 successfully tore us away from the traditional main-site/forum setup, it didn\'t go as far as we wanted. Therefore, we took Version 5 a step further and released Version 6 on[b] July 7 2017.[/b]

While we weren\'t directly using vBulletin on V5, we still relied on its database design. Version 6 was a completely blank page, this allowed us to build a system that fits our needs, and our needs only and increase the speed and reliability of the site.

[b]Optra[/b] (Bear94) was initially the mastermind behind V6. He built the foundations of the project. However, he later became busy with life, so the baton was handed on to [b]Stevey[/b] and [b]Andy[/b]. With [b]Dez[/b]\'s guidance, the boys built on the strong foundations and added the many features and functionality that you see on the site today; including mystery boxes, customisable profiles, daily quests, notices and much more.

As V6 was a complete rewrite for us, it has been built with longevity in mind. We don\'t anticipate such a big change in the future. Instead, we intend to continually improve and evolve Version 6. We will be releasing new features and design changes all the time. Version 6 will never feel old.

Version 6 also saw us tweak our staff structure, bringing in \'Community Administrators\', primarily responsible for the entire community and \'Site Administrators\', with their main responsibility being to ensure that the community gets exactly what they need from the site.',
                'isDeleted' => 0,
                'isSystem' => 0,
                'canEdit' => 1,
                'createdAt' => 1559664362,
                'updatedAt' => 1559664918,
            ),
        ));
        
        
    }
}