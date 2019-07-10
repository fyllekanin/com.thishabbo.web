<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTableHeadBB extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::table('bbcodes')->insert([
            'name' => 'th',
            'example' => '[th][tr][td]heading[/td][/tr][/th]',
            'pattern' => '/\\[th\\](.*?)\\[\\/th\\]/si',
            'replace' => '<thead>$1</thead>',
            'content' => '$1',
            'isEmoji' => 0,
            'isSystem' => 1,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
