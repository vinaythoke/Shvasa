import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { RefreshCcw, Share2 } from 'lucide-react';

export const ResultsStep: React.FC = () => {
    const breathHoldTimes = useStore(state => state.breathHoldTimes);
    const resetSession = useStore(state => state.resetSession);

    // Format helper
    const formatTime = (ms: number) => {
        if (!ms) return "--";
        const sec = (ms / 1000).toFixed(1);
        return `${sec}s`;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md space-y-8 p-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">The Mirror</h1>
                <p className="opacity-70 italic font-serif">"Rest in your own true nature." — Swarupa</p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/10 rounded-xl p-4 flex flex-col items-center"
                    >
                        <span className="text-xs opacity-50 uppercase tracking-widest mb-1">Round {i + 1}</span>
                        <span className="text-2xl font-mono font-bold">{formatTime(breathHoldTimes[i])}</span>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-4 mt-8">
                <button
                    onClick={resetSession}
                    className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                    <RefreshCcw size={18} /> Restart
                </button>
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors"
                    onClick={() => alert("Sharing feature coming soon!")}
                >
                    <Share2 size={18} /> Share
                </button>
            </div>
        </div>
    );
};
