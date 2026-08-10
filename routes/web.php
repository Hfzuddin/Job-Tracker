<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
    $query = auth()->user()->jobs();

    if ($request->filled('status') && $request->status !== 'all') {
        $query->where('status', $request->status);
    }

    if ($request->filled('platform') && $request->platform !== 'all') {
        $query->where('platform', $request->platform);
    }

    $direction = $request->input('date_order', 'desc');
    if (!in_array($direction, ['asc', 'desc'])) {
        $direction = 'desc';
    }
    
    $jobs = $query->orderBy('date_applied', $direction)->paginate(10)->withQueryString();

    return Inertia::render('Dashboard', [
        'jobs' => $jobs,
        'filters' => [
            'status' => $request->input('status', 'all'),
            'platform' => $request->input('platform', 'all'),
            'date_order' => $direction,
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('jobs', \App\Http\Controllers\JobController::class)->except(['show']);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/password', [ProfileController::class, 'password'])->name('profile.password');
    Route::get('/profile/delete', [ProfileController::class, 'delete'])->name('profile.delete');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
