<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateForumPermissionsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('forum_permissions', function (Blueprint $table) {
            $table->bigInteger('categoryId');
            $table->bigInteger('groupId');
            $table->bigInteger('permissions')->default(0);
            $table->integer('isAuthOnly')->default(0);
            $table->bigInteger('createdAt');
            $table->bigInteger('updatedAt');

            // Indexes
            $table->index('categoryId');
            $table->index('groupId');
            $table->index('permissions');
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
        Schema::dropIfExists('forum_permissions');
    }
}
