import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { useBreathingTimer } from '../hooks/useBreathingTimer';
import { BreathingCircle, BreathingPhase } from '../components/BreathingCircle';
import { STEPS } from '../data/steps';

export const AnulomVilomStep: React.FC = () => {
    const nextStep = useStore(state => state.nextStep);
    const setBreathingPhase = useStore(state => state.setBreathingPhase);
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const config = STEPS[currentStepIndex];

    const { elapsed, start, stop } = useBreathingTimer();

    // Pattern: In Left (4), Out Right (4), In Right (4), Out Left (4).
    // Total cycle: 16s.
    const CYCLE_DURATION = 16000;
    const TOTAL_DURATION_SEC = config.duration || 300; // 5 mins
    const TOTAL_DURATION_MS = TOTAL_DURATION_SEC * 1000;

    const [phase, setPhase] = useState<BreathingPhase>('inhale');
    const [instruction, setInstruction] = useState("Inhale");
    const [nostril, setNostril] = useState("Left Nostril");
    const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
    const [countdown, setCountdown] = useState(3);
    const [isCountingDown, setIsCountingDown] = useState(true);

    // Sync to global store for background animation
    useEffect(() => {
        if (isCountingDown) {
            setBreathingPhase('holdOut');
        } else {
            setBreathingPhase(phase);
        }
    }, [phase, setBreathingPhase, isCountingDown]);

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
        if (isCountingDown) return;

        if (elapsed >= TOTAL_DURATION_MS) {
            nextStep();
            return;
        }

        const cycleTime = elapsed % CYCLE_DURATION;

        if (cycleTime < 4000) {
            setPhase('inhale');
            setInstruction("Inhale");
            setNostril("Left Nostril");
            setActiveSide('left');
        } else if (cycleTime < 8000) {
            setPhase('exhale');
            setInstruction("Exhale");
            setNostril("Right Nostril");
            setActiveSide('right');
        } else if (cycleTime < 12000) {
            setPhase('inhale');
            setInstruction("Inhale");
            setNostril("Right Nostril");
            setActiveSide('right');
        } else {
            setPhase('exhale');
            setInstruction("Exhale");
            setNostril("Left Nostril");
            setActiveSide('left');
        }
    }, [elapsed, nextStep, TOTAL_DURATION_MS, isCountingDown]);

    // Format remaining time
    const remainingSec = Math.max(0, Math.ceil((TOTAL_DURATION_MS - elapsed) / 1000));
    const mins = Math.floor(remainingSec / 60);
    const secs = remainingSec % 60;

    return (
        <div className="flex flex-col items-center justify-center space-y-10 w-full">
            <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className={`text-3xl font-bold ${config.colorClass}`}>{config.title}</h2>
                <p className="text-sm opacity-70 uppercase tracking-widest">Nadhi Shodhana</p>
            </motion.div>

            <div className={`relative group ${isCountingDown ? 'opacity-50' : ''}`}>
                {/* Nostril Indicators - Only show clearly when not counting down */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-2 transition-opacity duration-700 pointer-events-none"
                    style={{ opacity: !isCountingDown && activeSide === 'left' ? 1 : 0.1 }}>
                    <div className="w-1.5 h-12 rounded-full overflow-hidden relative" style={{ backgroundColor: `${config.circleColor}40` }}>
                        {!isCountingDown && activeSide === 'left' && (
                            <motion.div
                                className="absolute inset-0"
                                style={{ backgroundColor: config.circleColor }}
                                initial={{ y: "100%" }}
                                animate={{ y: phase === 'inhale' ? ["100%", "0%"] : ["0%", "100%"] }}
                                transition={{ duration: 4, ease: "linear" }}
                            />
                        )}
                    </div>
                    <span className="text-[10px] uppercase tracking-tighter opacity-70 font-bold" style={{ color: config.circleColor }}>Left</span>
                </div>

                <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-2 transition-opacity duration-700 pointer-events-none"
                    style={{ opacity: !isCountingDown && activeSide === 'right' ? 1 : 0.1 }}>
                    <div className="w-1.5 h-12 rounded-full overflow-hidden relative" style={{ backgroundColor: `${config.circleColor}40` }}>
                        {!isCountingDown && activeSide === 'right' && (
                            <motion.div
                                className="absolute inset-0"
                                style={{ backgroundColor: config.circleColor }}
                                initial={{ y: "100%" }}
                                animate={{ y: phase === 'inhale' ? ["100%", "0%"] : ["0%", "100%"] }}
                                transition={{ duration: 4, ease: "linear" }}
                            />
                        )}
                    </div>
                    <span className="text-[10px] uppercase tracking-tighter opacity-70 font-bold" style={{ color: config.circleColor }}>Right</span>
                </div>

                <BreathingCircle
                    phase={isCountingDown ? 'holdOut' : phase}
                    duration={isCountingDown ? 1 : 4}
                    label={isCountingDown
                        ? (countdown > 0 ? countdown.toString() : "GO")
                        : instruction
                    }
                    sublabel={isCountingDown ? "" : nostril}
                    color={config.circleColor}
                    textColor={config.circleTextColor}
                />
            </div>

            <div className="text-sm font-mono opacity-50 tabular-nums">
                {mins}:{secs.toString().padStart(2, '0')}
            </div>
        </div>
    );
};
