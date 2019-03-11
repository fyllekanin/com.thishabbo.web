<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('userId');
            $table->string('username')->unique();
            $table->string('nickname')->unique();
            $table->string('password');
            $table->integer('displayGroupId')->default(0);
            $table->bigInteger('referralId')->default(0);
            $table->integer('gdpr')->default(0);

            // Stats
            $table->integer('likes')->default(0);
            $table->integer('posts')->default(0);
            $table->integer('threads')->default(0);
            $table->integer('ignoredNotifications')->default(0);

            // Dates
            $table->bigInteger('lastActivity')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('referralId');
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
        Schema::dropIfExists('users');
    }
}
