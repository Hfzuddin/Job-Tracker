<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_user_can_reset_password_with_valid_email(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('old-password'),
        ]);

        $response = $this->post('/forgot-password', [
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertRedirect(route('login'));

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_reset_fails_when_email_does_not_exist(): void
    {
        $response = $this->post('/forgot-password', [
            'email' => 'nobody@example.com',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_reset_fails_when_confirmation_does_not_match(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/forgot-password', [
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'different-password',
        ]);

        $response->assertSessionHasErrors('password');
    }

    public function test_reset_fails_when_new_password_matches_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('same-password'),
        ]);

        $response = $this->post('/forgot-password', [
            'email' => $user->email,
            'password' => 'same-password',
            'password_confirmation' => 'same-password',
        ]);

        $response->assertSessionHasErrors('password');
    }
}
