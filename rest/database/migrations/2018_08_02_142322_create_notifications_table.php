<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('notificationId');
            $table->bigInteger('userId');
            $table->bigInteger('senderId');
            $table->integer('type');
            $table->integer('contentId');
            $table->bigInteger('readAt')->default(0);
            $table->bigInteger('createdAt');

            // Indexes
            $table->index('userId');
            $table->index('senderId');
            $table->index('type');
            $table->index('contentId');
            $table->index('createdAt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
