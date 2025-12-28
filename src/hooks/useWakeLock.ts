import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';

export const useWakeLock = () => {
    const wakeLock = useRef<any>(null); // WakeLockSentinel is not always typed globally yet
    const [released, setReleased] = useState(false);
    const setWakeLockStatus = useStore(state => state.setWakeLockStatus);

    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLock.current = await navigator.wakeLock.request('screen');
                setWakeLockStatus(true);
                setReleased(false);

                wakeLock.current.addEventListener('release', () => {
                    // console.log('Wake Lock was released');
                    setWakeLockStatus(false);
                    setReleased(true);
                });
            }
        } catch (err: any) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    const releaseWakeLock = async () => {
        if (wakeLock.current) {
            try {
                await wakeLock.current.release();
                wakeLock.current = null;
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        // Handle visibility change to re-acquire lock
        const handleVisibilityChange = async () => {
            if (released && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            releaseWakeLock();
        };
    }, [released]);

    return { requestWakeLock, releaseWakeLock };
};
