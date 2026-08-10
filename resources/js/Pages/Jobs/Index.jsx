import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ jobs, filters = {} }) {
    const [platformFilter, setPlatformFilter] = useState(filters.platform || 'all');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get(
                    route('jobs.index'),
                    { platform: platformFilter, search: searchQuery },
                    { preserveState: true, replace: true, preserveScroll: true }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleFilterChange = (value) => {
        setPlatformFilter(value);
        router.get(
            route('jobs.index'),
            { platform: value, search: searchQuery },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };
    const { delete: destroy, processing } = useForm();

    const [confirmingJobDeletion, setConfirmingJobDeletion] = useState(null);

    const confirmJobDeletion = (id) => {
        setConfirmingJobDeletion(id);
    };

    const deleteJob = (e) => {
        e.preventDefault();
        destroy(route('jobs.destroy', confirmingJobDeletion), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        setConfirmingJobDeletion(null);
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
                    Edit / Delete Applications
                </h2>
            }
        >
            <Head title="Edit/Delete Applications" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Manage Your Applications</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search by name or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors duration-200 sm:text-sm px-3 py-1.5 w-full sm:w-64"
                            />
                            <select
                                value={platformFilter}
                                onChange={(e) => handleFilterChange(e.target.value)}
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
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white dark:bg-zinc-900 p-4 shadow sm:rounded-lg sm:p-8 transition-colors duration-200 border border-transparent dark:border-zinc-800">
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
                                                <th className="py-3 px-3 font-semibold w-12 text-center">No.</th>
                                                <th className="py-3 px-3 font-semibold">Company Name</th>
                                                <th className="py-3 px-3 font-semibold">Job Role</th>
                                                <th className="py-3 px-3 font-semibold">Platform</th>
                                                <th className="py-3 px-3 font-semibold">Location</th>
                                                <th className="py-3 px-3 font-semibold whitespace-nowrap">Date Applied</th>
                                                <th className="py-3 px-3 font-semibold">Status</th>
                                                <th className="py-3 px-3 font-semibold text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 text-base">
                                            {jobs.data.map((job, index) => (
                                                <tr key={job.id} className="divide-x divide-gray-200 dark:divide-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition duration-150">
                                                    <td className="py-3 px-3 font-medium text-gray-500 dark:text-gray-400 text-center">
                                                        {(jobs.current_page - 1) * jobs.per_page + index + 1}
                                                    </td>
                                                    <td className="py-3 px-3 font-medium text-gray-900 dark:text-gray-100">{job.company_name}</td>
                                                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{job.job_name}</td>
                                                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{job.platform}</td>
                                                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{job.location || '-'}</td>
                                                    <td className="py-3 px-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{new Date(job.date_applied).toLocaleDateString('en-GB')}</td>
                                                    <td className="py-3 px-3">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize border border-transparent dark:border-current/20 ${statusColors[job.status]}`}>
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3 font-medium flex flex-wrap justify-center gap-2 whitespace-nowrap">
                                                        <Link
                                                            href={route('jobs.edit', job.id)}
                                                            className="inline-flex items-center px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmJobDeletion(job.id)}
                                                            className="inline-flex items-center px-4 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
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

            <Modal show={confirmingJobDeletion !== null} onClose={closeModal}>
                <form onSubmit={deleteJob} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Are you sure you want to delete this job application?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Once this job application is deleted, all of its resources and data will be permanently deleted.
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Delete Job
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
