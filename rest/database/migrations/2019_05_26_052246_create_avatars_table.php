<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAvatarsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('avatars', function (Blueprint $table) {
            $table->bigIncrements('avatarId');
            $table->bigInteger('userId');
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('avatars');
    }
}
