<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTimetableTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::create('timetable', function (Blueprint $table) {
            $table->increments('timetableId');
            $table->bigInteger('userId');
            $table->integer('day');
            $table->integer('hour');
            $table->integer('isPerm');
            $table->integer('type');
            $table->integer('isActive')->default(1);
            $table->integer('eventId')->default(0);
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('userId');
            $table->index('isPerm');
            $table->index('isActive');
            $table->index('eventId');
            $table->index('type');
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
        Schema::dropIfExists('timetable');
    }
}
