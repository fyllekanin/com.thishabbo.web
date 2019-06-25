<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLootBoxesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('loot_boxes', function (Blueprint $table) {
            $table->bigIncrements('lootBoxId');
            $table->string('title');
            $table->text('items');
            $table->integer('animation');
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('title');
            $table->index('isDeleted');
            $table->index('animation');
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
        Schema::dropIfExists('loot_boxes');
    }
}
