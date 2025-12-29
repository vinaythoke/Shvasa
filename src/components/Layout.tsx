import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { STEPS } from '../data/steps';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { useWakeLock } from '../hooks/useWakeLock';
import { twMerge } from 'tailwind-merge';
import { AudioController } from './AudioController';
import { motion } from 'framer-motion';

const SessionTimer: React.FC = () => {
    const sessionStartTime = useStore(state => state.sessionStartTime);
    const [duration, setDuration] = useState("00:00");

    useEffect(() => {
        const update = () => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((now - (sessionStartTime || now)) / 1000));
            const m = Math.floor(diff / 60).toString().padStart(2, '0');
            const s = (diff % 60).toString().padStart(2, '0');
            setDuration(`${m}:${s} `);
        };

        // Initial
        update();

        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [sessionStartTime]);

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-mono opacity-40 tabular-nums select-none pointer-events-none">
            {duration}
        </div>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentStepIndex, isMusicPlaying, toggleMusic, nextStep, breathingPhase } = useStore();
    const { requestWakeLock } = useWakeLock();

    const currentStep = STEPS[currentStepIndex];
    const isWelcomeStep = currentStepIndex === 0;

    useEffect(() => {
        requestWakeLock();
    }, []);

    return (
        <motion.div
            className={twMerge(
                "w-full h-full min-h-screen flex flex-col relative overflow-hidden",
                currentStep.textClass
            )}
            animate={{
                // For welcome step, use transparent so SankalpaStep can control the background
                backgroundColor: isWelcomeStep ? 'transparent' : (breathingPhase === 'retention' ? '#000000' : currentStep.hexColor),
                filter: isWelcomeStep ? 'none' : (breathingPhase === 'retention' ? 'brightness(0.2) saturate(0.5)' :
                    breathingPhase === 'inhale' ? 'brightness(1.05) saturate(1.1)' :
                        breathingPhase === 'exhale' ? 'brightness(0.95) saturate(0.9)' :
                            'brightness(1) saturate(1)')
            }}
            transition={{
                backgroundColor: { duration: isWelcomeStep ? 0 : 0.6, ease: "easeInOut" }, // Smooth transition for non-welcome steps
                filter: { duration: 2, ease: "easeInOut" }
            }}
            style={{
                // For welcome step, ensure no background interferes
                background: isWelcomeStep ? 'none' : undefined
            }}
        >
            {/* Noise Overlay to prevent banding (disabled on welcome step to avoid background clash) */}
            <div
                className={twMerge(
                    "absolute inset-0 mix-blend-overlay pointer-events-none z-0",
                    isWelcomeStep ? "opacity-0" : "opacity-[0.05]"
                )}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Header / Controls */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <div className="opacity-50 text-sm font-medium tracking-widest uppercase min-w-[4rem]">
                    {currentStepIndex + 1} / {STEPS.length}
                </div>

                <SessionTimer />

                <div className="flex items-center gap-3">
                    {currentStepIndex < STEPS.length - 1 && (
                        <button
                            onClick={nextStep}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all active:scale-95"
                            aria-label="Skip Step"
                        >
                            <SkipForward size={24} />
                        </button>
                    )}

                    <button
                        onClick={toggleMusic}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all active:scale-95"
                        aria-label="Toggle Music"
                    >
                        {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main
                className={twMerge(
                    "flex-1 flex flex-col items-center justify-center p-6 w-full relative z-10",
                    // For all non-welcome steps, keep content constrained for readability
                    !isWelcomeStep && "max-w-md mx-auto"
                )}
            >
                {children}
            </main>

            <AudioController />

            {/* Footer / Progress potentially? */}
            <div className="absolute bottom-6 w-full text-center opacity-40 text-xs">
                Designed by Sarvārth
            </div>
        </motion.div>
    );
};
