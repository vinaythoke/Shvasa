import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { BreathingCircle, BreathingPhase } from '../components/BreathingCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { STEPS } from '../data/steps';
import { useBreathingTimer } from '../hooks/useBreathingTimer';

type Step9Phase = 'hyperventilation' | 'retention' | 'recovery' | 'finished';

export const HighIntensityStep: React.FC = () => {
    const nextStep = useStore(state => state.nextStep);
    const addBreathHoldTime = useStore(state => state.addBreathHoldTime);
    const setBreathingPhase = useStore(state => state.setBreathingPhase);
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const config = STEPS[currentStepIndex];

    const [round, setRound] = useState(0);
    const [phase, setPhase] = useState<Step9Phase>('hyperventilation');
    const [countdown, setCountdown] = useState(3);
    const [isCountingDown, setIsCountingDown] = useState(true);
    const [hyperventilationComplete, setHyperventilationComplete] = useState(false);

    // Hyperventilation breathing state
    const [breathingPhase, setLocalBreathingPhase] = useState<BreathingPhase>('inhale');
    const [breathingPhaseTime, setBreathingPhaseTime] = useState(2);
    const { elapsed: hvElapsed, start: hvStart, stop: hvStop, reset: hvReset } = useBreathingTimer();

    // Recovery breathing state
    const [recoveryBreathingPhase, setRecoveryBreathingPhase] = useState<BreathingPhase>('inhale');
    const [recoveryPhaseTime, setRecoveryPhaseTime] = useState(5);
    const { elapsed: recoveryElapsed, isRunning: recoveryIsRunning, start: recoveryStart, stop: recoveryStop, reset: recoveryReset } = useBreathingTimer();

    // Retention Timer
    const [retentionTime, setRetentionTime] = useState(0);
    const retentionStartRef = useRef<number | null>(null);
    const retentionIntervalRef = useRef<number | null>(null);

    const TOTAL_ROUNDS = 4;
    const HYPERVENTILATION_DURATION = 30;
    const RECOVERY_DURATION = 15;
    const BREATHING_CYCLE = 4; // 2s inhale + 2s exhale
    const RECOVERY_CYCLE = 10; // 5s inhale + 5s exhale

    // Update global store phase for Layout effects
    useEffect(() => {
        if (isCountingDown) {
            setBreathingPhase('holdOut');
        } else if (phase === 'hyperventilation') {
            setBreathingPhase(breathingPhase);
        } else if (phase === 'retention') {
            setBreathingPhase('inhale'); // Stay expanded during retention
        } else if (phase === 'recovery') {
            setBreathingPhase(recoveryBreathingPhase);
        } else {
            setBreathingPhase('idle');
        }
    }, [phase, breathingPhase, recoveryBreathingPhase, setBreathingPhase, isCountingDown]);

    // Countdown Logic
    useEffect(() => {
        if (phase === 'hyperventilation' && isCountingDown) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else if (countdown === 0) {
                const timer = setTimeout(() => {
                    setIsCountingDown(false);
                    setHyperventilationComplete(false);
                    setLocalBreathingPhase('inhale');
                    setBreathingPhaseTime(2);
                    hvStart();
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [countdown, phase, isCountingDown, hvStart]);

    // Hyperventilation Breathing Logic - continues even after timer complete
    useEffect(() => {
        if (phase === 'hyperventilation' && !isCountingDown) {
            const elapsedSec = hvElapsed / 1000;
            const timeInCycle = elapsedSec % BREATHING_CYCLE;

            if (timeInCycle < 2) {
                setLocalBreathingPhase('inhale');
                setBreathingPhaseTime(2);
            } else {
                setLocalBreathingPhase('exhale');
                setBreathingPhaseTime(2);
            }

            // Mark complete but keep breathing animation going
            if (hvElapsed >= HYPERVENTILATION_DURATION * 1000 && !hyperventilationComplete) {
                setHyperventilationComplete(true);
            }
        }
    }, [hvElapsed, phase, isCountingDown, hyperventilationComplete]);

    // Recovery Breathing Logic - starts with exhale since user just released breath
    useEffect(() => {
        if (phase === 'recovery' && recoveryIsRunning) {
            const elapsedSec = recoveryElapsed / 1000;
            const timeInCycle = elapsedSec % RECOVERY_CYCLE;

            // First 5 seconds = exhale (circle contracts from inhale state)
            // Next 5 seconds = inhale
            if (timeInCycle < 5) {
                setRecoveryBreathingPhase('exhale');
                setRecoveryPhaseTime(5);
            } else {
                setRecoveryBreathingPhase('inhale');
                setRecoveryPhaseTime(5);
            }

            if (recoveryElapsed >= RECOVERY_DURATION * 1000) {
                recoveryStop();
                if (round < TOTAL_ROUNDS - 1) {
                    setRound(r => r + 1);
                    setPhase('hyperventilation');
                    setIsCountingDown(true);
                    setCountdown(3);
                    setHyperventilationComplete(false);
                    hvReset();
                    recoveryReset();
                } else {
                    setPhase('finished');
                }
            }
        }
    }, [recoveryElapsed, recoveryIsRunning, phase, round, recoveryStop, hvReset, recoveryReset]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (retentionIntervalRef.current) clearInterval(retentionIntervalRef.current);
            hvStop();
            recoveryStop();
        };
    }, [hvStop, recoveryStop]);

    useEffect(() => {
        if (phase === 'finished') {
            nextStep();
        }
    }, [phase, nextStep]);

    // Handlers
    const startRetention = () => {
        hvStop();
        setPhase('retention');
        setRetentionTime(0);
        retentionStartRef.current = Date.now();
        retentionIntervalRef.current = window.setInterval(() => {
            if (retentionStartRef.current) {
                setRetentionTime(Date.now() - retentionStartRef.current);
            }
        }, 100);
    };

    const stopRetention = () => {
        if (retentionIntervalRef.current) {
            clearInterval(retentionIntervalRef.current);
        }
        addBreathHoldTime(retentionTime, round);
        // Set exhale phase immediately so circle contracts from inhale state
        setRecoveryBreathingPhase('exhale');
        setRecoveryPhaseTime(5);
        setPhase('recovery');
        setHyperventilationComplete(false);
        recoveryReset();
        recoveryStart();
    };

    const formatTime = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        const dec = Math.floor((ms % 1000) / 100);
        return `${m}:${s.toString().padStart(2, '0')}.${dec}`;
    };

    // Calculate times for display
    // hvDisplayTime counts down from 30, then counts up after (showing extra breathing time)
    const hvElapsedSeconds = Math.floor(hvElapsed / 1000);
    const hvDisplayTime = hvElapsedSeconds < HYPERVENTILATION_DURATION 
        ? HYPERVENTILATION_DURATION - hvElapsedSeconds  // Countdown
        : hvElapsedSeconds - HYPERVENTILATION_DURATION; // Count up after 30s
    const recoveryTimeLeft = Math.max(0, Math.ceil((RECOVERY_DURATION * 1000 - recoveryElapsed) / 1000));

    // Determine current circle phase and duration
    const getCirclePhase = (): BreathingPhase => {
        if (isCountingDown) return 'holdOut';
        if (phase === 'retention') return 'inhale'; // Stay expanded
        if (phase === 'recovery') return recoveryBreathingPhase;
        return breathingPhase;
    };

    const getCircleDuration = (): number => {
        if (isCountingDown) return 1;
        if (phase === 'retention') return 2; // Smooth transition to expanded
        if (phase === 'recovery') return recoveryPhaseTime;
        return breathingPhaseTime;
    };

    // Determine what label to show in circle
    const getCircleLabel = (): string => {
        if (isCountingDown) {
            return countdown > 0 ? countdown.toString() : "GO";
        }
        if (phase === 'hyperventilation' && !hyperventilationComplete) {
            return breathingPhase; // Show inhale/exhale instead of timer
        }
        if (phase === 'recovery') {
            return recoveryBreathingPhase;
        }
        return "";
    };

    // No sublabel needed anymore since we show phase as main label
    const getCircleSublabel = (): string | undefined => {
        return undefined;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-8 relative px-4">
            {/* Background Round Indicator */}
            <motion.div 
                className="absolute top-8 left-1/2 -translate-x-1/2 text-sm opacity-30 uppercase tracking-[0.3em] font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.6 }}
            >
                Round {round + 1} / {TOTAL_ROUNDS}
            </motion.div>

            {/* Title Section - Fixed height to prevent layout shifts */}
            <motion.div 
                className="text-center space-y-3 h-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${config.colorClass}`}>
                    Bellows Breath
                </h2>
                <p className="text-sm opacity-60 italic max-w-xs mx-auto">
                    "Burn the impurities of the mind in the fire of discipline."
                </p>
            </motion.div>

            {/* Breathing Circle - Single continuous element */}
            <div className="relative">
                <BreathingCircle
                    phase={getCirclePhase()}
                    duration={getCircleDuration()}
                    color={config.circleColor}
                    label={getCircleLabel()}
                    sublabel={getCircleSublabel()}
                />
                
                {/* Button overlay in center of circle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence mode="wait">
                        {/* HOLD button - appears when hyperventilation complete */}
                        {phase === 'hyperventilation' && hyperventilationComplete && (
                            <motion.button
                                key="hold-btn"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startRetention}
                                className="pointer-events-auto bg-white text-black px-8 py-4 rounded-full text-lg font-bold shadow-2xl tracking-widest uppercase"
                            >
                                HOLD
                            </motion.button>
                        )}
                        
                        {/* EXHALE button with timer - during retention */}
                        {phase === 'retention' && (
                            <motion.div
                                key="exhale-btn"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="pointer-events-auto text-center"
                            >
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={stopRetention}
                                    className="bg-white/20 border border-white/40 text-white backdrop-blur-md px-8 py-4 rounded-full text-lg font-bold tracking-widest uppercase hover:bg-white/30 transition-colors"
                                >
                                    EXHALE
                                </motion.button>
                                <p className="text-white/60 text-sm mt-3 font-medium">
                                    Inhale and Hold
                                </p>
                                <p className="text-white text-2xl font-mono mt-2 tabular-nums">
                                    {formatTime(retentionTime)}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Timer display outside circle - always visible to prevent layout shift */}
            <div className="text-sm font-mono opacity-50 h-6 flex items-center justify-center">
                {phase === 'hyperventilation' && !isCountingDown && (
                    <span>
                        {hyperventilationComplete 
                            ? `+${Math.floor(hvDisplayTime / 60)}:${(hvDisplayTime % 60).toString().padStart(2, '0')}`
                            : `${Math.floor(hvDisplayTime / 60)}:${(hvDisplayTime % 60).toString().padStart(2, '0')}`
                        }
                    </span>
                )}
                {phase === 'recovery' && (
                    <span>{Math.floor(recoveryTimeLeft / 60)}:{(recoveryTimeLeft % 60).toString().padStart(2, '0')}</span>
                )}
                {/* Empty space holder for countdown and retention phases */}
                {(isCountingDown || phase === 'retention') && (
                    <span className="invisible">0:00</span>
                )}
            </div>

            {/* Next round indicator - always reserve space to prevent layout shift */}
            <div className="text-center h-5">
                {phase === 'recovery' && round < TOTAL_ROUNDS - 1 && (
                    <p className="text-white/40 text-xs">
                        Next: Round {round + 2} of {TOTAL_ROUNDS}
                    </p>
                )}
            </div>
        </div>
    );
};
