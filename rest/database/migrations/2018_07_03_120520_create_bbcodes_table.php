<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBbcodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bbcodes', function (Blueprint $table) {
            $table->bigIncrements('bbcodeId');
            $table->string('name');
            $table->string('example')->nullable();
            $table->text('pattern');
            $table->text('replace')->nullable();
            $table->text('content')->nullable();
            $table->integer('isEmoji')->default(0);
            $table->integer('isSystem')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

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
        Schema::dropIfExists('bbcodes');
    }
}
