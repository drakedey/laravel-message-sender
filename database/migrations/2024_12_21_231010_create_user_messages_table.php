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
        Schema::create('user_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->nullable(false)
                ->constrained('users')
                ->onDelete('cascade');
            $table->foreignId('message_id')
                ->nullable(false)
                ->constrained('messages')
                ->onDelete('cascade');
            $table->text('status')
                ->nullable(false)
                ->default('SUCCESS');
            $table->timestamp('received_at')
                ->nullable(false)
                ->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_messages');
    }
};