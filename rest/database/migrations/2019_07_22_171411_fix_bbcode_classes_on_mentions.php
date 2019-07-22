<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class FixBbcodeClassesOnMentions extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::table('bbcodes')->where('name', 'Mention v2')->update([
            'replace' => '<a class="mention-user-2" data-type="internal" data-url="/user/profile/$1">$1</a>',
            'updatedAt' => time()
        ]);
        DB::table('bbcodes')->where('name', 'Group tag v2')->update([
            'replace' => '<a class="mention-group-2">$1</a>',
            'updatedAt' => time()
        ]);

        DB::table('bbcodes')->insert([
            'name' => 'old mention',
            'example' => '[mention]@nickname[/mention]',
            'pattern' => '/\\[mention\\]@(.*?)\\[\\/mention\\]/si',
            'replace' => '@$1',
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
    public function down() {
        //
    }
}
