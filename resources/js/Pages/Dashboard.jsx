import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AnimatedProgressCard } from '@/Components/ui/progress-card';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ jobs, goal, filters = {} }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [platformFilter, setPlatformFilter] = useState(filters.platform || 'all');
    const [dateOrder, setDateOrder] = useState(filters.date_order || 'desc');
    const [editingGoal, setEditingGoal] = useState(false);
    const [goalInput, setGoalInput] = useState(goal?.goal ?? 5);

    const saveGoal = (e) => {
        e.preventDefault();
        router.patch(route('goal.update'), { weekly_goal: goalInput }, {
            preserveScroll: true,
            onSuccess: () => setEditingGoal(false),
        });
    };

    const handleFilterChange = (key, value) => {
        if (key === 'status') setStatusFilter(value);
        if (key === 'platform') setPlatformFilter(value);
        if (key === 'date_order') setDateOrder(value);

        router.get(
            route('dashboard'),
            {
                status: key === 'status' ? value : statusFilter,
                platform: key === 'platform' ? value : platformFilter,
                date_order: key === 'date_order' ? value : dateOrder,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            }
        );
    };
    const statusColors = {
        applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        reviewed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        offer: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        ghosted: 'bg-gray-100 text-gray-800 dark:bg-gray-800/80 dark:text-gray-400',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white transition-colors">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {goal && (
                        <div className="relative mb-4">
                            <AnimatedProgressCard
                                className="w-full"
                                title="Weekly Goal"
                                icon={
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                }
                                progressLabel="Applications"
                                progressSubLabel={
                                    goal.streak_weeks > 0
                                        ? `🔥 ${goal.streak_weeks} week${goal.streak_weeks === 1 ? '' : 's'} streak`
                                        : 'This week'
                                }
                                currentValue={goal.current_week_count}
                                maxValue={goal.goal}
                            />

                            <div className="absolute top-6 right-6">
                                {editingGoal ? (
                                    <form onSubmit={saveGoal} className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={goalInput}
                                            onChange={(e) => setGoalInput(e.target.value)}
                                            className="w-16 rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 sm:text-sm px-2 py-1"
                                        />
                                        <button type="submit" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                            Save
                                        </button>
                                        <button type="button" onClick={() => setEditingGoal(false)} className="text-xs text-gray-400 hover:underline">
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => { setGoalInput(goal.goal); setEditingGoal(true); }}
                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Edit goal
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Your Applications</h3>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors duration-200 sm:text-sm px-3 py-1.5"
                            >
                                <option value="all">Status: All</option>
                                <option value="applied">Applied</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="interview">Interviewing</option>
                                <option value="offer">Offer Received</option>
                                <option value="ghosted">Ghosted</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <select
                                value={platformFilter}
                                onChange={(e) => handleFilterChange('platform', e.target.value)}
                                className="rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors duration-200 sm:text-sm px-3 py-1.5"
                            >
                                <option value="all">Platform: All</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Indeed">Indeed</option>
                                <option value="Glassdoor">Glassdoor</option>
                                <option value="Jobstreet">Jobstreet</option>
                                <option value="MauKerja">MauKerja</option>
                                <option value="Fast Gig">Fast Gig</option>
                                <option value="MyFutureJobs">MyFutureJobs</option>
                                <option value="FastJobs">FastJobs</option>
                                <option value="Prosple">Prosple</option>
                                <option value="Troopers">Troopers</option>
                                <option value="Hiredly">Hiredly</option>
                                <option value="Company Website">Company Website</option>
                                <option value="Email">Email</option>
                                <option value="Referral">Referral</option>
                                <option value="Other">Other</option>
                            </select>

                            <select
                                value={dateOrder}
                                onChange={(e) => handleFilterChange('date_order', e.target.value)}
                                className="rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors duration-200 sm:text-sm px-6.5 py-1"
                            >
                                <option value="desc">Date: Newest</option>
                                <option value="asc">Date: Oldest</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white dark:bg-zinc-900 p-4 shadow-md sm:rounded-lg sm:p-8 transition-colors duration-200 border border-transparent dark:border-zinc-800">
                        <div className="p-0 text-gray-900 dark:text-gray-100">
                            {jobs.data.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">No job applications tracked yet.</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start adding jobs to monitor your progress!</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto border border-gray-200 dark:border-zinc-800 sm:rounded-lg">
                                    <table className="w-full text-left border-collapse divide-y divide-gray-200 dark:divide-zinc-800">
                                        <thead>
                                            <tr className="divide-x divide-gray-200 dark:divide-zinc-800 text-sm tracking-wider uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-900/50">
                                                <th className="py-4 px-6 font-semibold w-16 text-center">No.</th>
                                                <th className="py-4 px-6 font-semibold">Company Name</th>
                                                <th className="py-4 px-6 font-semibold">Job Role</th>
                                                <th className="py-4 px-6 font-semibold">Platform</th>
                                                <th className="py-4 px-6 font-semibold">Location</th>
                                                <th className="py-4 px-6 font-semibold">Date Applied</th>
                                                <th className="py-4 px-6 font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                            {jobs.data.map((job, index) => (
                                                <tr key={job.id} className="divide-x divide-gray-200 dark:divide-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition duration-150">
                                                    <td className="py-4 px-6 font-medium text-gray-500 dark:text-gray-400 text-center">
                                                        {(jobs.current_page - 1) * jobs.per_page + index + 1}
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">{job.company_name}</td>
                                                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{job.job_name}</td>
                                                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{job.platform}</td>
                                                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{job.location || '-'}</td>
                                                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{new Date(job.date_applied).toLocaleDateString('en-GB')}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize border border-transparent dark:border-current/20 ${statusColors[job.status]}`}>
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {jobs.data.length > 0 && jobs.links.length > 3 && (
                                <div className="mt-6 flex flex-wrap justify-center gap-1 sm:gap-2">
                                    {jobs.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-1 sm:px-4 sm:py-2 text-sm border rounded-md transition-colors ${link.active
                                                    ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="px-3 py-1 sm:px-4 sm:py-2 text-sm border rounded-md bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
