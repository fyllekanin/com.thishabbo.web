<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTimetableDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('timetable_data', function (Blueprint $table) {
            $table->bigIncrements('timetableDataId');
            $table->bigInteger('timetableId');
            $table->string('name');
            $table->string('description');
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('timetableId');
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
        Schema::dropIfExists('timetable_data');
    }
}
