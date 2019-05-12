<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubscriptionsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->bigIncrements('subscriptionId');
            $table->string('title');
            $table->integer('avatarWidth')->default(0);
            $table->integer('avatarHeight')->default(0);
            $table->integer('credits')->default(0);
            $table->integer('pounds')->default(0);
            $table->bigInteger('options')->default(0);
            $table->integer('isDeleted')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('title');
            $table->index('avatarWidth');
            $table->index('avatarHeight');
            $table->index('options');
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
    public function down() {
        Schema::dropIfExists('subscriptions');
    }
}
