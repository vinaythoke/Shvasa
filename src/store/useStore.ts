import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STEPS } from '../data/steps';

interface AppState {
    currentStepIndex: number;
    isMusicPlaying: boolean;
    breathHoldTimes: number[]; // For step 9 rounds
    isWakeLockActive: boolean;
    sessionStartTime: number;
    breathingPhase: 'inhale' | 'exhale' | 'hold' | 'holdIn' | 'holdOut' | 'idle' | 'pulse' | 'retention';

    // Actions
    nextStep: () => void;
    prevStep: () => void;
    setStep: (index: number) => void;
    toggleMusic: () => void;
    addBreathHoldTime: (timeMs: number, roundIndex: number) => void;
    setWakeLockStatus: (isActive: boolean) => void;
    setBreathingPhase: (phase: 'inhale' | 'exhale' | 'hold' | 'holdIn' | 'holdOut' | 'idle' | 'pulse' | 'retention') => void;
    resetSession: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            currentStepIndex: 0,
            isMusicPlaying: false,
            breathHoldTimes: [],
            isWakeLockActive: false,
            sessionStartTime: Date.now(),
            breathingPhase: 'idle',

            nextStep: () => set((state) => {
                if (state.currentStepIndex < STEPS.length - 1) {
                    return { currentStepIndex: state.currentStepIndex + 1, breathingPhase: 'idle' };
                }
                return state;
            }),

            prevStep: () => set((state) => {
                if (state.currentStepIndex > 0) {
                    return { currentStepIndex: state.currentStepIndex - 1, breathingPhase: 'idle' };
                }
                return state;
            }),

            setStep: (index) => set({ currentStepIndex: index, breathingPhase: 'idle' }),

            toggleMusic: () => set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),

            addBreathHoldTime: (timeMs, roundIndex) => set((state) => {
                const newTimes = [...state.breathHoldTimes];
                newTimes[roundIndex] = timeMs;
                return { breathHoldTimes: newTimes };
            }),

            setWakeLockStatus: (isActive) => set({ isWakeLockActive: isActive }),

            setBreathingPhase: (phase) => set({ breathingPhase: phase }),

            resetSession: () => set({
                currentStepIndex: 0,
                breathHoldTimes: [],
                sessionStartTime: Date.now(),
                breathingPhase: 'idle',
                // Keep music state or reset? Usually keep preference.
            }),
        }),
        {
            name: 'shvasa-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                currentStepIndex: state.currentStepIndex,
                breathHoldTimes: state.breathHoldTimes,
                isMusicPlaying: state.isMusicPlaying,
                sessionStartTime: state.sessionStartTime
            }) as AppState, // Don't persist ephemeral like WakeLockActive
        }
    )
);
