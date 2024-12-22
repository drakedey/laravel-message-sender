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
        Schema::create('message_files', function (Blueprint $table) {
            $table->id();
            $table->text('file_name')
                ->nullable(false);
            $table->text('file_content')
                ->nullable(false);
            $table->text('file_type')
                ->nullable(false);
            $table->foreignId('message_id')
                ->unique('message_files_message_id_unique')
                ->nullable(false)
                ->constrained('messages')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_files');
    }
};
