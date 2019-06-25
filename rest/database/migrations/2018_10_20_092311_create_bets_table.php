<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBetsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('bets', function (Blueprint $table) {
            $table->bigIncrements('betId');
            $table->bigInteger('betCategoryId');
            $table->string('name');
            $table->integer('leftSide');
            $table->integer('rightSide');
            $table->integer('isFinished')->default(0);
            $table->integer('result')->nullable();
            $table->integer('displayOrder')->default(0);
            $table->integer('isDeleted')->default(0);
            $table->integer('isSuspended')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('betCategoryId');
            $table->index('isDeleted');
            $table->index('createdAt');
            $table->index('updatedAt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('bets');
    }
}
