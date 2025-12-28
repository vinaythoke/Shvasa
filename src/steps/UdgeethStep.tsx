import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export const UdgeethStep: React.FC = () => {
    const nextStep = useStore(state => state.nextStep);
    const [count, setCount] = useState(0);
    const TOTAL_REPS = 5;

    const handleComplete = () => {
        if (count < TOTAL_REPS) {
            setCount(c => c + 1);
            // Optional: Trigger vibration or sound
            if (navigator.vibrate) navigator.vibrate(50);

            if (count + 1 === TOTAL_REPS) {
                setTimeout(() => {
                    nextStep();
                }, 1000); // 1s delay after last completion
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-xs mx-auto text-center space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-shvasa-saffron">Udgeeth</h2>
                <p className="text-sm opacity-70">Chant OM. 25% 'O', 75% 'M'.</p>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="50%" cy="50%" r="45%"
                        fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="4"
                    />
                    <motion.circle
                        cx="50%" cy="50%" r="45%"
                        fill="none" stroke="currentColor" strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: count / TOTAL_REPS }}
                        transition={{ duration: 0.5 }}
                        className="text-shvasa-saffron"
                    />
                </svg>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleComplete}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-500/50 flex items-center justify-center backdrop-blur-sm z-10"
                >
                    <span className="text-4xl font-serif">ॐ</span>
                </motion.button>

                {/* Ripple Effect on click - could implement with AnimatePresence */}
            </div>

            <div className="text-xl font-medium tabular-nums">
                {count} <span className="text-sm opacity-50">/ {TOTAL_REPS}</span>
            </div>

            <p className="text-xs opacity-50 max-w-[200px]">
                Tap the Om symbol after each chant completion.
            </p>
        </div>
    );
};
