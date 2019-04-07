<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogUserTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::create('log_user', function (Blueprint $table) {
            $table->bigIncrements('logId');
            $table->bigInteger('userId');
            $table->string('ip');
            $table->integer('action');
            $table->bigInteger('contentId')->default(0);
            $table->text('data');
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('ip');
            $table->index('userId');
            $table->index('action');
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
        Schema::dropIfExists('log_user');
    }
}
