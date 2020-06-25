<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPrimaryKeysToReads extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::table('category_read', function (Blueprint $table) {
            $table->bigIncrements('categoryReadId')->first();
        });

        Schema::table('thread_read', function (Blueprint $table) {
            $table->bigIncrements('threadReadId')->first();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down () {
        // Empty
    }
}
