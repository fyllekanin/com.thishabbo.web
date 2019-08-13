<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTitleLength extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        DB::statement('DROP INDEX threads_title_index ON threads;');
        Schema::table('threads', function (Blueprint $table) {
            $table->text('title')->change();
        });
        DB::statement('ALTER TABLE threads ADD FULLTEXT INDEX ThreadsTitleIndex (title)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('threads', function (Blueprint $table) {
            $table->string('title')->change();
        });
    }
}
