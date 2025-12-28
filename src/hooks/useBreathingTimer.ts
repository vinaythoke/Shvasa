import { useEffect, useRef, useState, useCallback } from 'react';
import TimerWorker from '../workers/timer.worker?worker';

export const useBreathingTimer = () => {
    const workerRef = useRef<Worker | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        workerRef.current = new TimerWorker();

        workerRef.current.onmessage = (e) => {
            if (e.data.type === 'TICK') {
                setElapsed(e.data.payload.elapsed);
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const start = useCallback(() => {
        workerRef.current?.postMessage({ type: 'START' });
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        workerRef.current?.postMessage({ type: 'PAUSE' });
        setIsRunning(false);
    }, []);

    const stop = useCallback(() => {
        workerRef.current?.postMessage({ type: 'STOP' });
        setIsRunning(false);
        setElapsed(0);
    }, []);

    const reset = useCallback(() => {
        workerRef.current?.postMessage({ type: 'RESET' });
        setElapsed(0);
        setIsRunning(false);
    }, []);

    return { elapsed, isRunning, start, pause, stop, reset };
};
