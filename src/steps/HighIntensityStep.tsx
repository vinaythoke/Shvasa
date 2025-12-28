import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { BreathingCircle } from '../components/BreathingCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { STEPS } from '../data/steps';

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

    // Hyperventilation Timer
    const [hvTimeLeft, setHvTimeLeft] = useState(30);

    // Retention Timer
    const [retentionTime, setRetentionTime] = useState(0);
    const retentionStartRef = useRef<number | null>(null);
    const retentionIntervalRef = useRef<number | null>(null);

    // Recovery Timer
    const [recoveryTimeLeft, setRecoveryTimeLeft] = useState(15);

    const TOTAL_ROUNDS = 4; // reduced from 6 for better experience, adjust if needed

    // Update global store phase for Layout effects
    useEffect(() => {
        if (isCountingDown) setBreathingPhase('holdOut');
        else if (phase === 'hyperventilation') setBreathingPhase('pulse');
        else if (phase === 'retention') setBreathingPhase('retention');
        else if (phase === 'recovery') setBreathingPhase('hold');
        else setBreathingPhase('idle');
    }, [phase, setBreathingPhase, isCountingDown]);

    // Countdown Logic
    useEffect(() => {
        if (phase === 'hyperventilation' && isCountingDown) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else if (countdown === 0) {
                const timer = setTimeout(() => {
                    setIsCountingDown(false);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [countdown, phase, isCountingDown]);

    // Hyperventilation Logic
    useEffect(() => {
        let interval: number;
        if (phase === 'hyperventilation' && !isCountingDown) {
            setHvTimeLeft(30);
            interval = window.setInterval(() => {
                setHvTimeLeft(prev => {
                    if (prev <= 1) return 0;
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [phase, round, isCountingDown]);

    // Cleanup retention interval on unmount
    useEffect(() => {
        return () => {
            if (retentionIntervalRef.current) clearInterval(retentionIntervalRef.current);
        };
    }, []);

    // Recovery Logic
    useEffect(() => {
        let interval: number;
        if (phase === 'recovery') {
            setRecoveryTimeLeft(15);
            interval = window.setInterval(() => {
                setRecoveryTimeLeft(prev => {
                    if (prev <= 1) {
                        if (round < TOTAL_ROUNDS - 1) {
                            setRound(r => r + 1);
                            setPhase('hyperventilation');
                        } else {
                            setPhase('finished');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [phase, round]);

    useEffect(() => {
        if (phase === 'finished') {
            nextStep();
        }
    }, [phase, nextStep]);

    // Handlers
    const startRetention = () => {
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
        setPhase('recovery');
    };

    const formatTime = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        const dec = Math.floor((ms % 1000) / 100);
        return `${m}:${s.toString().padStart(2, '0')}.${dec}`;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-8 relative">
            {/* Background Round Indicator */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-sm opacity-30 uppercase tracking-[0.3em] font-mono">
                Round {round + 1} / {TOTAL_ROUNDS}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'hyperventilation' && (
                    <motion.div
                        key="hv"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center space-y-12"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight text-white/90">Bellows Breath</h2>
                            <p className="text-sm opacity-60 italic max-w-xs mx-auto">"Burn the impurities of the mind in the fire of discipline."</p>
                        </div>

                        <div className="relative">
                            <BreathingCircle
                                phase={isCountingDown ? 'holdOut' : 'pulse'}
                                duration={isCountingDown ? 1 : 0.6}
                                color={config.circleColor}
                                label={isCountingDown
                                    ? (countdown > 0 ? countdown.toString() : "GO")
                                    : (hvTimeLeft > 0 ? hvTimeLeft.toString() : "READY")
                                }
                            />
                        </div>

                        {hvTimeLeft === 0 && (
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startRetention}
                                className="bg-white text-black px-12 py-5 rounded-full text-xl font-bold shadow-2xl tracking-widest uppercase"
                            >
                                HOLD NOW
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {phase === 'retention' && (
                    <motion.div
                        key="retention"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center space-y-12 text-center"
                    >
                        <div className="space-y-4">
                            <div className="text-white/20 text-xs uppercase tracking-[0.4em]">Retention Active</div>
                            <div className="text-7xl font-mono tabular-nums text-white tracking-tight">
                                {formatTime(retentionTime)}
                            </div>
                        </div>

                        <div className="opacity-40">
                            <BreathingCircle
                                phase="retention"
                                duration={2}
                                color="#FFFFFF"
                            />
                        </div>

                        <div className="space-y-8">
                            <p className="text-white/40 italic text-base max-w-sm font-serif leading-relaxed px-6">
                                "When the breath wanders the mind also is unsteady. But when the breath is calmed the mind too will be still."
                            </p>

                            <button
                                onClick={stopRetention}
                                className="w-64 bg-white/10 border border-white/20 text-white backdrop-blur-md py-5 rounded-2xl text-xl font-medium active:scale-95 transition-all hover:bg-white/20"
                            >
                                EXHALE
                            </button>
                        </div>
                    </motion.div>
                )}

                {phase === 'recovery' && (
                    <motion.div
                        key="recovery"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center space-y-12"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold text-white/90 uppercase tracking-tighter">Recovery</h2>
                            <p className="text-sm opacity-60 uppercase tracking-widest">Release & Relax</p>
                        </div>

                        <BreathingCircle
                            phase="hold"
                            duration={15}
                            color="#FFFFFF"
                            label={recoveryTimeLeft.toString()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
