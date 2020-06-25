<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class RemoveUnusedSettingsKey extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        DB::table('settings')->where('key', 'staff_of_the_week')->delete();
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
