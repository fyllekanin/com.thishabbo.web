<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserProfileTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('user_profile', function (Blueprint $table) {
            $table->bigIncrements('userProfileId');
            $table->bigInteger('userId')->unique();
            $table->string('youtube')->nullable();
            $table->integer('isPrivate')->default(false);
            $table->bigInteger('love')->nullable();
            $table->bigInteger('like')->nullable();
            $table->bigInteger('hate')->nullable();
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
        Schema::dropIfExists('user_profile');
    }
}
