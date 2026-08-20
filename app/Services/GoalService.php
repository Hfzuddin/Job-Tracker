<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class GoalService
{
    private const MAX_STREAK_LOOKBACK_WEEKS = 104;

    /**
     * @return array{goal: int, current_week_count: int, streak_weeks: int}
     */
    public function progressFor(User $user): array
    {
        $now = Carbon::now();
        $startOfCurrentWeek = $now->clone()->startOfWeek();
        $lookbackStart = $now->clone()->subWeeks(self::MAX_STREAK_LOOKBACK_WEEKS)->startOfWeek();

        $countsByWeek = $user->jobs()
            ->where('date_applied', '>=', $lookbackStart)
            ->pluck('date_applied')
            ->groupBy(fn ($date) => Carbon::parse($date)->startOfWeek()->toDateString())
            ->map->count();

        $goal = $user->weekly_goal ?? 5;

        return [
            'goal' => $goal,
            'current_week_count' => $countsByWeek->get($startOfCurrentWeek->toDateString(), 0),
            'streak_weeks' => $this->countStreak($countsByWeek, $startOfCurrentWeek, $goal),
        ];
    }

    /**
     * Consecutive completed weeks (before the current, still-open week) that met the goal.
     */
    private function countStreak($countsByWeek, Carbon $startOfCurrentWeek, int $goal): int
    {
        if ($goal <= 0) {
            return 0;
        }

        $streak = 0;
        $cursor = $startOfCurrentWeek->clone()->subWeek();

        for ($i = 0; $i < self::MAX_STREAK_LOOKBACK_WEEKS; $i++) {
            $count = $countsByWeek->get($cursor->toDateString(), 0);

            if ($count < $goal) {
                break;
            }

            $streak++;
            $cursor->subWeek();
        }

        return $streak;
    }
}
