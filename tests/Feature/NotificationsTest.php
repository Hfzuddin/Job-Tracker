<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_stale_applications_are_shared_as_notifications_on_any_authenticated_page(): void
    {
        $user = User::factory()->create();

        $stale = $user->jobs()->create([
            'company_name' => 'Stale Co',
            'job_name' => 'Engineer',
            'platform' => 'LinkedIn',
            'date_applied' => now()->subDays(10),
            'status' => 'applied',
        ]);

        // Recently applied — too soon for a follow-up.
        $user->jobs()->create([
            'company_name' => 'Fresh Co',
            'job_name' => 'Engineer',
            'platform' => 'LinkedIn',
            'date_applied' => now()->subDays(2),
            'status' => 'applied',
        ]);

        // Old but already past the "applied/reviewed" stage — no follow-up needed.
        $user->jobs()->create([
            'company_name' => 'Progressed Co',
            'job_name' => 'Engineer',
            'platform' => 'LinkedIn',
            'date_applied' => now()->subDays(10),
            'status' => 'interview',
        ]);

        // Notifications are shared middleware data, so any authenticated route carries them —
        // not just the dashboard.
        $response = $this->actingAs($user)->get('/jobs');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('notifications', 1)
            ->where('notifications.0.id', $stale->id)
            ->where('notifications.0.company_name', 'Stale Co')
            ->where('notifications.0.days_since_applied', 10)
        );
    }

    public function test_no_notifications_when_nothing_is_stale(): void
    {
        $user = User::factory()->create();

        $user->jobs()->create([
            'company_name' => 'Fresh Co',
            'job_name' => 'Engineer',
            'platform' => 'LinkedIn',
            'date_applied' => now()->subDays(1),
            'status' => 'applied',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('notifications', 0));
    }

    public function test_guests_receive_no_notifications(): void
    {
        $response = $this->get('/login');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('notifications', 0));
    }
}
