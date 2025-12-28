import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { BreathingCircle, BreathingPhase } from '../components/BreathingCircle';
import { StepData } from '../data/steps';

// Default 4-4 breathing if not specified
const DEFAULT_PATTERN = { inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 };

export const SimpleBreathingStep: React.FC<{
    config: StepData,
    pattern?: { inhale: number, holdIn: number, exhale: number, holdOut: number }
}> = ({ config, pattern = DEFAULT_PATTERN }) => {
    const nextStep = useStore(state => state.nextStep);
    const setBreathingPhase = useStore(state => state.setBreathingPhase);
    const { elapsed, isRunning, start, stop } = useBreathingTimer();

    const [phase, setPhase] = useState<BreathingPhase>('inhale');
    const [phaseTime, setPhaseTime] = useState(pattern.inhale);
    const [countdown, setCountdown] = useState(3);
    const [isCountingDown, setIsCountingDown] = useState(true);

    // Sync phase to global store for background animation
    useEffect(() => {
        // During countdown, keep it at holdOut to keep it small
        if (isCountingDown) {
            setBreathingPhase('holdOut');
        } else {
            setBreathingPhase(phase);
        }
    }, [phase, setBreathingPhase, isCountingDown]);

    const cycleDuration = pattern.inhale + pattern.holdIn + pattern.exhale + pattern.holdOut;
    const totalDurationMs = (config.duration || 180) * 1000;

    // Countdown Logic
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            const timer = setTimeout(() => {
                setIsCountingDown(false);
                start();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, start]);

    useEffect(() => {
        return () => stop();
    }, [stop]);

    useEffect(() => {
        if (!isRunning || isCountingDown) return;

        if (elapsed >= totalDurationMs) {
            stop();
            nextStep();
            return;
        }

        const elapsedSec = elapsed / 1000;
        const timeInCycle = elapsedSec % cycleDuration;

        let currentPhase: BreathingPhase = 'idle';
        let duration = 0;

        if (timeInCycle < pattern.inhale) {
            currentPhase = 'inhale';
            duration = pattern.inhale;
        } else if (timeInCycle < pattern.inhale + pattern.holdIn) {
            currentPhase = 'holdIn';
            duration = pattern.holdIn;
        } else if (timeInCycle < pattern.inhale + pattern.holdIn + pattern.exhale) {
            currentPhase = 'exhale';
            duration = pattern.exhale;
        } else {
            currentPhase = 'holdOut';
            duration = pattern.holdOut;
        }

        setPhase(currentPhase);
        setPhaseTime(duration);

    }, [elapsed, cycleDuration, pattern, totalDurationMs, nextStep, stop, isRunning, isCountingDown]);

    // Calculate remaining time for display
    const remainingSec = Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000));
    const mins = Math.floor(remainingSec / 60);
    const secs = remainingSec % 60;

    return (
        <div className="flex flex-col items-center justify-center space-y-8 w-full">
            <motion.div
                className="text-center space-y-4 max-w-sm px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="space-y-1">
                    <h2 className={`text-3xl font-bold ${config.colorClass}`}>{config.title}</h2>
                    <p className="text-sm opacity-70 uppercase tracking-widest">{config.subtitle}</p>
                </div>

                {config.quote && (
                    <p className="text-sm italic opacity-50 font-serif leading-relaxed">
                        {config.quote}
                    </p>
                )}
            </motion.div>

            <BreathingCircle
                phase={isCountingDown ? 'holdOut' : phase}
                duration={isCountingDown ? 1 : phaseTime}
                label={isCountingDown
                    ? (countdown > 0 ? countdown.toString() : "GO")
                    : (phase === 'holdIn' || phase === 'holdOut' ? 'hold' : phase)
                }
                color={config.circleColor}
                textColor={config.circleTextColor}
            />

            <div className="text-sm font-mono opacity-50">
                {mins}:{secs.toString().padStart(2, '0')}
            </div>
        </div>
    );
};
