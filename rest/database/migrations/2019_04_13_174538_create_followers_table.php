<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFollowersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('followers', function (Blueprint $table) {
            $table->bigIncrements('followerId');
            $table->bigInteger('userId');
            $table->bigInteger('targetId');
            $table->integer('isApproved')->default(true);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('userId');
            $table->index('targetId');
            $table->index('isApproved');
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
        Schema::dropIfExists('followers');
    }
}
