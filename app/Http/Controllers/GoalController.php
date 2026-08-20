<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'weekly_goal' => 'required|integer|min:1|max:50',
        ]);

        $request->user()->update($validated);

        return back()->with('success', 'Weekly goal updated.');
    }
}
