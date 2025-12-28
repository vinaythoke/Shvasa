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
            <div className="flex gap-2 mb-8 bg-white/10 p-1 rounded-full">
                <button
                    onClick={() => setLevel('apprentice')}
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase transition-colors ${level === 'apprentice' ? 'bg-white text-black' : 'text-white/50'}`}
                >
                    Apprentice
                </button>
                <button
                    onClick={() => setLevel('yogi')}
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase transition-colors ${level === 'yogi' ? 'bg-white text-black' : 'text-white/50'}`}
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
