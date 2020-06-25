<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexForLogs extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::table('log_user', function (Blueprint $table) {
            $table->index('contentId');
        });
        Schema::table('log_staff', function (Blueprint $table) {
            $table->index('contentId');
        });
        Schema::table('log_sitecp', function (Blueprint $table) {
            $table->index('contentId');
        });
        Schema::table('log_mod', function (Blueprint $table) {
            $table->index('contentId');
        });
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
