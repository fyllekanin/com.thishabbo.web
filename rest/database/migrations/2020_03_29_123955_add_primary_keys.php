<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPrimaryKeys extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::table('thread_subscriptions', function (Blueprint $table) {
            $table->bigIncrements('threadSubscriptionId')->first();
        });

        Schema::table('category_subscriptions', function (Blueprint $table) {
            $table->bigIncrements('categorySubscriptionId')->first();
        });

        Schema::table('ignored_categories', function (Blueprint $table) {
            $table->bigIncrements('ignoredCategoryId')->first();
        });

        Schema::table('ignored_threads', function (Blueprint $table) {
            $table->bigIncrements('ignoredThreadId')->first();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down () {
        //
    }
}
