<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->jobs();

        if ($request->filled('platform') && $request->platform !== 'all') {
            $query->where('platform', $request->platform);
        }

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('company_name', 'like', $searchTerm)
                  ->orWhere('job_name', 'like', $searchTerm);
            });
        }

        $jobs = $query->orderBy('date_applied', 'desc')->paginate(10)->withQueryString();
        
        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'filters' => [
                'platform' => $request->input('platform', 'all'),
                'search' => $request->input('search', ''),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Jobs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'job_name' => 'required|string|max:255',
            'platform' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'date_applied' => 'required|date',
            'status' => 'required|in:applied,reviewed,interview,offer,rejected,ghosted',
        ]);

        $request->user()->jobs()->create($validated);

        return redirect()->route('dashboard')->with('success', 'Job application added successfully.');
    }

    public function edit(Job $job)
    {
        Gate::authorize('update', $job);

        return Inertia::render('Jobs/Edit', [
            'job' => $job
        ]);
    }

    public function update(Request $request, Job $job)
    {
        Gate::authorize('update', $job);

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'job_name' => 'required|string|max:255',
            'platform' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'date_applied' => 'required|date',
            'status' => 'required|in:applied,reviewed,interview,offer,rejected,ghosted',
        ]);

        $job->update($validated);

        return redirect()->route('dashboard')->with('success', 'Job application updated successfully.');
    }

    public function destroy(Job $job)
    {
        Gate::authorize('delete', $job);

        $job->delete();

        return redirect()->route('dashboard')->with('success', 'Job application deleted successfully.');
    }
}
