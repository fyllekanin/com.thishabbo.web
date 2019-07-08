<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRadioStatsLog extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('radio_stats_log', function (Blueprint $table) {
            $table->bigIncrements('radioStatsLogId');
            $table->bigInteger('userId')->default(0);
            $table->integer('listeners')->default(0);
            $table->text('song')->nullable();
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('userId');
            $table->index('listeners');
            $table->index('createdAt');
            $table->index('updatedAt');
        });
        DB::statement('ALTER TABLE radio_stats_log ADD FULLTEXT INDEX RadioStatsLogSongIndex (song)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('radio_stats_log');
    }
}
