import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { STEPS } from '../data/steps';

export const SankalpaStep: React.FC = () => {
    const nextStep = useStore(state => state.nextStep);
    const step = STEPS[0];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="space-y-6 max-w-sm"
            >
                <h1 className="text-4xl font-bold tracking-tight">Sankalpa</h1>
                <p className="text-xl text-teal-900/60 italic font-serif leading-relaxed">
                    {step.quote}
                </p>
            </motion.div>

            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-48 rounded-full bg-white/5 blur-2xl absolute z-0 pointer-events-none"
            />

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="relative z-10 px-8 py-4 bg-white text-black font-medium tracking-wider uppercase rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
            >
                Begin Journey
            </motion.button>
        </div>
    );
};
