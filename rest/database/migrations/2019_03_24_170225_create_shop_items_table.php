<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopItemsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('shop_items', function (Blueprint $table) {
            $table->bigIncrements('shopItemId');
            $table->string('title');
            $table->string('description');
            $table->integer('rarity');
            $table->integer('type');
            $table->integer('isDeleted')->default(0);
            $table->text('data');
            $table->bigInteger('createdBy')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('title');
            $table->index('rarity');
            $table->index('type');
            $table->index('isDeleted');
            $table->index('createdBy');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('shop_items');
    }
}
