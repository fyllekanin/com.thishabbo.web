<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        DB::table('posts')->delete();
        DB::table('posts')->insert(array (
            0 =>
            array (
                'postId' => 1,
                'threadId' => 1,
                'userId' => 1,
                'content' => 'The VX version is ongoing ! 
There is a new version in the making! Prepare yourself!',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1538578022,
            ),
            1 =>
            array (
                'postId' => 2,
                'threadId' => 2,
                'userId' => 1,
                'content' => 'New test data is added to the system! if nothing is missed we now got test data for all the implemented parts in the system!
Woooho!!',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1538578022,
            ),
            2 =>
            array (
                'postId' => 3,
                'threadId' => 1,
                'userId' => 1,
                'content' => 'NICE! !',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1538578022,
            ),
            3 =>
            array (
                'postId' => 4,
                'threadId' => 2,
                'userId' => 1,
                'content' => 'Hopefully you don\'t miss anything you fking noob!
But you need to also fix this fking spacing between lines when using the editor, it changes on save!',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1538578022,
            ),
            4 =>
            array (
                'postId' => 5,
                'threadId' => 3,
                'userId' => 1,
                'content' => 'Room Owner: Frisson
Room Name: [HabboCreate] Birthday Balloon Game

GG!',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1538578022,
            ),
            5 =>
            array (
                'postId' => 6,
                'threadId' => 4,
                'userId' => 1,
                'content' => 'Welcome [mention=2]test[/mention] to thishabbo!
Hope you will have a fun time here and join our team! ',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538578022,
                'updatedAt' => 1538578022,
            ),
            6 =>
            array (
                'postId' => 7,
                'threadId' => 5,
                'userId' => 1,
                'content' => 'This is a test!

this is just a boiler template text should show that text is displayed when the slim article is showed!',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538672652,
                'updatedAt' => 1538672652,
            ),
            7 =>
            array (
                'postId' => 8,
                'threadId' => 6,
                'userId' => 1,
                'content' => '[color=#7d7d7d][size=1][font=Verdana, sans-serif]This is a test![/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif]this is just a boiler template text should show that text is displayed when the slim article is showed![/font][/size][/color]

',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538672679,
                'updatedAt' => 1538672679,
            ),
            8 =>
            array (
                'postId' => 9,
                'threadId' => 7,
                'userId' => 1,
                'content' => '[color=#7d7d7d][size=1][font=Verdana, sans-serif]This is a test![/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif]this is just a boiler template text should show that text is displayed when the slim article is showed![/font][/size][/color]

',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538672712,
                'updatedAt' => 1538672712,
            ),
            9 =>
            array (
                'postId' => 10,
                'threadId' => 8,
                'userId' => 1,
                'content' => '[color=#7d7d7d][size=1][font=Verdana, sans-serif]This is a test![/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif]this is just a boiler template text should show that text is displayed when the slim article is showed![/font][/size][/color]

',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538672751,
                'updatedAt' => 1538672751,
            ),
            10 =>
            array (
                'postId' => 11,
                'threadId' => 9,
                'userId' => 1,
                'content' => '[color=#7d7d7d][size=1][font=Verdana, sans-serif]This is a test![/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif]this is just a boiler template text should show that text is displayed when the slim article is showed![/font][/size][/color]',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538672783,
                'updatedAt' => 1538672783,
            ),
            11 =>
            array (
                'postId' => 12,
                'threadId' => 10,
                'userId' => 1,
                'content' => '[b][color=#8a8787][size=1][font=Verdana][b]Just a rumour, or is it? Tupac Shakur is alive and in Malaysia!?[/b][/font][/size][/color][/b]

[color=#8a8787][size=1][font=Verdana]It looks like another person is claiming that Tupac Shakur is still alive and well. This time it\'s claimed by the son of imprisoned Death Row Records owner Marion Suge Knight. On Tuesday Suge J Knight took to Instagram with a string of posts trying to raise awareness regarding Tupac being alive and well. Suge suggests the Las Vegas shooting in 1996 was a hoax, a disgraceful lie. [/font][/size][/color]

[color=#8a8787][size=1][font=Verdana]He posted a quote that read,[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] \'Tupac is alive,\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] followed by an exchange of texts in which someone wrote to him, [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]\'You said [too] much. Time for you to go.\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge went on adding two images that showed a man who looks like Tupac, stood next to 50 Cent and Beyoncé in their modern-day appearance. Suge later made statements regarding the Illuminati and how they are involved with the alleged cover-up.[/font][/size][/color]

[color=#8a8787][size=1][font=Verdana]Suge intensified his argument with lots of Illuminati references, and one post read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"Beware of fake accounts. Their job is to distract you. The Illuminati are all about power. This is why you see powerful names get locked up."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Another read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m safe and know it was self-defence. #killuminati." [/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]Let\'s not forget the famous conspiracy theory that Tupac is living in Cuba; no Suge suggests that is bullsh*t he has now moved and is living in Malaysia.[/font][/size][/color]

[color=#8a8787][size=1][font=Verdana]Suge went on to say: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m a Knight. And they think Knights are a threat. I will continue to move smartly. I\'m not snitching on PAC, never the case. He would want me to protect my family. I\'m doing that. We are. Free Big Suge TIL then."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge explains he isn\'t on drugs, everything he saying is facts, however, recently his father was sentenced to 28 years in prison after a hit and run incident which saw one person die while another was injured.[/font][/size][/color]

[color=#8a8787][size=1][font=Verdana]Please see below the images of 50 Cent and Beyoncé featuring[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] "Tupac"[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]:[/font][/size][/color]
[color=#8a8787][size=1][font=Verdana][b]Click here for hidden content.[/b][/font][/size][/color]

[b][color=#8a8787][size=1][font=Verdana][b]Could Suge just be going through a hard time since his father went to prison or do you think his outrageous claims could be possible? Is Tupac still alive in your opinion? Share your theory below![/b][/font][/size][/color][/b]

[b][color=#8a8787][size=1][font=Verdana][b]Courtneyy [/b][/font][/size][/color][/b]
[i][color=#8a8787][size=1][font=Verdana][i]Media Editor[/i][/font][/size][/color][/i]
',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538715429,
                'updatedAt' => 1538715429,
            ),
            12 =>
            array (
                'postId' => 13,
                'threadId' => 11,
                'userId' => 1,
                'content' => '[b][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Just a rumour, or is it? Tupac Shakur is alive and in Malaysia!?[/b][/font][/size][/color][/font][/size][/color][/b]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]It looks like another person is claiming that Tupac Shakur is still alive and well. This time it\'s claimed by the son of imprisoned Death Row Records owner Marion Suge Knight. On Tuesday Suge J Knight took to Instagram with a string of posts trying to raise awareness regarding Tupac being alive and well. Suge suggests the Las Vegas shooting in 1996 was a hoax, a disgraceful lie. [/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]He posted a quote that read,[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] \'Tupac is alive,\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] followed by an exchange of texts in which someone wrote to him, [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]\'You said [too] much. Time for you to go.\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge went on adding two images that showed a man who looks like Tupac, stood next to 50 Cent and Beyoncé in their modern-day appearance. Suge later made statements regarding the Illuminati and how they are involved with the alleged cover-up.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge intensified his argument with lots of Illuminati references, and one post read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"Beware of fake accounts. Their job is to distract you. The Illuminati are all about power. This is why you see powerful names get locked up."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Another read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m safe and know it was self-defence. #killuminati." [/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]Let\'s not forget the famous conspiracy theory that Tupac is living in Cuba; no Suge suggests that is bullsh*t he has now moved and is living in Malaysia.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge went on to say: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m a Knight. And they think Knights are a threat. I will continue to move smartly. I\'m not snitching on PAC, never the case. He would want me to protect my family. I\'m doing that. We are. Free Big Suge TIL then."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge explains he isn\'t on drugs, everything he saying is facts, however, recently his father was sentenced to 28 years in prison after a hit and run incident which saw one person die while another was injured.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Please see below the images of 50 Cent and Beyoncé featuring[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] "Tupac"[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]:[/font][/size][/color][/font][/size][/color]
[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Click here for hidden content.[/b][/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Could Suge just be going through a hard time since his father went to prison or do you think his outrageous claims could be possible? Is Tupac still alive in your opinion? Share your theory below![/b][/font][/size][/color][/b][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Courtneyy [/b][/font][/size][/color][/b][/font][/size][/color]
[i][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][i]Media Editor[/i][/font][/size][/color][/font][/size][/color][/i]
',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538715447,
                'updatedAt' => 1538715447,
            ),
            13 =>
            array (
                'postId' => 14,
                'threadId' => 12,
                'userId' => 1,
                'content' => '[b][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Just a rumour, or is it? Tupac Shakur is alive and in Malaysia!?[/b][/font][/size][/color][/font][/size][/color][/b]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]It looks like another person is claiming that Tupac Shakur is still alive and well. This time it\'s claimed by the son of imprisoned Death Row Records owner Marion Suge Knight. On Tuesday Suge J Knight took to Instagram with a string of posts trying to raise awareness regarding Tupac being alive and well. Suge suggests the Las Vegas shooting in 1996 was a hoax, a disgraceful lie. [/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]He posted a quote that read,[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] \'Tupac is alive,\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] followed by an exchange of texts in which someone wrote to him, [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]\'You said [too] much. Time for you to go.\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge went on adding two images that showed a man who looks like Tupac, stood next to 50 Cent and Beyoncé in their modern-day appearance. Suge later made statements regarding the Illuminati and how they are involved with the alleged cover-up.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge intensified his argument with lots of Illuminati references, and one post read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"Beware of fake accounts. Their job is to distract you. The Illuminati are all about power. This is why you see powerful names get locked up."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Another read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m safe and know it was self-defence. #killuminati." [/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]Let\'s not forget the famous conspiracy theory that Tupac is living in Cuba; no Suge suggests that is bullsh*t he has now moved and is living in Malaysia.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge went on to say: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m a Knight. And they think Knights are a threat. I will continue to move smartly. I\'m not snitching on PAC, never the case. He would want me to protect my family. I\'m doing that. We are. Free Big Suge TIL then."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge explains he isn\'t on drugs, everything he saying is facts, however, recently his father was sentenced to 28 years in prison after a hit and run incident which saw one person die while another was injured.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Please see below the images of 50 Cent and Beyoncé featuring[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] "Tupac"[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]:[/font][/size][/color][/font][/size][/color]
[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Click here for hidden content.[/b][/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Could Suge just be going through a hard time since his father went to prison or do you think his outrageous claims could be possible? Is Tupac still alive in your opinion? Share your theory below![/b][/font][/size][/color][/b][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Courtneyy [/b][/font][/size][/color][/b][/font][/size][/color]
[i][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][i]Media Editor[/i][/font][/size][/color][/font][/size][/color][/i]
',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538715462,
                'updatedAt' => 1538715462,
            ),
            14 =>
            array (
                'postId' => 15,
                'threadId' => 13,
                'userId' => 1,
                'content' => '[b][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Just a rumour, or is it? Tupac Shakur is alive and in Malaysia!?[/b][/font][/size][/color][/font][/size][/color][/b]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]It looks like another person is claiming that Tupac Shakur is still alive and well. This time it\'s claimed by the son of imprisoned Death Row Records owner Marion Suge Knight. On Tuesday Suge J Knight took to Instagram with a string of posts trying to raise awareness regarding Tupac being alive and well. Suge suggests the Las Vegas shooting in 1996 was a hoax, a disgraceful lie. [/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]He posted a quote that read,[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] \'Tupac is alive,\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] followed by an exchange of texts in which someone wrote to him, [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]\'You said [too] much. Time for you to go.\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge went on adding two images that showed a man who looks like Tupac, stood next to 50 Cent and Beyoncé in their modern-day appearance. Suge later made statements regarding the Illuminati and how they are involved with the alleged cover-up.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge intensified his argument with lots of Illuminati references, and one post read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"Beware of fake accounts. Their job is to distract you. The Illuminati are all about power. This is why you see powerful names get locked up."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Another read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m safe and know it was self-defence. #killuminati." [/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]Let\'s not forget the famous conspiracy theory that Tupac is living in Cuba; no Suge suggests that is bullsh*t he has now moved and is living in Malaysia.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge went on to say: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m a Knight. And they think Knights are a threat. I will continue to move smartly. I\'m not snitching on PAC, never the case. He would want me to protect my family. I\'m doing that. We are. Free Big Suge TIL then."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge explains he isn\'t on drugs, everything he saying is facts, however, recently his father was sentenced to 28 years in prison after a hit and run incident which saw one person die while another was injured.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Please see below the images of 50 Cent and Beyoncé featuring[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] "Tupac"[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]:[/font][/size][/color][/font][/size][/color]
[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Click here for hidden content.[/b][/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Could Suge just be going through a hard time since his father went to prison or do you think his outrageous claims could be possible? Is Tupac still alive in your opinion? Share your theory below![/b][/font][/size][/color][/b][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Courtneyy [/b][/font][/size][/color][/b][/font][/size][/color]
[i][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][i]Media Editor[/i][/font][/size][/color][/font][/size][/color][/i]
',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538715477,
                'updatedAt' => 1538715477,
            ),
            15 =>
            array (
                'postId' => 16,
                'threadId' => 14,
                'userId' => 1,
                'content' => '[b][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Just a rumour, or is it? Tupac Shakur is alive and in Malaysia!?[/b][/font][/size][/color][/font][/size][/color][/b]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]It looks like another person is claiming that Tupac Shakur is still alive and well. This time it\'s claimed by the son of imprisoned Death Row Records owner Marion Suge Knight. On Tuesday Suge J Knight took to Instagram with a string of posts trying to raise awareness regarding Tupac being alive and well. Suge suggests the Las Vegas shooting in 1996 was a hoax, a disgraceful lie. [/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]He posted a quote that read,[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] \'Tupac is alive,\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] followed by an exchange of texts in which someone wrote to him, [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]\'You said [too] much. Time for you to go.\'[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge went on adding two images that showed a man who looks like Tupac, stood next to 50 Cent and Beyoncé in their modern-day appearance. Suge later made statements regarding the Illuminati and how they are involved with the alleged cover-up.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge intensified his argument with lots of Illuminati references, and one post read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"Beware of fake accounts. Their job is to distract you. The Illuminati are all about power. This is why you see powerful names get locked up."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Another read: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m safe and know it was self-defence. #killuminati." [/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]Let\'s not forget the famous conspiracy theory that Tupac is living in Cuba; no Suge suggests that is bullsh*t he has now moved and is living in Malaysia.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Suge went on to say: [/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i]"I\'m a Knight. And they think Knights are a threat. I will continue to move smartly. I\'m not snitching on PAC, never the case. He would want me to protect my family. I\'m doing that. We are. Free Big Suge TIL then."[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana] Suge explains he isn\'t on drugs, everything he saying is facts, however, recently his father was sentenced to 28 years in prison after a hit and run incident which saw one person die while another was injured.[/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana]Please see below the images of 50 Cent and Beyoncé featuring[/font][/size][/color][i][color=#8a8787][size=1][font=Verdana][i] "Tupac"[/i][/font][/size][/color][/i][color=#8a8787][size=1][font=Verdana]:[/font][/size][/color][/font][/size][/color]
[color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][b]Click here for hidden content.[/b][/font][/size][/color][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Could Suge just be going through a hard time since his father went to prison or do you think his outrageous claims could be possible? Is Tupac still alive in your opinion? Share your theory below![/b][/font][/size][/color][/b][/font][/size][/color]

[color=#7d7d7d][size=1][font=Verdana, sans-serif][b][color=#8a8787][size=1][font=Verdana][b]Courtneyy [/b][/font][/size][/color][/b][/font][/size][/color]
[i][color=#7d7d7d][size=1][font=Verdana, sans-serif][color=#8a8787][size=1][font=Verdana][i]Media Editor[/i][/font][/size][/color][/font][/size][/color][/i]
',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1538715493,
                'updatedAt' => 1538715493,
            ),
            16 =>
            array (
                'postId' => 17,
                'threadId' => 15,
                'userId' => 2,
                'content' => '2test1TovvenHe said welcome to me!Welcome [mention=2]test[/mention] to thishabbo!
Hope you will have a fun time here and join our team! ',
                'isDeleted' => 1,
                'isApproved' => 1,
                'createdAt' => 1547223025,
                'updatedAt' => 1547223728,
            ),
            17 =>
            array (
                'postId' => 18,
                'threadId' => 16,
                'userId' => 2,
                'content' => '2test1TovvenI wanna report tovven!Welcome [mention=2]test[/mention] to thishabbo!
Hope you will have a fun time here and join our team! ',
                'isDeleted' => 1,
                'isApproved' => 1,
                'createdAt' => 1547223151,
                'updatedAt' => 1547223721,
            ),
            18 =>
            array (
                'postId' => 19,
                'threadId' => 17,
                'userId' => 2,
                'content' => '[mention=2]test[/mention] reported a post.

[b]User reported:[/b] [mention=1]Tovven[/mention]
[b]Thread:[/b] [url=/forum/thread/1/page/1]Click here to go to thread.[/url]

[b]Reason:[/b]
[quote]Reporting you again![/quote]

[b]Original post:[/b]
[quote]Welcome [mention=2]test[/mention] to thishabbo!
Hope you will have a fun time here and join our team! [/quote]',
                'isDeleted' => 1,
                'isApproved' => 1,
                'createdAt' => 1547223372,
                'updatedAt' => 1547223716,
            ),
            19 =>
            array (
                'postId' => 20,
                'threadId' => 18,
                'userId' => 2,
                'content' => '[mention=2]test[/mention] reported a post.

[b]User reported:[/b] [mention=1]Tovven[/mention]
[b]Thread:[/b] [url=/forum/thread/1/page/1]Click here to go to thread.[/url]

[b]Reason:[/b]
[quote]I did not say he could welcome me! I don\'t like him, please help[/quote]

[b]Original post:[/b]
[quote]Welcome [mention=2]test[/mention] to thishabbo!
Hope you will have a fun time here and join our team! [/quote]',
                'isDeleted' => 0,
                'isApproved' => 1,
                'createdAt' => 1547223761,
                'updatedAt' => 1547223761,
            ),
        ));
    }
}
