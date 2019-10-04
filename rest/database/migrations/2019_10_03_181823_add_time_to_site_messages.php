<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTimeToSiteMessages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('site_messages', function (Blueprint $table) {
            $table->bigInteger('expiresAt')->default(0);
            $table->dropColumn('isActive');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('site_messages', function (Blueprint $table) {
            $table->dropColumn('expiresAt');
        });
    }
}
