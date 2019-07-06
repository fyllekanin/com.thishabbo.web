<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreatePostsTables extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('posts', function (Blueprint $table) {
            $table->bigIncrements('postId');
            $table->bigInteger('threadId');
            $table->bigInteger('userId');
            $table->longText('content');
            $table->integer('isDeleted')->default(0);
            $table->integer('isApproved')->default(1);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('threadId');
            $table->index('userId');
            $table->index('isDeleted');
            $table->index('isApproved');
            $table->index('createdAt');
            $table->index('updatedAt');
        });
        DB::statement('ALTER TABLE posts ADD FULLTEXT INDEX PostsContentIndex (content)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('posts');
    }
}
