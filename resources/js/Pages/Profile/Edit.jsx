import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Edit Profile
                </h2>
            }
        >
            <Head title="Edit Profile" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-zinc-900 p-4 shadow-md sm:rounded-lg sm:p-8 transition-colors duration-200 border border-transparent dark:border-zinc-800">
                        <UpdateProfileInformationForm
                            status={status}
                            className="max-w-4xl"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
