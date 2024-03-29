<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('groups', function (Blueprint $table) {
            $table->increments('groupId');
            $table->string('name')->unique();
            $table->string('nickname')->nullable();
            $table->text('nameColor');
            $table->text('userBarStyling');
            $table->integer('immunity')->default(0);
            $table->integer('sitecpPermissions')->default(0);
            $table->integer('staffPermissions')->default(0);
            $table->integer('isDeleted')->default(0);
            $table->integer('options')->default(0);
            $table->integer('isPublic')->default(0);
            $table->integer('avatarWidth')->default(0);
            $table->integer('avatarHeight')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('immunity');
            $table->index('sitecpPermissions');
            $table->index('staffPermissions');
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
        Schema::dropIfExists('groups');
    }
}
