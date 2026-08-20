<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_analytics_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/analytics');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Analytics/Index')
            ->where('totalApplications', 0)
            ->where('platforms', [])
        );
    }

    public function test_platform_effectiveness_is_calculated_correctly(): void
    {
        $user = User::factory()->create();

        $jobs = [
            ['LinkedIn', 'applied'],
            ['LinkedIn', 'interview'],
            ['LinkedIn', 'offer'],
            ['LinkedIn', 'rejected'],
            ['Indeed', 'applied'],
            ['Indeed', 'rejected'],
            ['Indeed', 'rejected'],
        ];

        foreach ($jobs as [$platform, $status]) {
            $user->jobs()->create([
                'company_name' => 'Acme',
                'job_name' => 'Engineer',
                'platform' => $platform,
                'date_applied' => now(),
                'status' => $status,
            ]);
        }

        $response = $this->actingAs($user)->get('/analytics');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Analytics/Index')
            ->where('totalApplications', 7)
            ->where('platforms.0.platform', 'LinkedIn')
            ->where('platforms.0.total', 4)
            ->where('platforms.0.interview_rate', 50)
            ->where('platforms.0.offer_rate', 25)
            ->where('platforms.1.platform', 'Indeed')
            ->where('platforms.1.total', 3)
            ->where('platforms.1.interview_rate', 0)
            ->where('platforms.1.rejection_rate', 66.7)
            ->where('platforms.1.ghosted_rate', 0)
        );
    }

    public function test_analytics_only_shows_the_authenticated_users_jobs(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $otherUser->jobs()->create([
            'company_name' => 'Other Co',
            'job_name' => 'Engineer',
            'platform' => 'LinkedIn',
            'date_applied' => now(),
            'status' => 'offer',
        ]);

        $response = $this->actingAs($user)->get('/analytics');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Analytics/Index')
            ->where('totalApplications', 0)
        );
    }
}
