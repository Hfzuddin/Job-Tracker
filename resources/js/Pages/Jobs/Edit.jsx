import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, job }) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: job.company_name || '',
        job_name: job.job_name || '',
        platform: job.platform || '',
        location: job.location || '',
        date_applied: job.date_applied || '',
        status: job.status || 'applied',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('jobs.update', job.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-white leading-tight transition-colors">Edit Job Application</h2>}
        >
            <Head title="Edit Job" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 p-4 shadow sm:rounded-lg sm:p-8 border border-transparent dark:border-zinc-800 transition-colors duration-200">
                        <section className="max-w-4xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Job Details
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Update the information for the job you have applied to.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="company_name" value="Company Name" />
                                        <TextInput
                                            id="company_name"
                                            type="text"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.company_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="job_name" value="Job Role / Title" />
                                        <TextInput
                                            id="job_name"
                                            type="text"
                                            value={data.job_name}
                                            onChange={(e) => setData('job_name', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.job_name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="platform" value="Platform Applied On" />
                                        <select
                                            id="platform"
                                            value={data.platform}
                                            onChange={(e) => setData('platform', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors duration-200 sm:text-sm px-4 py-2"
                                        >
                                            <option value="" disabled>Select a platform</option>
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
                                        <InputError message={errors.platform} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="location" value="Area / Location" />
                                        <TextInput
                                            id="location"
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.location} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="date_applied" value="Date Applied" />
                                        <TextInput
                                            id="date_applied"
                                            type="date"
                                            value={data.date_applied}
                                            onChange={(e) => setData('date_applied', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.date_applied} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors duration-200 sm:text-sm px-4 py-2"
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="interview">Interviewing</option>
                                            <option value="offer">Offer Received</option>
                                            <option value="ghosted">Ghosted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-8 pt-2">
                                    <PrimaryButton disabled={processing}>
                                        Update Job Application
                                    </PrimaryButton>
                                    <Link href={route('dashboard')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-zinc-800 transition">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
