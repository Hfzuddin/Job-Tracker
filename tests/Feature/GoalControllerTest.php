<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GoalControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_their_weekly_goal(): void
    {
        $user = User::factory()->create(['weekly_goal' => 5]);

        $response = $this->actingAs($user)->patch('/goal', ['weekly_goal' => 10]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        $this->assertSame(10, $user->fresh()->weekly_goal);
    }

    public function test_weekly_goal_must_be_a_positive_integer(): void
    {
        $user = User::factory()->create(['weekly_goal' => 5]);

        $response = $this->actingAs($user)->patch('/goal', ['weekly_goal' => 0]);

        $response->assertSessionHasErrors('weekly_goal');
        $this->assertSame(5, $user->fresh()->weekly_goal);
    }
}
