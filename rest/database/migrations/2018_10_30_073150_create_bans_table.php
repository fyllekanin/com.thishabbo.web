<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bans', function (Blueprint $table) {
            $table->bigIncrements('banId');
            $table->bigInteger('bannedId');
            $table->bigInteger('userId');
            $table->text('reason');
            $table->bigInteger('expiresAt');
            $table->bigInteger('isLifted')->default(0);
            $table->bigInteger('lifterId')->nullable();
            $table->text('liftReason')->nullable();
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('bannedId');
            $table->index('userId');
            $table->index('isLifted');
            $table->index('expiresAt');
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
        Schema::dropIfExists('bans');
    }
}
