<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('type')->default('course')->after('slug');
            $table->json('meta')->nullable()->after('type');
            $table->index(['type', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropIndex(['type', 'is_active']);
            $table->dropColumn(['type', 'meta']);
        });
    }
};
