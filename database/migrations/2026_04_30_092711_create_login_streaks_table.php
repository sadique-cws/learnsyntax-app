<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('login_streaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('login_date')->index();
            $table->integer('current_streak')->default(1);
            $table->integer('longest_streak')->default(1);
            $table->timestamps();

            $table->unique(['user_id', 'login_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_streaks');
    }
};
