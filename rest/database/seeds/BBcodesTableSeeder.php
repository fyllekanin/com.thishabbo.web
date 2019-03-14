<?php

use Illuminate\Database\Seeder;

class BBcodesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        \DB::table('bbcodes')->delete();
        \DB::table('bbcodes')->insert(array (
            0 =>
            array (
                'bbcodeId' => 1,
                'name' => 'List',
                'example' => '[li] Test Text 1[/li]',
                'pattern' => '/\\[li\\](((?R)|.)*?)\\[\\/li\\]/si',
                'replace' => '<li>$1</li>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            1 =>
            array (
                'bbcodeId' => 2,
                'name' => 'Title',
                'example' => '[atitle] Test Text 1[/atitle]',
                'pattern' => '/\\[atitle\\](((?R)|.)*?)\\[\\/atitle\\]/si',
                'replace' => '<div class="atitle">$1</div>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 0,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            2 =>
            array (
                'bbcodeId' => 3,
                'name' => 'Ul list',
                'example' => '[ul]Test Text 1[/ul]',
                'pattern' => '/\\[ul\\](((?R)|.)*?)\\[\\/ul\\]/si',
                'replace' => '<ul>$1</ul>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            3 =>
            array (
                'bbcodeId' => 4,
                'name' => 'bold',
                'example' => '[b]Bold[/b]',
                'pattern' => '/\\[b\\](((?R)|.)*?)\\[\\/b\\]/si',
                'replace' => '<strong>$1</strong>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            4 =>
            array (
                'bbcodeId' => 5,
                'name' => 'italic',
                'example' => '[i]Italic[/i]',
                'pattern' => '/\\[i\\](((?R)|.)*?)\\[\\/i\\]/si',
                'replace' => '<em>$1</em>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            5 =>
            array (
                'bbcodeId' => 6,
                'name' => 'underline',
                'example' => '[u]Underline[/u]',
                'pattern' => '/\\[u\\](((?R)|.)*?)\\[\\/u\\]/si',
                'replace' => '<u>$1</u>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            6 =>
            array (
                'bbcodeId' => 7,
                'name' => 'linethrough',
                'example' => '[s]Strike[/s]',
                'pattern' => '/\\[s\\](((?R)|.)*?)\\[\\/s\\]/si',
                'replace' => '<strike>$1</strike>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            7 =>
            array (
                'bbcodeId' => 8,
                'name' => 'size',
                'example' => '[size=3]Size[/size]',
                'pattern' => '/\\[size\\=([1-7])\\](((?R)|.)*?)\\[\\/size\\]/si',
                'replace' => '<font size="$1">$2</font>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            8 =>
            array (
                'bbcodeId' => 9,
                'name' => 'Font Style',
                'example' => '[font=Lucida Sans Unicode]Style[/font]',
                'pattern' => '/\\[font\\=(.*?)\\](((?R)|.)*?)\\[\\/font\\]/si',
                'replace' => '<font face="$1">$2</font>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            9 =>
            array (
                'bbcodeId' => 10,
                'name' => 'table',
                'example' => '[table]table[/table]',
            'pattern' => '/\\[table\\](((?R)|.)*?)\\[\\/table\\]/si',
                'replace' => '<table>$1</table>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            10 =>
            array (
                'bbcodeId' => 11,
                'name' => 'tr',
                'example' => '[tr]tr[/tr]',
                'pattern' => '/\\[tr\\](((?R)|.)*?)\\[\\/tr\\]/si',
                'replace' => '<tr>$1</tr>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            11 =>
            array (
                'bbcodeId' => 12,
                'name' => 'td',
                'example' => '[td]td[/td]',
                'pattern' => '/\\[td\\](((?R)|.)*?)\\[\\/td\\]/si',
                'replace' => '<td>$1</td>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            12 =>
            array (
                'bbcodeId' => 13,
                'name' => 'center',
                'example' => '[center]Center[/center]',
                'pattern' => '/\\[center\\](((?R)|.)*?)\\[\\/center\\]/si',
                'replace' => '<div style="text-align:center;">$1</div>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            13 =>
            array (
                'bbcodeId' => 14,
                'name' => 'left',
                'example' => '[left]Left[/left]',
                'pattern' => '/\\[left\\](((?R)|.)*?)\\[\\/left\\]/si',
                'replace' => '<div style="text-align:left;">$1</div>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            14 =>
            array (
                'bbcodeId' => 15,
                'name' => 'right',
                'example' => '[right]Right[/right]',
                'pattern' => '/\\[right\\](((?R)|.)*?)\\[\\/right\\]/si',
                'replace' => '<div style="text-align:right;">$1</div>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            15 =>
            array (
                'bbcodeId' => 16,
                'name' => 'quotepost',
                'example' => '[quotepost=5]Quote[/quotepost]',
                'pattern' => '/\\[quotepost=(.*?)\\](((?R)|.)*?)\\[\\/quotepost\\]/si',
                'replace' => '<div class="quotepost" data-post-id="$1">$2</div>',
                'content' => '$2',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            16 =>
            array (
                'bbcodeId' => 17,
                'name' => 'link',
                'example' => '[url]http://google.com[/url]',
                'pattern' => '/\\[url\\](((?R)|.)*?)\\[\\/url\\]/si',
                'replace' => '<a target="_blank" href="$1" >$1</a>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            17 =>
            array (
                'bbcodeId' => 18,
                'name' => 'namedlink',
                'example' => '[url=http://google.com]Google[/url]',
                'pattern' => '/\\[url\\=(.*?)\\](((?R)|.)*?)\\[\\/url\\]/si',
                'replace' => '<a target="_blank" href="$1">$2</a>',
                'content' => '$2',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            18 =>
            array (
                'bbcodeId' => 19,
                'name' => 'color',
                'example' => '[color=black]Black Color[/color]',
                'pattern' => '/\\[color\\=(.*?)\\](((?R)|.)*?)\\[\\/color\\]/si',
                'replace' => '<span style="color: $1;">$2</a>',
                'content' => '$2',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            19 =>
            array (
                'bbcodeId' => 20,
                'name' => 'image',
                'example' => '[img]https://img.pokemondb.net/sprites/black-white/normal/pikachu.png[/img]',
                'pattern' => '/\\[img\\](((?R)|.)*?)\\[\\/img\\]/si',
                'replace' => '<img src="$1">',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            20 =>
            array (
                'bbcodeId' => 21,
                'name' => 'image size',
                'example' => '[img width=200,height=200]https://img.pokemondb.net/sprites/black-white/normal/pikachu.png[/img]',
                'pattern' => '/\\[img width=(.*?),height=(.*?)\\](((?R)|.)*?)\\[\\/img\\]/si',
                'replace' => '<img width="$1" height="$2" src="$3">',
                'content' => '$3',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            21 =>
            array (
                'bbcodeId' => 22,
                'name' => 'image left',
                'example' => '[imgl]https://img.pokemondb.net/sprites/black-white/normal/pikachu.png[/imgl]',
                'pattern' => '/\\[imgl\\](((?R)|.)*?)\\[\\/imgl\\]/si',
                'replace' => '<img src="$1" align="left">',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            22 =>
            array (
                'bbcodeId' => 23,
                'name' => 'image right',
                'example' => '[imgr]https://img.pokemondb.net/sprites/black-white/normal/pikachu.png[/imgr]',
                'pattern' => '/\\[imgr\\](((?R)|.)*?)\\[\\/imgr\\]/si',
                'replace' => '<img src="$1" align="right">',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            23 =>
            array (
                'bbcodeId' => 24,
                'name' => 'orderedlistnumerical',
                'example' => '[list=1]Hey[/list]',
                'pattern' => '/\\[list=1\\](((?R)|.)*?)\\[\\/list\\]/si',
                'replace' => '<ol>$1</ol>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 0,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            24 =>
            array (
                'bbcodeId' => 25,
                'name' => 'unorderedlist',
                'example' => '[list]Hey[/list]',
            'pattern' => '/\\[list\\](((?R)|.)*?)\\[\\/list\\]/si',
                'replace' => '<ul>$1</ul>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            25 =>
            array (
                'bbcodeId' => 26,
                'name' => 'code',
                'example' => '[code]Html[/code]',
            'pattern' => '/\\[code\\](((?R)|.)*?)\\[\\/code\\]/si',
                'replace' => '<code>$1</code>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            26 =>
            array (
                'bbcodeId' => 27,
                'name' => 'linebreak',
                'example' => '',
                'pattern' => '/\\r\\n/',
                'replace' => '<br />',
                'content' => '',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            27 =>
            array (
                'bbcodeId' => 28,
                'name' => 'Spoiler',
                'example' => '[spoiler]test[/spoiler]',
                'pattern' => '/\\[spoiler\\](((?R)|.)*?)\\[\\/spoiler\\]/si',
                'replace' => '<details><summary>Spoiler</summary>$1</details>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            28 =>
            array (
                'bbcodeId' => 29,
                'name' => 'notice',

                'example' => '[notice]Hey[/notice]',
                'pattern' => '/\\[notice\\](((?R)|.)*?)\\[\\/notice\\]/si',
                'replace' => '<div style="width: 97.5%; display: inline;float: left; font-family: Verdana;font-size: 14px;background: rgba(237, 237, 237, 1);border: 1px solid rgb(224, 224, 224);box-shadow: 0px 2px 0px 0px rgb(234, 234, 234);padding: 9px;color: rgb(134, 134, 134);margin: 0px 0px 6px;border-radius: 2px;font-weight: 600;text-shadow: rgb(255, 255, 255) 0px 1px;clear: both;}  br { margin: 0; padding: 0; }"><strong>$1</strong> </div>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 0,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            29 =>
            array (
                'bbcodeId' => 30,
                'name' => 'mention',
                'example' => '[mention]nickname[/mention]',
                'pattern' => '/\\[mention\\](((?R)|.)*?)\\[\\/mention\\]/si',
                'replace' => '<a class="mention-user">$1</a>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            30 =>
            array (
                'bbcodeId' => 31,
                'name' => 'group',
                'example' => '[taggroup]GroupName[/taggroup]',
                'pattern' => '/\\[taggroup\\](((?R)|.)*?)\\[\\/taggroup\\]/si',
                'replace' => '<a class="mention-group">$1</a>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            31 =>
            array (
                'bbcodeId' => 32,
                'name' => 'Quote',
                'example' => '[quote]text[/quote]',
                'pattern' => '/\\[quote\\](((?R)|.)*?)\\[\\/quote\\]/si',
                'replace' => '<div class="quote">$1</div>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 0,
                'createdAt' => 1547223951,
                'updatedAt' => 1547223951,
            ),
            32 =>
            array (
                'bbcodeId' => 33,
                'name' => 'Beth Scared',
                'example' => NULL,
                'pattern' => ':beth-scared:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550694434,
                'updatedAt' => 1550695009,
            ),
            33 =>
            array (
                'bbcodeId' => 34,
                'name' => 'zoidberg',
                'example' => NULL,
                'pattern' => ':zoidberg:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695647,
                'updatedAt' => 1550695647,
            ),
            34 =>
            array (
                'bbcodeId' => 35,
                'name' => 'breezy',
                'example' => NULL,
                'pattern' => ':breezy:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695668,
                'updatedAt' => 1550695668,
            ),
            35 =>
            array (
                'bbcodeId' => 36,
                'name' => 'bobthecat',
                'example' => NULL,
                'pattern' => ':bobthecat:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695681,
                'updatedAt' => 1550695681,
            ),
            36 =>
            array (
                'bbcodeId' => 37,
                'name' => 'fat-unicorn',
                'example' => NULL,
                'pattern' => ':fat-unicorn:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695700,
                'updatedAt' => 1550695700,
            ),
            37 =>
            array (
                'bbcodeId' => 38,
                'name' => 'git',
                'example' => NULL,
                'pattern' => ':git:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695712,
                'updatedAt' => 1550695712,
            ),
            38 =>
            array (
                'bbcodeId' => 39,
                'name' => 'morty-messedup',
                'example' => NULL,
                'pattern' => ':morty-messedup:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695729,
                'updatedAt' => 1550695729,
            ),
            39 =>
            array (
                'bbcodeId' => 40,
                'name' => 'nibbler',
                'example' => NULL,
                'pattern' => ':nibbler:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695742,
                'updatedAt' => 1550695742,
            ),
            40 =>
            array (
                'bbcodeId' => 41,
                'name' => 'overwatch-ana',
                'example' => NULL,
                'pattern' => ':overwatch-ana:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695754,
                'updatedAt' => 1550695754,
            ),
            41 =>
            array (
                'bbcodeId' => 42,
                'name' => 'pink-unicorn',
                'example' => NULL,
                'pattern' => ':pink-unicorn:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695766,
                'updatedAt' => 1550695766,
            ),
            42 =>
            array (
                'bbcodeId' => 43,
                'name' => 'rick-drinking',
                'example' => NULL,
                'pattern' => ':rick-drinking:',
                'replace' => NULL,
                'content' => NULL,
                'isEmoji' => 1,
                'isSystem' => 0,
                'createdAt' => 1550695781,
                'updatedAt' => 1550695781,
            ),
            43 =>
            array (
                'bbcodeId' => 44,
                'name' => 'Youtube',
                'example' => '[youtube]M0uSnNauWJU[/youtube]',
                'pattern' => '/\\[youtube\\](((?R)|.)*?)\\[\\/youtube\\]/si',
                'replace' => '<iframe width="560" height="315" frameborder="0" src="https://www.youtube.com/embed/$1?wmode=opaque" data-youtube-id="$1" allowfullscreen=""></iframe>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            44 =>
            array (
                'bbcodeId' => 45,
                'name' => 'Ol list',
                'example' => '[ol]Test Text 1[/ol]',
                'pattern' => '/\\[ol\\](((?R)|.)*?)\\[\\/ol\\]/si',
                'replace' => '<ol>$1</ol>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            45 =>
            array (
                'bbcodeId' => 46,
                'name' => 'orderedlistnumerical',
                'example' => '[list=1]Hey[/list]',
                'pattern' => '/\[list=1\](.*?)\[\/list\]/s',
                'replace' => '<ol>$1</ol>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            46 =>
            array (
                'bbcodeId' => 47,
                'name' => 'unorderedlist',
                'example' => '[list]Hey[/list]',
                'pattern' => '/\[list\](.*?)\[\/list\]/s',
                'replace' => '<ul>$1</ul>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
            47 =>
            array (
                'bbcodeId' => 48,
                'name' => 'listitem',
                'example' => '',
                'pattern' => '/\[\*\](.*)/',
                'replace' => '<li>$1</li>',
                'content' => '$1',
                'isEmoji' => 0,
                'isSystem' => 1,
                'createdAt' => 1547139924,
                'updatedAt' => 1547139924,
            ),
        ));

        // https?:\/\/(www.)?[a-zA-Z0-9]+.[a-zA-Z]+

    }
}
