<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHabboBadgesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('habbo_badges', function (Blueprint $table) {
            $table->string('habboBadgeId')->unique();
            $table->string('description');
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
    public function down() {
        Schema::dropIfExists('habbo_badges');
    }
}
