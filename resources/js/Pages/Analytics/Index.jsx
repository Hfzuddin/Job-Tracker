import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Analytics({ platforms, totalApplications }) {
    const maxInterviewRate = Math.max(...platforms.map((p) => p.interview_rate), 1);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-white transition-colors">
                    Platform Effectiveness
                </h2>
            }
        >
            <Head title="Analytics" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Which platform gets you the furthest?
                        </h3>
                    </div>

                    <div className="overflow-hidden bg-white dark:bg-zinc-900 p-4 shadow-md sm:rounded-lg sm:p-8 transition-colors duration-200 border border-transparent dark:border-zinc-800">
                        {totalApplications === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">No data yet.</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                    Add a few job applications to see which platforms work best for you.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {platforms.map((p, index) => (
                                    <div
                                        key={p.platform}
                                        className="rounded-lg border border-gray-200 dark:border-zinc-800 p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {p.platform}
                                                </span>
                                                {index === 0 && p.total >= 2 && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                        Most Effective
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {p.total} application{p.total === 1 ? '' : 's'}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                <span>Interview rate</span>
                                                <span className="font-semibold text-gray-700 dark:text-gray-200">{p.interview_rate}%</span>
                                            </div>
                                            <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                                                    style={{ width: `${(p.interview_rate / maxInterviewRate) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                Offer {p.offer_rate}%
                                            </span>
                                            <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                                Rejected {p.rejection_rate}%
                                            </span>
                                            <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:text-gray-400">
                                                Ghosted {p.ghosted_rate}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
