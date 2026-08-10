<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->string('company');
            $table->string('position');
            $table->enum('status', ['applied', 'interview', 'offer', 'rejected', 'accepted'])
                  ->default('applied');
            $table->date('applied_date');
            $table->string('location')->nullable();
            $table->string('job_url')->nullable();
            $table->decimal('salary', 12, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
