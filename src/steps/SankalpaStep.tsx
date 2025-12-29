import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { STEPS } from '../data/steps';

// Light pastel colors for background animation
const PASTEL_COLORS = [
    'rgb(230, 242, 255)',   // Light Blue
    'rgb(255, 230, 242)',   // Light Pink
    'rgb(230, 255, 242)',   // Light Mint
    'rgb(255, 242, 230)',   // Light Peach
    'rgb(242, 230, 255)',   // Light Lavender
    'rgb(255, 255, 230)',   // Light Cream
];

export const SankalpaStep: React.FC = () => {
    const nextStep = useStore(state => state.nextStep);
    const step = STEPS[0];
    const [colorIndex, setColorIndex] = useState(0);

    // Cycle through colors
    useEffect(() => {
        const interval = setInterval(() => {
            setColorIndex((prev) => (prev + 1) % PASTEL_COLORS.length);
        }, 4000); // Change color every 4 seconds
        return () => clearInterval(interval);
    }, []);

    // Update body and html background with CSS transition
    useEffect(() => {
        // Set initial background immediately on mount
        const initialColor = PASTEL_COLORS[0];
        document.body.style.backgroundColor = initialColor;
        document.documentElement.style.backgroundColor = initialColor;
        
        // Add transition after initial set
        setTimeout(() => {
            document.body.style.transition = 'background-color 2s ease-in-out';
            document.documentElement.style.transition = 'background-color 2s ease-in-out';
        }, 100);
        
        return () => {
            // Reset when leaving this step
            document.body.style.transition = '';
            document.documentElement.style.transition = '';
            document.body.style.backgroundColor = '';
            document.documentElement.style.backgroundColor = '';
        };
    }, []);

    // Update colors when colorIndex changes
    useEffect(() => {
        document.body.style.backgroundColor = PASTEL_COLORS[colorIndex];
        document.documentElement.style.backgroundColor = PASTEL_COLORS[colorIndex];
    }, [colorIndex]);

    return (
        <>
            {/* Full screen background - uses same color as body */}
            <motion.div
                className="fixed inset-0 z-0"
                initial={{ backgroundColor: PASTEL_COLORS[0] }}
                animate={{ backgroundColor: PASTEL_COLORS[colorIndex] }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Floating orbs for depth */}
            <motion.div
                className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none z-0"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    backgroundColor: PASTEL_COLORS[(colorIndex + 2) % PASTEL_COLORS.length],
                }}
                transition={{ 
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    backgroundColor: { duration: 2, ease: "easeInOut" }
                }}
            />
            <motion.div
                className="fixed bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-30 blur-3xl pointer-events-none z-0"
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -20, 0],
                    y: [0, 30, 0],
                    backgroundColor: PASTEL_COLORS[(colorIndex + 4) % PASTEL_COLORS.length],
                }}
                transition={{ 
                    scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    backgroundColor: { duration: 2, ease: "easeInOut" }
                }}
            />

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center h-full text-center space-y-12 z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="space-y-6 max-w-sm relative z-10"
                >
                    <h1 className="text-5xl font-bold tracking-tight text-gray-800">
                        Shvāsā
                    </h1>
                    <p className="text-lg text-gray-600/80 italic font-serif leading-relaxed px-4">
                        {step.quote}
                    </p>
                </motion.div>

                {/* Pulsing circle behind button */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.3, 1], 
                        opacity: [0.2, 0.4, 0.2] 
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-40 h-40 rounded-full bg-white/50 blur-2xl pointer-events-none"
                    style={{ bottom: '25%' }}
                />

                {/* Glassmorphism Button with Glow */}
                <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="relative z-10 group"
                >
                    {/* Glow effect behind button */}
                    <motion.div
                        className="absolute inset-0 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity"
                        animate={{
                            boxShadow: [
                                '0 0 20px rgba(99, 102, 241, 0.4)',
                                '0 0 40px rgba(168, 85, 247, 0.4)',
                                '0 0 20px rgba(236, 72, 153, 0.4)',
                                '0 0 40px rgba(99, 102, 241, 0.4)',
                            ],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
                        }}
                    />
                    
                    {/* Glass button */}
                    <span className="relative block px-10 py-4 rounded-full font-semibold tracking-wider uppercase text-gray-700 backdrop-blur-md bg-white/70 border border-white/50 shadow-lg transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-xl">
                        <span className="relative z-10 flex items-center gap-2">
                            Begin Journey
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                →
                            </motion.span>
                        </span>
                    </span>
                </motion.button>
            </div>
        </>
    );
};
