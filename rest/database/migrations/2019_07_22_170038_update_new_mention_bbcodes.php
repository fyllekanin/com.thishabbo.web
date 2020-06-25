<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateNewMentionBbcodes extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        DB::table('bbcodes')->where('name', 'Mention v2')->update([
            'replace' => '<a class="mention-user" data-type="internal" data-url="/user/profile/$1">$1</a>',
            'updatedAt' => time()
        ]);

        DB::table('bbcodes')->whereIn('bbcodeId', [30, 31, 60])->delete();
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
