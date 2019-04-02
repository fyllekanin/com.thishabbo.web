<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLaravelLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('laravel_logs', function (Blueprint $table) {
            $table->bigIncrements('laravelLogId');
            $table->longText('message');
            $table->string('code');
            $table->longText('file');
            $table->string('line');
            $table->longText('trace');
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('laravel_logs');
    }
}
