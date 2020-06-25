<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThreadTemplatesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::create('thread_templates', function (Blueprint $table) {
            $table->bigIncrements('threadTemplateId');
            $table->string('name');
            $table->text('content');
            $table->string('categoryIds');
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('name');
            $table->index('categoryIds');
            $table->index('isDeleted');
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
        Schema::dropIfExists('thread_templates');
    }
}
