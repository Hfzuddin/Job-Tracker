<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // job_applications was dropped by the 2026_08_08_232426 migration on fresh installs;
        // this migration only applies to older databases where the table still exists.
        if (! Schema::hasTable('job_applications')) {
            return;
        }

        Schema::table('job_applications', function (Blueprint $table) {
            // Add user_id foreign key (nullable to allow existing rows)
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();

            // Add platform field (LinkedIn, Indeed, Glassdoor, etc.)
            $table->string('platform')->nullable()->after('user_id');

            // Add job_name field (replacing company + position)
            $table->string('job_name')->nullable()->after('platform');
        });

        // Update status enum to: applied, reviewed, interview, offer, rejected
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            // Clear old data with statuses that no longer exist
            Schema::getConnection()->statement(
                "UPDATE job_applications SET status = 'applied' WHERE status NOT IN ('applied','reviewed','interview','offer','rejected')"
            );
            Schema::getConnection()->statement(
                "ALTER TABLE job_applications MODIFY status ENUM('applied','reviewed','interview','offer','rejected') NOT NULL DEFAULT 'applied'"
            );
        }

        // Drop old fields no longer needed
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['company', 'position', 'location', 'job_url', 'salary']);
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            // Re-add old columns
            $table->string('company')->nullable();
            $table->string('position')->nullable();
            $table->string('location')->nullable();
            $table->string('job_url')->nullable();
            $table->decimal('salary', 12, 2)->nullable();
        });

        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'platform', 'job_name']);
        });

        if (Schema::getConnection()->getDriverName() === 'mysql') {
            Schema::getConnection()->statement(
                "ALTER TABLE job_applications MODIFY status ENUM('applied','interview','offer','rejected','accepted') NOT NULL DEFAULT 'applied'"
            );
        }
    }
};
