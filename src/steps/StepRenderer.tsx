import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { STEPS } from '../data/steps';
import { SankalpaStep } from './SankalpaStep';
import { UdgeethStep } from './UdgeethStep';
import { SimpleBreathingStep } from './SimpleBreathingStep';
import { AnulomVilomStep } from './AnulomVilomStep';
import { HighIntensityStep } from './HighIntensityStep';
import { BoxBreathingStep } from './BoxBreathingStep';
import { ResultsStep } from './ResultsStep';

export const StepRenderer: React.FC = () => {
    const currentStepIndex = useStore(state => state.currentStepIndex);
    const step = STEPS[currentStepIndex];

    const renderStep = () => {
        switch (step.id) {
            case 'sankalpa':
                return <SankalpaStep />;

            case 'udgeeth':
                return <UdgeethStep />;

            case 'sama-vritti-warmup':
                // 4-0-4-0 (Circle expanding/contracting smoothly)
                return <SimpleBreathingStep config={step} pattern={{ inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 }} />;

            case 'chandra-bhedana':
            case 'surya-bhedana':
                // Single nostril 4-4
                return <SimpleBreathingStep config={step} pattern={{ inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 }} />;

            case 'anulom-vilom':
                return <AnulomVilomStep />;

            case 'test-hold':
                // Test Hold: 4-16-8 pattern
                return <SimpleBreathingStep config={step} pattern={{ inhale: 4, holdIn: 16, exhale: 8, holdOut: 0 }} />;

            case 'box-breathing':
                return <BoxBreathingStep config={step} />;

            case 'high-intensity':
                return <HighIntensityStep />;

            case 'sakshi-bhav':
            case 'hridaya':
                // Meditation 5-5
                return <SimpleBreathingStep config={step} pattern={{ inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 }} />;

            case 'results':
                return <ResultsStep />;

            default:
                return <div>Unknown Step: {step.id}</div>;
        }
    };

    const isWelcomeStep = step.id === 'sankalpa';

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step.id}
                initial={isWelcomeStep ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)' }}
                animate={isWelcomeStep ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)' }}
                exit={isWelcomeStep ? { opacity: 0 } : { opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="w-full h-full flex items-center justify-center"
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>
    );
};
