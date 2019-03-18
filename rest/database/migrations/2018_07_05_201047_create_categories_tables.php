<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoriesTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->bigIncrements('categoryId');
            $table->bigInteger('parentId')->default(-1);
            $table->string('title');
            $table->string('description')->default('');
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
    public function down()
    {
        Schema::dropIfExists('categories');
    }
}
