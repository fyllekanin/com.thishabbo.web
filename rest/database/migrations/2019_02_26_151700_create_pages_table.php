<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('pages', function (Blueprint $table) {
            $table->bigIncrements('pageId');
            $table->string('path');
            $table->string('title');
            $table->text('content');
            $table->integer('isDeleted')->default(0);
            $table->integer('isSystem')->default(0);
            $table->integer('canEdit')->default(1);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('path');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('pages');
    }
}
