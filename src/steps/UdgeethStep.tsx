import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathingCircle } from '../components/BreathingCircle';
import { STEPS } from '../data/steps';

export const UdgeethStep: React.FC = () => {
    const nextStep = useStore(state => state.nextStep);
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const config = STEPS[currentStepIndex];
    
    const [count, setCount] = useState(0);
    const [isPulsing, setIsPulsing] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; timestamp: number }>>([]);
    const TOTAL_REPS = 5;

    const handleComplete = () => {
        if (count < TOTAL_REPS) {
            setCount(c => c + 1);
            setIsPulsing(true);
            
            // Add ripple effect
            const rippleId = Date.now();
            setRipples(prev => [...prev, { id: rippleId, timestamp: Date.now() }]);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== rippleId));
            }, 2000);
            
            // Optional: Trigger vibration
            if (navigator.vibrate) navigator.vibrate(50);
            
            // Reset pulse after animation
            setTimeout(() => setIsPulsing(false), 500);

            if (count + 1 === TOTAL_REPS) {
                setTimeout(() => {
                    nextStep();
                }, 1500); // 1.5s delay after last completion
            }
        }
    };

    // Calculate progress percentage for visual feedback
    const progress = count / TOTAL_REPS;

    return (
        <div className="flex flex-col items-center justify-center space-y-8 w-full" style={{ overflow: 'visible' }}>
            {/* Title Section - Matching SimpleBreathingStep style */}
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

                {config.description && (
                    <p className="text-sm opacity-60 italic font-serif leading-relaxed">
                        {config.description}
                    </p>
                )}
            </motion.div>

            {/* Breathing Circle with Om Symbol and Ripples */}
            <div className="relative w-80 h-80 flex items-center justify-center" style={{ overflow: 'visible' }}>
                {/* Ripple Waves - Expand outward from circle center */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ overflow: 'visible' }}>
                    <AnimatePresence>
                        {ripples.map((ripple) => (
                            <motion.div
                                key={ripple.id}
                                className="absolute rounded-full"
                                style={{
                                    width: '320px',
                                    height: '320px',
                                    left: '50%',
                                    top: '50%',
                                    marginLeft: '-160px',
                                    marginTop: '-160px',
                                    background: `radial-gradient(circle, ${config.circleColor}40 0%, ${config.circleColor}20 30%, transparent 70%)`,
                                    boxShadow: `0 0 80px ${config.circleColor}50, 0 0 160px ${config.circleColor}30`
                                }}
                                initial={{ scale: 0.3, opacity: 0.8 }}
                                animate={{ 
                                    scale: 10,
                                    opacity: 0
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ 
                                    duration: 2.5,
                                    ease: [0.4, 0, 0.2, 1] // Custom easing for smooth fade
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Progress Ring - Outside the circle, larger */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg 
                        className="absolute -rotate-90"
                        width="400"
                        height="400"
                        viewBox="0 0 400 400"
                    >
                        {/* Background ring */}
                        <circle
                            cx="200" 
                            cy="200" 
                            r="180"
                            fill="none" 
                            stroke={config.circleColor}
                            strokeOpacity="0.15" 
                            strokeWidth="3"
                        />
                        {/* Progress ring */}
                        <motion.circle
                            cx="200" 
                            cy="200" 
                            r="180"
                            fill="none" 
                            stroke={config.circleColor}
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            strokeOpacity="0.9"
                            style={{
                                filter: `drop-shadow(0 0 8px ${config.circleColor}80)`
                            }}
                        />
                    </svg>
                </div>

                {/* Breathing Circle */}
                <motion.div
                    className="w-full h-full relative"
                    style={{ zIndex: 10 }}
                    animate={isPulsing ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <BreathingCircle
                        phase="idle"
                        duration={2}
                        color={config.circleColor}
                        textColor={config.circleTextColor}
                    />
                </motion.div>
                
                {/* Clickable overlay with Om symbol */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleComplete}
                        disabled={count >= TOTAL_REPS}
                        className="pointer-events-auto w-full h-full flex items-center justify-center rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Complete Om chant"
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={count}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-6xl font-serif"
                                style={{ 
                                    color: config.circleTextColor,
                                    textShadow: `0 2px 20px ${config.circleColor}`
                                }}
                            >
                                ॐ
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Progress Counter - Matching SimpleBreathingStep timer style */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center space-y-2"
            >
                <div className="text-2xl font-mono tabular-nums" style={{ color: config.circleColor }}>
                    {count} <span className="text-sm opacity-60">/ {TOTAL_REPS}</span>
                </div>
                {count < TOTAL_REPS && (
                    <p className="text-xs opacity-50 max-w-xs">
                        Tap the Om symbol after each chant completion
                    </p>
                )}
                {count >= TOTAL_REPS && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm opacity-70 italic"
                    >
                        Complete
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};
