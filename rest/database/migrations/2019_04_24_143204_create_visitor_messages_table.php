<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVisitorMessagesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('visitor_messages', function (Blueprint $table) {
            $table->bigIncrements('visitorMessageId');
            $table->bigInteger('hostId');
            $table->bigInteger('userId');
            $table->longText('content');
            $table->bigInteger('likes')->default(0);
            $table->bigInteger('parentId')->default(0);
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('hostId');
            $table->index('userId');
            $table->index('parentId');
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
        Schema::dropIfExists('visitor_messages');
    }
}
