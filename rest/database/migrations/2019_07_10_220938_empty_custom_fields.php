<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class EmptyCustomFields extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::table('userdata')->update(['customFields' => '']);
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
