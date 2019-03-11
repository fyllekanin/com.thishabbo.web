<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUseritemsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::create('user_items', function (Blueprint $table) {
            $table->bigIncrements('userItemId');
            $table->integer('type');
            $table->bigInteger('userId');
            $table->bigInteger('itemId');
            $table->integer('isActive')->default(0);
            $table->string('data1')->nullable();
            $table->string('data2')->nullable();
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('type');
            $table->index('userId');
            $table->index('itemId');
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
        Schema::dropIfExists('user_items');
    }
}
