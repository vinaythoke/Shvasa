import { motion, AnimatePresence } from 'framer-motion';
import { ParticleRing } from './ParticleRing';

export type BreathingPhase = 'inhale' | 'exhale' | 'hold' | 'holdIn' | 'holdOut' | 'idle' | 'pulse' | 'retention';

interface BreathingCircleProps {
    phase: BreathingPhase;
    duration: number; // Duration of the current phase in seconds
    label?: string;
    sublabel?: string;
    color?: string;
    textColor?: string;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
    phase,
    duration,
    label,
    sublabel,
    color = '#FFFFFF',
    textColor = '#FFFFFF'
}) => {

    return (
        // Main Container - No distinct "Device" bezel, just the floating thermostat element
        <div className="relative flex items-center justify-center w-80 h-80">

            {/* The Active Thermostat Circle */}
            <motion.div
                className="relative rounded-full flex items-center justify-center overflow-hidden"
                initial={false}
                animate={{
                    scale: phase === 'pulse'
                        ? [1.0, 0.7, 1.0]
                        : (phase === 'exhale' || phase === 'holdOut' || phase === 'retention')
                            ? 0.7
                            : 1.0,
                }}
                transition={{
                    scale: phase === 'pulse'
                        ? { repeat: Infinity, duration: duration, ease: "easeInOut" }
                        : { duration: duration, ease: "easeInOut" }
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    // The Neon Ring - Fully Colored High Contrast
                    boxShadow: `
                        0 0 0 4px ${color},       // Hard Rim
                        0 0 60px -10px ${color},  // Outer Glow
                        inset 0 0 50px ${color}   // Inner Glow (Colored, not black)
                    `
                }}
            >
                {/* 1. Deep Rich Background Base (Vibrant, not Black) */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: color,
                        // Only slightly darken to let text pop, but keep it clearly COLORED
                        filter: 'brightness(0.6) saturate(120%)'
                    }}
                />

                {/* 2. Soft Gradient for Depth (Colored, not Black) */}
                {/* We use a dark transparent overlay, not opaque black */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)'
                    }}
                />

                {/* 3. Particle Canvas - The "Fizz" */}
                {/* Full bleed logic is handled in the component */}
                <div className="absolute inset-0 mix-blend-screen opacity-100">
                    <ParticleRing phase={phase} color={color} duration={duration} />
                </div>

                {/* 4. Glossy Shine (Top) */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none rounded-t-full" />
            </motion.div>

            {/* Text Content - Outside scaling circle for fixed size */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 text-center"
                style={{ color: textColor || '#FFFFFF', textShadow: `0 2px 20px ${color}` }}
            >
                <AnimatePresence mode="wait">
                    {label && (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <span className="text-4xl font-bold tracking-[0.1em] uppercase font-mono block">
                                {label}
                            </span>
                            {sublabel && (
                                <span className="text-xs opacity-70 mt-2 font-medium tracking-wider uppercase block">
                                    {sublabel}
                                </span>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
