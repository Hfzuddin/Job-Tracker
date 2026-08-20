import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import useIdleLogout from '@/Hooks/useIdleLogout';

export default function IdleLogoutWarning({ timeoutMinutes = 15, warningSeconds = 60 }) {
    const { showWarning, secondsRemaining, stayLoggedIn } = useIdleLogout({
        timeoutMinutes,
        warningSeconds,
    });

    return (
        <Modal show={showWarning} onClose={stayLoggedIn} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Are you still there?
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    You've been idle for a while. For your security, you'll be
                    logged out in{' '}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {secondsRemaining}s
                    </span>{' '}
                    unless you stay active.
                </p>

                <div className="mt-6 flex justify-end">
                    <PrimaryButton onClick={stayLoggedIn}>
                        Stay signed in
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
