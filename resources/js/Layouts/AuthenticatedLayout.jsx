import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import useTheme from '@/Hooks/useTheme';
import { useState } from 'react';
import { Dialog, Transition, Disclosure, Popover } from '@headlessui/react';
import { Fragment } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const notifications = usePage().props.notifications ?? [];
    const { theme, toggleTheme } = useTheme();
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            current: route().current('dashboard'),
            icon: (
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'Jobs',
            current: route().current('jobs.*'),
            icon: (
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            children: [
                { name: 'Add Job', href: route('jobs.create'), current: route().current('jobs.create') },
                { name: 'Edit / Delete', href: route('jobs.index'), current: route().current('jobs.index') },
            ]
        },
        {
            name: 'Analytics',
            href: route('analytics.index'),
            current: route().current('analytics.index'),
            icon: (
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            name: 'Profile',
            current: route().current('profile.edit') || route().current('profile.password') || route().current('profile.delete'),
            icon: (
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            children: [
                { name: 'Edit Profile', href: route('profile.edit'), current: route().current('profile.edit') },
                { name: 'Change Password', href: route('profile.password'), current: route().current('profile.password') },
                { name: 'Delete Account', href: route('profile.delete'), current: route().current('profile.delete') },
            ]
        },
        {
            name: 'Log out',
            href: route('logout'),
            method: 'post',
            as: 'button',
            current: false,
            icon: (
                <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            )
        },
    ];

    const renderNavItems = (isDesktop) => (
        <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
                <li key={item.name} className={item.as === 'button' ? 'w-full' : ''}>
                    {!item.children ? (
                        <Link
                            href={item.href}
                            method={item.method || 'get'}
                            as={item.as || 'a'}
                            className={`group flex w-full items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                                ${item.current ? 'bg-gray-50 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800'}
                                ${isDesktop && !isDesktopSidebarOpen && 'justify-center'}
                            `}
                            title={isDesktop && !isDesktopSidebarOpen ? item.name : ''}
                        >
                            {item.icon}
                            <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${!isDesktop || isDesktopSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                                {item.name}
                            </span>
                        </Link>
                    ) : (
                        <Disclosure as="div" defaultOpen={item.current}>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button
                                        onClick={() => {
                                            if (isDesktop && !isDesktopSidebarOpen) setIsDesktopSidebarOpen(true);
                                        }}
                                        className={`group flex w-full items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                                            ${item.current ? 'bg-gray-50 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800'}
                                            ${isDesktop && !isDesktopSidebarOpen && 'justify-center'}
                                        `}
                                        title={isDesktop && !isDesktopSidebarOpen ? item.name : ''}
                                    >
                                        {item.icon}
                                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${!isDesktop || isDesktopSidebarOpen ? 'flex-1 text-left w-auto opacity-100' : 'w-0 opacity-0'}`}>
                                            {item.name}
                                        </span>
                                        {(!isDesktop || isDesktopSidebarOpen) && (
                                            <svg
                                                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90 text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </Disclosure.Button>
                                    <Transition
                                        enter="transition-all ease-in-out duration-300 overflow-hidden"
                                        enterFrom="max-h-0 opacity-0"
                                        enterTo="max-h-96 opacity-100"
                                        leave="transition-all ease-in-out duration-300 overflow-hidden"
                                        leaveFrom="max-h-96 opacity-100"
                                        leaveTo="max-h-0 opacity-0"
                                    >
                                        <Disclosure.Panel as="ul" className={`mt-1 px-2 space-y-1 ${isDesktop && !isDesktopSidebarOpen ? 'hidden' : ''}`}>
                                            {item.children.map((subItem) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`block rounded-md py-2 pr-2 pl-9 text-sm leading-6 ${subItem.current ? 'bg-gray-50 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400 font-semibold' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800'
                                                            }`}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </Disclosure.Panel>
                                    </Transition>
                                </>
                            )}
                        </Disclosure>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-white transition-colors duration-200">

            {/* Mobile Sidebar Overlay */}
            <Transition.Root show={isMobileMenuOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 md:hidden" onClose={setIsMobileMenuOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-zinc-900 px-6 pb-4 shadow-xl">
                                    <div className="flex h-16 shrink-0 items-center justify-between">
                                        <ApplicationLogo className="block h-8 w-auto text-indigo-600 dark:text-indigo-400 fill-current" />
                                        <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(false)}>
                                            <span className="sr-only">Close sidebar</span>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        {renderNavItems(false)}
                                    </nav>
                                    <button
                                        onClick={toggleTheme}
                                        className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                                    >
                                        {theme === 'light' ? (
                                            <><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> Dark Mode</>
                                        ) : (
                                            <><svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> Light Mode</>
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop Static Sidebar */}
            <div className={`hidden md:flex md:flex-col ${isDesktopSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 z-10 shadow-xl`}>
                <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200 dark:border-zinc-800">
                    <Link href="/" className={`flex items-center overflow-hidden whitespace-nowrap ${isDesktopSidebarOpen ? 'opacity-100' : 'w-0 opacity-0'} transition-all duration-300`}>
                        <ApplicationLogo className="block h-8 w-auto text-indigo-600 dark:text-indigo-400 fill-current" />
                    </Link>
                    <button
                        onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
                        className={`p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 focus:outline-none flex-shrink-0 ${!isDesktopSidebarOpen && 'mx-auto'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <nav className="flex flex-1 flex-col gap-y-7 px-3 py-4 overflow-y-auto overflow-x-hidden">
                    {renderNavItems(true)}
                </nav>

                {/* Desktop Footer (Theme) */}
                <div className="border-t border-gray-200 dark:border-zinc-800 p-3 space-y-4">
                    <button
                        onClick={toggleTheme}
                        className={`flex items-center rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 focus:outline-none transition-colors w-full ${!isDesktopSidebarOpen && 'justify-center'}`}
                        title={!isDesktopSidebarOpen ? "Toggle Theme" : ''}
                    >
                        {theme === 'light' ? (
                            <>
                                <svg className={`w-5 h-5 flex-shrink-0 ${isDesktopSidebarOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isDesktopSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                                    Dark Mode
                                </span>
                            </>
                        ) : (
                            <>
                                <svg className={`w-5 h-5 flex-shrink-0 text-yellow-400 ${isDesktopSidebarOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isDesktopSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                                    Light Mode
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Unified Top Bar (Desktop & Mobile) */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-4 shadow-sm sm:px-6 lg:px-8 transition-colors duration-200">
                    <div className="flex items-center md:hidden">
                        <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(true)}>
                            <span className="sr-only">Open sidebar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <span className="ml-4 font-bold text-indigo-600 dark:text-indigo-400">JobTracker</span>
                    </div>
                    <div className="hidden md:block">
                        {/* Empty space for desktop to keep flex justify-between aligned */}
                    </div>
                    <div className="flex items-center gap-x-4">
                        <Popover className="relative">
                            <Popover.Button className="relative flex-shrink-0 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900">
                                <span className="sr-only">View notifications</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {notifications.length > 0 && (
                                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                                    </span>
                                )}
                            </Popover.Button>

                            <Transition
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 -translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 -translate-y-1"
                            >
                                <Popover.Panel className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            Notifications
                                        </p>
                                    </div>

                                    {notifications.length === 0 ? (
                                        <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                            You're all caught up.
                                        </p>
                                    ) : (
                                        <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto dark:divide-zinc-800">
                                            {notifications.map((job) => (
                                                <li key={job.id}>
                                                    <Link
                                                        href={route('jobs.edit', job.id)}
                                                        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                                                    >
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {job.company_name} — {job.job_name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                                                            No update in {job.days_since_applied} days · {job.status}
                                                        </p>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Popover.Panel>
                            </Transition>
                        </Popover>

                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
                            {user.name}
                        </span>
                    </div>
                </div>

                {header && (
                    <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-800 z-10 hidden md:block transition-colors duration-200">
                        <div className="px-4 py-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
