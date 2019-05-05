<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTokensTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('tokens', function (Blueprint $table) {
            $table->string('ip');
            $table->integer('userId');
            $table->string('accessToken')->unique();
            $table->string('refreshToken')->unique();
            $table->bigInteger('expiresAt');

            // Indexes
            $table->index('userId');
            $table->index('ip');
            $table->index('accessToken');
            $table->index('refreshToken');
            $table->index('expiresAt');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('tokens');
    }
}
