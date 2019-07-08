<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddVideoBBCode extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $bbcode = new BBCode ([
            'name' => 'Video',
            'example' => '[video]dQw4wp9WgXcQ[/video]',
            'pattern' => '/\[video\](.*?)\[\/video\]/si',
            'replace' => '<iframe width="560" height="315" frameborder="0" src="https://www.youtube.com/embed/$1?wmode=opaque" data-youtube-id="$1" allowfullscreen=""></iframe>',
            'content' => '$1',
            'isSystem' => '1'
        ]);

        $bbcode->save();
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}
