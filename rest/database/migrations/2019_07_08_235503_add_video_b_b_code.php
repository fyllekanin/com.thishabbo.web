<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddVideoBBCode extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::table('bbcodes')->insert([
            'name' => 'Video',
            'example' => '[video]dQw4wp9WgXcQ[/video]',
            'pattern' => '/\[video\](.*?)\[\/video\]/si',
            'replace' => '<iframe width="560" height="315" frameborder="0" src="https://www.youtube.com/embed/$1?wmode=opaque"'
                . 'data-youtube-id="$1" allowfullscreen=""></iframe>',
            'content' => '$1',
            'isSystem' => '1',
            'createdAt' => time(),
            'updatedAt' => time()
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {

    }
}
