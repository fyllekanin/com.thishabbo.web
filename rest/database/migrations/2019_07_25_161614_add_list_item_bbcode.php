<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddListItemBbcode extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::table('bbcodes')->where('bbcodeId', 48)
            ->update([
                'example' => '[*]text[/*]',
                'pattern' => '/\\[\\*\\](.*?)\\[\\/\\*\\]/si'
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
