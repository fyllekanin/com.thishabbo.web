<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class NewMentionBbcode extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        DB::table('bbcodes')->insert([
            'name' => 'Mention v2',
            'example' => '@user',
            'pattern' => '/@([a-zA-Z0-9]+)/si',
            'replace' => '<a class="mention-user" data-type="internal" data-url="/user/profile/$1">@$1</a>',
            'content' => '$1',
            'isEmoji' => 0,
            'isSystem' => 1,
            'createdAt' => time(),
            'updatedAt' => time()
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down () {
        //
    }
}
