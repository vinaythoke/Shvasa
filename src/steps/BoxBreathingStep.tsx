import React, { useState } from 'react';
import { SimpleBreathingStep } from './SimpleBreathingStep';
import { StepData } from '../data/steps';

export const BoxBreathingStep: React.FC<{ config: StepData }> = ({ config }) => {
    const [level, setLevel] = useState<'apprentice' | 'yogi'>('apprentice');

    // Apprentice: 4-4-4-4 (Standard Box) or PRD said "2-8-2-8"?
    // PRD Step 8 says: "Sama Vritti (Box Breathing). Customization: Apprentice (2-8-2-8) vs Yogi (3-12-3-12)".
    // 2-8-2-8 implies Inhale 2, Hold 8, Exhale 2, Hold 8.
    // 3-12-3-12 implies Inhale 3, Hold 12, Exhale 3, Hold 12.
    // We will follow PRD exactly.

    const patterns = {
        apprentice: { inhale: 2, holdIn: 8, exhale: 2, holdOut: 8 },
        yogi: { inhale: 3, holdIn: 12, exhale: 3, holdOut: 12 }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex gap-2 mb-8 p-1 rounded-full border border-black/5 bg-black/5 backdrop-blur-md shadow-inner">
                <button
                    onClick={() => setLevel('apprentice')}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${level === 'apprentice'
                            ? 'bg-white shadow-md scale-105'
                            : 'text-black/40 hover:text-black/60'
                        }`}
                    style={{ color: level === 'apprentice' ? config.circleColor : undefined }}
                >
                    Apprentice
                </button>
                <button
                    onClick={() => setLevel('yogi')}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${level === 'yogi'
                            ? 'bg-white shadow-md scale-105'
                            : 'text-black/40 hover:text-black/60'
                        }`}
                    style={{ color: level === 'yogi' ? config.circleColor : undefined }}
                >
                    Yogi
                </button>
            </div>

            <SimpleBreathingStep
                config={config}
                pattern={patterns[level]}
                key={level} // Re-mount on change to reset timer logic if desired, or simpler just update pattern
            />
        </div>
    );
};
