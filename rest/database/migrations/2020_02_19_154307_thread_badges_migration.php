<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ThreadBadgesMigration extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up () {
        Schema::table('template_data', function (Blueprint $table) {
            $table->renameColumn('badge', 'badges');
        });
        DB::table('template_data')->get()->each(function ($item) {
            $data = $item->badges ? explode(',', $item->badges) : [];
            DB::table('template_data')->where('templateDataId', $item->templateDataId)->update(['badges' => json_encode($data)]);
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
