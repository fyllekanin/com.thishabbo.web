<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserBetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_bets', function (Blueprint $table) {
            $table->bigIncrements('userBetId');
            $table->bigInteger('userId');
            $table->bigInteger('betId');
            $table->integer('leftSide');
            $table->integer('rightSide');
            $table->integer('amount');
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('userId');
            $table->index('betId');
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
    public function down()
    {
        Schema::dropIfExists('user_bets');
    }
}
