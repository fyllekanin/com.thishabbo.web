<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccoladesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('accolades', function (Blueprint $table) {
            $table->bigIncrements('accoladeId');
            $table->bigInteger('userId');
            $table->string('role');
            $table->bigInteger('start');
            $table->bigInteger('end')->nullable();
            $table->integer('type');
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('userId');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('accolades');
    }
}
