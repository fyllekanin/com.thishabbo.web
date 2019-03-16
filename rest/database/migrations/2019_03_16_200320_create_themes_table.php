<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateThemesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->bigIncrements('themeId');
            $table->string('title');
            $table->integer('isDefault')->default(0);
            $table->longText('minified');
            $table->longText('css');
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('title');
            $table->index('isDefault');
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
    public function down()
    {
        Schema::dropIfExists('themes');
    }
}
