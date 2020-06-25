<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThcStatsLogTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::create('thc_stats_log', function (Blueprint $table) {
            $table->bigIncrements('thcStatsLogId');
            $table->bigInteger('credits')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('credits');
            $table->index('createdAt');
            $table->index('updatedAt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down () {
        Schema::dropIfExists('thc_stats_log');
    }
}
