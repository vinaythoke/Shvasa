import React, { useEffect, useRef } from 'react';

interface Particle {
    radius: number;
    angle: number; // in radians
    dist: number; // distance from center
    speed: number;
    flowMultiplier: number; // Individual variance in radial speed (0.5 - 1.5)
}

interface ParticleRingProps {
    phase: 'inhale' | 'exhale' | 'hold' | 'holdIn' | 'holdOut' | 'idle' | 'pulse';
    color: string; // Hex color
    duration: number; // Duration of phase in seconds
}

export const ParticleRing: React.FC<ParticleRingProps> = ({ phase, color, duration }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    // Track phase in ref to avoid re-triggering effect
    const phaseRef = useRef(phase);
    const durationRef = useRef(duration);

    useEffect(() => { phaseRef.current = phase; }, [phase]);
    useEffect(() => { durationRef.current = duration; }, [duration]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configuration
        const size = 300; // Resolution
        const center = size / 2;
        const particleCount = 400;
        const particles: Particle[] = [];

        // Initialize particles with varied properties
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                radius: Math.random() * 1.5 + 0.5,
                angle: Math.random() * Math.PI * 2,
                // Distribute evenly throughout the radius
                dist: Math.random() * 120 + 20, // Spread from 20-140
                speed: (Math.random() - 0.5) * 0.05,
                // Individual flow speed multiplier (creates staggered movement)
                flowMultiplier: Math.random() * 1.0 + 0.5 // Range: 0.5x to 1.5x
            });
        }

        // Set canvas size
        canvas.width = size;
        canvas.height = size;

        // Animation Loop
        const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

        // Physics State
        let currentRadialFlow = 0;
        let phaseStartTime = Date.now();
        let lastPhase = phaseRef.current;

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, size, size);

            // Neon Glow Mode
            // ctx.globalCompositeOperation = 'screen'; // Lighter blend
            ctx.globalCompositeOperation = 'screen';

            const currentPhase = phaseRef.current;
            const phaseDuration = durationRef.current;

            // Track phase changes to reset timer
            if (currentPhase !== lastPhase) {
                phaseStartTime = Date.now();
                lastPhase = currentPhase;
            }

            // Calculate time within current phase (0 to 1)
            const timeInPhase = (Date.now() - phaseStartTime) / (phaseDuration * 1000);
            const normalizedTime = Math.min(1, Math.max(0, timeInPhase));

            // Ease-in-ease-out using sine wave
            // At start (0): easeFactor = 0
            // At middle (0.5): easeFactor = 1  
            // At end (1): easeFactor = 0
            const easeFactor = Math.sin(normalizedTime * Math.PI);

            // Calculate target flow based on duration
            // Distance to travel: ~125 pixels (from 20 to 145 or vice versa)
            // Multiply by 2.5 to make directional movement VERY obvious
            const travelDistance = 125; // Approximate radius range
            const baseFlowSpeed = travelDistance / (phaseDuration * 60); // pixels per frame
            const maxFlowSpeed = baseFlowSpeed * 2.5; // Make movement much more obvious

            // Apply easing to create gradual acceleration/deceleration
            const targetFlowSpeed = maxFlowSpeed * easeFactor;

            // 1. Determine Flow Direction (Velocity)
            let targetFlow = 0;

            // Inhale: Particles move INWARD (air flowing into nose)
            if (currentPhase === 'inhale') {
                targetFlow = -targetFlowSpeed; // Negative = inward
            }
            // Exhale: Particles move OUTWARD (air flowing out of nose)
            else if (currentPhase === 'exhale') {
                targetFlow = targetFlowSpeed; // Positive = outward
            }
            // Hold: No driven flow, just drift
            else {
                targetFlow = 0;
            }

            // Smooth momentum change (Inertia) - increased for more responsive easing
            currentRadialFlow = lerp(currentRadialFlow, targetFlow, 0.2);

            particles.forEach(p => {
                // Check if we're in a holding phase (once for the whole loop iteration)
                const isHolding = currentPhase === 'hold' || currentPhase === 'holdIn' || currentPhase === 'holdOut' || currentPhase === 'idle';

                // Swirl (reduce during hold for near-stillness, minimal during active breathing)
                const swirlSpeed = isHolding ? 0.05 : 0.1;
                p.angle += p.speed * swirlSpeed;

                // Radial Movement (The Breath)
                // Apply flow velocity WITH individual particle variation
                const individualFlow = currentRadialFlow * p.flowMultiplier;
                p.dist += individualFlow;

                // Random Brownian Motion (Perpetual "Alive" feel)
                // Nearly eliminate jitter during active breathing for crystal-clear directional flow
                // Keep minimal during hold
                const jitter = isHolding ? 0.05 : 0.01;
                p.dist += (Math.random() - 0.5) * jitter;

                // Boundaries & Recycling (to avoid ring clumping)
                const maxDist = 145;
                const minDist = 10;

                // Instead of hard clamping, recycle particles that go out of bounds
                if (p.dist > maxDist) {
                    // Particle escaped outward - recycle to inner area
                    p.dist = minDist + Math.random() * 30; // Spawn near center
                    p.angle = Math.random() * Math.PI * 2; // Randomize angle
                }
                if (p.dist < minDist) {
                    // Particle escaped inward - recycle to outer area
                    p.dist = maxDist - Math.random() * 30; // Spawn near edge
                    p.angle = Math.random() * Math.PI * 2;
                }

                const x = center + Math.cos(p.angle) * p.dist;
                const y = center + Math.sin(p.angle) * p.dist;

                ctx.beginPath();
                ctx.arc(x, y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;

                // Density/Opacity Logic
                // Fade particles near boundaries to make recycling seamless
                let opacityFactor = 1.0;
                if (p.dist < 30) {
                    opacityFactor = p.dist / 30; // Fade in near center
                } else if (p.dist > 120) {
                    opacityFactor = (145 - p.dist) / 25; // Fade out near edge
                }

                const baseAlpha = (p.dist / maxDist) * 0.5 + 0.2;
                ctx.globalAlpha = Math.min(0.9, baseAlpha * opacityFactor);

                ctx.fill();
            });

            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [color]); // Only re-init if color changes (rare)

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full absolute inset-0 pointer-events-none"
        />
    );
};
