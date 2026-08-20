import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
const CHECK_INTERVAL_MS = 1000;

/**
 * Logs the user out after `timeoutMinutes` of no mouse/keyboard/scroll
 * activity, showing a countdown warning for the last `warningSeconds`
 * so an idle-but-reading user isn't logged out without notice.
 */
export default function useIdleLogout({ timeoutMinutes = 15, warningSeconds = 60 } = {}) {
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const lastActivityRef = useRef(Date.now());
    const loggedOutRef = useRef(false);
    const [showWarning, setShowWarning] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(warningSeconds);

    const stayLoggedIn = useCallback(() => {
        lastActivityRef.current = Date.now();
        setShowWarning(false);
    }, []);

    useEffect(() => {
        const recordActivity = () => {
            // Once the warning is showing, only an explicit "Stay signed in"
            // click (via stayLoggedIn) should dismiss it — otherwise a stray
            // scroll from the countdown UI itself would silently cancel it.
            if (!showWarning) {
                lastActivityRef.current = Date.now();
            }
        };

        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, recordActivity, { passive: true })
        );

        const interval = setInterval(() => {
            if (loggedOutRef.current) return;

            const remainingMs = timeoutMs - (Date.now() - lastActivityRef.current);

            if (remainingMs <= 0) {
                loggedOutRef.current = true;
                setShowWarning(false);
                router.post(route('logout'));
                return;
            }

            if (remainingMs <= warningSeconds * 1000) {
                setShowWarning(true);
                setSecondsRemaining(Math.ceil(remainingMs / 1000));
            }
        }, CHECK_INTERVAL_MS);

        return () => {
            ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, recordActivity)
            );
            clearInterval(interval);
        };
    }, [showWarning, timeoutMs, warningSeconds]);

    return { showWarning, secondsRemaining, stayLoggedIn };
}
