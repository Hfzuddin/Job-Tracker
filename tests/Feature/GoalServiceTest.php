<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\GoalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GoalServiceTest extends TestCase
{
    use RefreshDatabase;

    private function createJobsOnDates(User $user, array $dates): void
    {
        foreach ($dates as $date) {
            $user->jobs()->create([
                'company_name' => 'Acme',
                'job_name' => 'Engineer',
                'platform' => 'LinkedIn',
                'date_applied' => $date,
                'status' => 'applied',
            ]);
        }
    }

    public function test_current_week_count_reflects_applications_this_week(): void
    {
        $user = User::factory()->create(['weekly_goal' => 3]);

        $this->createJobsOnDates($user, [
            now()->startOfWeek(),
            now()->startOfWeek()->addDay(),
        ]);

        // Last week — should not count toward this week's progress.
        $this->createJobsOnDates($user, [now()->subWeek()]);

        $progress = (new GoalService())->progressFor($user);

        $this->assertSame(3, $progress['goal']);
        $this->assertSame(2, $progress['current_week_count']);
    }

    public function test_streak_counts_consecutive_completed_weeks_meeting_goal(): void
    {
        $user = User::factory()->create(['weekly_goal' => 2]);

        // Last week and the week before: 2 applications each (meets goal of 2).
        $this->createJobsOnDates($user, [
            now()->subWeek()->startOfWeek(),
            now()->subWeek()->startOfWeek()->addDay(),
            now()->subWeeks(2)->startOfWeek(),
            now()->subWeeks(2)->startOfWeek()->addDay(),
        ]);

        // Three weeks ago: only 1 application — breaks the streak.
        $this->createJobsOnDates($user, [now()->subWeeks(3)->startOfWeek()]);

        $progress = (new GoalService())->progressFor($user);

        $this->assertSame(2, $progress['streak_weeks']);
    }

    public function test_streak_is_zero_when_last_week_missed_the_goal(): void
    {
        $user = User::factory()->create(['weekly_goal' => 5]);

        $this->createJobsOnDates($user, [now()->subWeek()->startOfWeek()]);

        $progress = (new GoalService())->progressFor($user);

        $this->assertSame(0, $progress['streak_weeks']);
    }

    public function test_streak_is_zero_for_a_brand_new_user_with_no_applications(): void
    {
        // Reload from the DB so the weekly_goal column default (5) is populated,
        // matching how a real request loads the authenticated user.
        $user = User::factory()->create()->fresh();

        $progress = (new GoalService())->progressFor($user);

        $this->assertSame(0, $progress['current_week_count']);
        $this->assertSame(0, $progress['streak_weeks']);
    }
}
