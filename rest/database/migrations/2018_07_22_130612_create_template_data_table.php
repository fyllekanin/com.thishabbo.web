<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplatedataTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('template_data', function (Blueprint $table) {
            $table->bigIncrements('templateDataId');
            $table->bigInteger('threadId');
            $table->string('badge')->default('');
            $table->string('tags')->default('');
            $table->string('roomLink')->default('');
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('threadId');
            $table->index('badge');
            $table->index('tags');
            $table->index('roomLink');
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
        Schema::dropIfExists('template_data');
    }
}
