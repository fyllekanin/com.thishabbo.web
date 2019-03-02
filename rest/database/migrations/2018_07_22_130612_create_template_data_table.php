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
    public function up () {
        Schema::create('template_data', function (Blueprint $table) {
            $table->bigIncrements('templateDataId');
            $table->bigInteger('threadId');
            $table->string('badge');
            $table->string('tags');

            // Indexes
            $table->index('threadId');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down () {
        Schema::dropIfExists('template_data');
    }
}
