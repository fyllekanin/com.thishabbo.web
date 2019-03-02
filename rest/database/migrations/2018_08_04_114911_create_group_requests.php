<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGroupRequests extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('group_requests', function (Blueprint $table) {
            $table->bigIncrements('groupRequestId');
            $table->bigInteger('userId');
            $table->bigInteger('groupId');
            $table->bigInteger('updatedAt');
            $table->bigInteger('createdAt');

            // Indexes
            $table->index('userId');
            $table->index('groupId');
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
        Schema::dropIfExists('group_requests');
    }
}
