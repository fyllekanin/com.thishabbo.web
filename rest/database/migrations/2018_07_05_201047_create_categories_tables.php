<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTables extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('categories', function (Blueprint $table) {
            $table->bigIncrements('categoryId');
            $table->bigInteger('parentId')->default(-1);
            $table->string('title');
            $table->text('description');
            $table->string('link')->default('');
            $table->integer('options')->default(0);
            $table->integer('displayOrder')->default(0);
            $table->bigInteger('lastPostId')->unqiue();
            $table->integer('isDeleted')->default(0);
            $table->string('template')->default('DEFAULT');
            $table->integer('isHidden')->default(0);
            $table->integer('isOpen')->default(1);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');
            $table->string('icon')->nullable();
            $table->integer('xp')->default(0);
            $table->integer('credits')->default(0);

            // Indexes
            $table->index('title');
            $table->index('parentId');
            $table->index('isDeleted');
            $table->index('isHidden');
            $table->index('isOpen');
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
        Schema::dropIfExists('categories');
    }
}
