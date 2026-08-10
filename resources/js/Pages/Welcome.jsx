import { Head, Link } from '@inertiajs/react';
import useTheme from '@/Hooks/useTheme';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, canLogin, canRegister }) {
    const { theme, toggleTheme } = useTheme();
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Navigation links based on auth state
    const navigation = auth.user ? [
        { name: 'Jobs', href: route('jobs.index'), current: false, icon: (
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )}
    ] : [
        ...(canLogin ? [{ name: 'Log in', href: route('login'), current: false, icon: (
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
        )}] : []),
        ...(canRegister ? [{ name: 'Register', href: route('register'), current: false, icon: (
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        )}] : []),
    ];

    return (
        <>
            <Head title="Job Tracker" />
            <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-white transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
                
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
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <Link
                                                                    href={item.href}
                                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${item.current ? 'bg-gray-100 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800'}`}
                                                                >
                                                                    {item.icon}
                                                                    {item.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
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
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                                            ${item.current ? 'bg-gray-50 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800'}
                                            ${!isDesktopSidebarOpen && 'justify-center'}
                                        `}
                                        title={!isDesktopSidebarOpen ? item.name : ''}
                                    >
                                        {item.icon}
                                        <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isDesktopSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
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
                    {/* Mobile Top Bar */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 md:hidden">
                        <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200" onClick={() => setIsMobileMenuOpen(true)}>
                            <span className="sr-only">Open sidebar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">JobTracker</span>
                        </div>
                    </div>
                    
                    <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl transition-colors duration-200">
                            Track your job applications <span className="text-indigo-600 dark:text-indigo-400">effortlessly</span>
                        </h1>
                        <p className="mt-6 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl transition-colors duration-200">
                            Keep all your job applications organized in one place. Monitor your progress from the first step until the end.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            {canRegister && !auth.user && (
                                <Link
                                    href={route('register')}
                                    className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
                                >
                                    Get Started
                                </Link>
                            )}
                            {auth.user && (
                                <Link
                                    href={route('jobs.index')}
                                    className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
                                >
                                    Go to Jobs
                                </Link>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
