<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('daily_learning_logs', function (Blueprint $table) {
            $table->string('video_url')->nullable()->after('remarks');
        });
    }

    public function down(): void
    {
        Schema::table('daily_learning_logs', function (Blueprint $table) {
            $table->dropColumn('video_url');
        });
    }
};
