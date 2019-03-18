<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateThreadsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('threads', function (Blueprint $table) {
            $table->bigIncrements('threadId');
            $table->bigInteger('categoryId');
            $table->string('title');
            $table->integer('isOpen')->default(1);
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('posts')->default(1);
            $table->bigInteger('views')->default(0);
            $table->integer('isApproved')->default(1);
            $table->bigInteger('userId');
            $table->bigInteger('firstPostId')->unique();
            $table->bigInteger('lastPostId')->unique();
            $table->integer('isSticky')->default(0);
            $table->integer('prefixId')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('title');
            $table->index('categoryId');
            $table->index('isDeleted');
            $table->index('isApproved');
            $table->index('prefixId');
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
        Schema::dropIfExists('threads');
    }
}
