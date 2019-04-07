<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVoucherCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('voucher_codes', function (Blueprint $table) {
            $table->bigIncrements('voucherCodeId');
            $table->string('code');
            $table->string('note');
            $table->integer('value');
            $table->integer('isDeleted')->default(0);
            $table->integer('isActive')->default(1);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            $table->index('code');
            $table->index('note');
            $table->index('value');
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
    public function down()
    {
        Schema::dropIfExists('voucher_codes');
    }
}
