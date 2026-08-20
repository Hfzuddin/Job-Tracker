<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $rows = $request->user()->jobs()
            ->selectRaw('platform, status, count(*) as count')
            ->groupBy('platform', 'status')
            ->get();

        $platforms = $rows->groupBy('platform')->map(function ($group, $platform) {
            $counts = $group->pluck('count', 'status');
            $total = (int) $counts->sum();
            $interviewed = ($counts['interview'] ?? 0) + ($counts['offer'] ?? 0);
            $offers = $counts['offer'] ?? 0;
            $rejected = $counts['rejected'] ?? 0;
            $ghosted = $counts['ghosted'] ?? 0;

            return [
                'platform' => $platform,
                'total' => $total,
                'interview_rate' => $total > 0 ? round($interviewed / $total * 100, 1) : 0,
                'offer_rate' => $total > 0 ? round($offers / $total * 100, 1) : 0,
                'rejection_rate' => $total > 0 ? round($rejected / $total * 100, 1) : 0,
                'ghosted_rate' => $total > 0 ? round($ghosted / $total * 100, 1) : 0,
            ];
        })->sortByDesc('interview_rate')->values();

        return Inertia::render('Analytics/Index', [
            'platforms' => $platforms,
            'totalApplications' => (int) $rows->sum('count'),
        ]);
    }
}
