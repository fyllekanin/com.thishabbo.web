<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserSubscriptionsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('user_subscriptions', function (Blueprint $table) {
            $table->bigIncrements('userSubscriptionId');
            $table->bigInteger('subscriptionId');
            $table->bigInteger('userId');
            $table->bigInteger('expiresAt');
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');
        });
    }

    /**
     * Reverse the migrations.
     *git
     * @return void
     */
    public function down() {
        Schema::dropIfExists('user_subscriptions');
    }
}
