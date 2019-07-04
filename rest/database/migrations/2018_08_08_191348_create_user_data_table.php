<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserdataTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('userdata', function (Blueprint $table) {
            $table->bigIncrements('userdataId');
            $table->bigInteger('userId')->unique();
            $table->text('signature')->nullable();

            $table->text('nameColor')->nullable();
            $table->integer('namePosition')->default(0);
            $table->integer('iconId')->nullable();
            $table->string('iconPosition')->nullable();
            $table->integer('effectId')->nullable();

            $table->bigInteger('postBit')->default(0);
            $table->bigInteger('avatarUpdatedAt')->default(0);
            $table->bigInteger('credits')->default(0);
            $table->bigInteger('xp')->default(0);
            $table->string('homePage')->nullable();
            $table->string('discord')->nullable();
            $table->string('twitter')->nullable();
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');
            $table->string('activeBadges')->nullable();

            $table->index('createdAt');
            $table->index('updatedAt');
            $table->index('credits');
            $table->index('postBit');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('userdata');
    }
}
