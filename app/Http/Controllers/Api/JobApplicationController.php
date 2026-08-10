<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobApplicationController extends Controller
{
    // GET /api/job-applications?status=applied&search=google
    public function index(Request $request)
    {
        $query = $request->user()->jobApplications();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('job_name', 'like', "%{$search}%")
                  ->orWhere('platform', 'like', "%{$search}%");
            });
        }

        $jobs = $query->orderBy('applied_date', 'desc')->get();

        return response()->json([
            'data' => $jobs,
        ]);
    }

    // GET /api/job-applications/stats
    public function stats(Request $request)
    {
        $stats = $request->user()->jobApplications()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        // Make sure all statuses appear even if count is 0
        $result = [];
        foreach (JobApplication::STATUSES as $status) {
            $result[$status] = $stats[$status] ?? 0;
        }

        return response()->json([
            'data'  => $result,
            'total' => $request->user()->jobApplications()->count(),
        ]);
    }

    // POST /api/job-applications
    public function store(Request $request)
    {
        $validator = $this->validateData($request);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = $request->user()->jobApplications()->create($validator->validated());

        return response()->json(['data' => $job], 201);
    }

    // GET /api/job-applications/{jobApplication}
    public function show(Request $request, JobApplication $jobApplication)
    {
        $this->authorizeOwner($request, $jobApplication);
        return response()->json(['data' => $jobApplication]);
    }

    // PUT/PATCH /api/job-applications/{jobApplication}
    public function update(Request $request, JobApplication $jobApplication)
    {
        $this->authorizeOwner($request, $jobApplication);

        $validator = $this->validateData($request, $jobApplication->id);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobApplication->update($validator->validated());

        return response()->json(['data' => $jobApplication]);
    }

    // DELETE /api/job-applications/{jobApplication}
    public function destroy(Request $request, JobApplication $jobApplication)
    {
        $this->authorizeOwner($request, $jobApplication);
        $jobApplication->delete();

        return response()->json(['message' => 'Job application deleted successfully']);
    }

    private function authorizeOwner(Request $request, JobApplication $jobApplication)
    {
        if ($jobApplication->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }
    }

    private function validateData(Request $request, $id = null)
    {
        return Validator::make($request->all(), [
            'job_name'     => 'required|string|max:255',
            'platform'     => 'nullable|string|max:255',
            'status'       => 'required|in:' . implode(',', JobApplication::STATUSES),
            'applied_date' => 'required|date',
            'notes'        => 'nullable|string',
        ]);
    }
}
