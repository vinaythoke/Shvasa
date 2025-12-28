/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// Declare self type for TS
declare const self: DedicatedWorkerGlobalScope;

const TICK_INTERVAL = 100; // 100ms precision

let timerId: number | null = null;
let startTime: number | null = null;
let pausedTime: number = 0;
let isPaused: boolean = false;

self.onmessage = (e) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'START':
            if (timerId) return;
            if (!startTime) {
                startTime = Date.now();
            } else if (isPaused) {
                // Adjust start time to account for the pause duration
                const now = Date.now();
                // The time we spent paused should be added to the "start time" (effectively pushing it forward)
                // so that (now - startTime) reflects strictly "active" time?
                // OR: we just want a monotonic clock for the breathing phase.
                // Let's assume we want to track elapsed duration of the session.
                // If we pause, we stop counting.
                // When we resume, we essentially restart the interval, but we need to ensure continuity.
                // Let's use a simpler "accumulated" approach + current segment.

                // Actually, for a precise breathing app, we usually don't "pause" mid-breath often, 
                // but if we do, we should track accumulated time.

                const pauseDuration = now - pausedTime;
                startTime += pauseDuration;
            }
            isPaused = false;

            timerId = self.setInterval(() => {
                if (!startTime) return;
                const now = Date.now();
                const elapsed = now - startTime;
                self.postMessage({ type: 'TICK', payload: { elapsed } });
            }, TICK_INTERVAL);
            break;

        case 'PAUSE':
            if (timerId) {
                self.clearInterval(timerId);
                timerId = null;
                pausedTime = Date.now();
                isPaused = true;
            }
            break;

        case 'STOP':
            if (timerId) {
                self.clearInterval(timerId);
                timerId = null;
            }
            startTime = null;
            pausedTime = 0;
            isPaused = false;
            break;

        case 'RESET':
            // Reset the timer but keep custom config if any (none here)
            if (timerId) {
                self.clearInterval(timerId);
                timerId = null;
            }
            startTime = null;
            pausedTime = 0;
            isPaused = false;
            self.postMessage({ type: 'TICK', payload: { elapsed: 0 } });
            break;
    }
};
