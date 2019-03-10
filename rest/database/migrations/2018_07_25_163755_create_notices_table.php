<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNoticesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notices', function (Blueprint $table) {
            $table->bigIncrements('noticeId');
            $table->string('title');
            $table->text('text');
            $table->string('backgroundColor');
            $table->integer('order');
            $table->bigInteger('userId');
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('updatedAt');
            $table->bigInteger('createdAt');

            // Indexes
            $table->index('userId');
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
        Schema::dropIfExists('notices');
    }
}
