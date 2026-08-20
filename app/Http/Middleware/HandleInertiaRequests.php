<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'notifications' => $request->user()
                ? $request->user()->jobs()
                    ->needsFollowUp()
                    ->orderBy('date_applied')
                    ->get()
                    ->map(fn ($job) => [
                        'id' => $job->id,
                        'company_name' => $job->company_name,
                        'job_name' => $job->job_name,
                        'status' => $job->status,
                        'days_since_applied' => (int) abs(now()->diffInDays($job->date_applied)),
                    ])
                : [],
        ];
    }
}
