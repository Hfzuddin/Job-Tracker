<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WeeklyGoalProgressTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_progress_increases_as_the_user_submits_applications(): void
    {
        $user = User::factory()->create(['weekly_goal' => 3]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertInertia(fn ($page) => $page
            ->where('goal.goal', 3)
            ->where('goal.current_week_count', 0)
        );

        $this->actingAs($user)->post('/jobs', [
            'company_name' => 'Acme',
            'job_name' => 'Engineer',
            'platform' => 'LinkedIn',
            'date_applied' => now()->toDateString(),
            'status' => 'applied',
        ])->assertRedirect(route('dashboard'));

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertInertia(fn ($page) => $page
            ->where('goal.goal', 3)
            ->where('goal.current_week_count', 1)
        );

        $this->actingAs($user)->post('/jobs', [
            'company_name' => 'Globex',
            'job_name' => 'Developer',
            'platform' => 'Indeed',
            'date_applied' => now()->toDateString(),
            'status' => 'applied',
        ])->assertRedirect(route('dashboard'));

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertInertia(fn ($page) => $page
            ->where('goal.goal', 3)
            ->where('goal.current_week_count', 2)
        );
    }

    public function test_changing_the_weekly_goal_is_reflected_on_the_dashboard(): void
    {
        $user = User::factory()->create(['weekly_goal' => 5]);

        $this->actingAs($user)->patch('/goal', ['weekly_goal' => 8])
            ->assertSessionHasNoErrors();

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertInertia(fn ($page) => $page->where('goal.goal', 8));
    }
}
