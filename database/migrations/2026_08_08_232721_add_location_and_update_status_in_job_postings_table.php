<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->string('location')->nullable()->after('platform');
        });

        // Update the ENUM to include 'ghosted'
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE job_postings MODIFY status ENUM('applied', 'reviewed', 'interview', 'offer', 'rejected', 'ghosted') NOT NULL DEFAULT 'applied'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            // Clean up any ghosted jobs (revert to rejected or applied)
            DB::statement("UPDATE job_postings SET status = 'rejected' WHERE status = 'ghosted'");
            DB::statement("ALTER TABLE job_postings MODIFY status ENUM('applied', 'reviewed', 'interview', 'offer', 'rejected') NOT NULL DEFAULT 'applied'");
        }

        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
