import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export const AudioController: React.FC = () => {
    const isMusicPlaying = useStore(state => state.isMusicPlaying);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    useEffect(() => {
        // Initialize Audio Element
        if (!audioRef.current) {
            const audio = new Audio('/music/music.aac');
            audio.loop = true;
            audioRef.current = audio;
        }

        const initAudioContext = () => {
            if (!audioContextRef.current && audioRef.current) {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContextClass();

                const gainNode = audioContextRef.current.createGain();
                gainNode.gain.value = 0;
                gainNode.connect(audioContextRef.current.destination);
                gainNodeRef.current = gainNode;

                const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                source.connect(gainNode);
                sourceRef.current = source;
            }
        };

        if (isMusicPlaying) {
            initAudioContext();

            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }

            if (audioRef.current) {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));

                // Smooth fade in
                if (gainNodeRef.current && audioContextRef.current) {
                    gainNodeRef.current.gain.setTargetAtTime(0.4, audioContextRef.current.currentTime, 2);
                }
            }
        } else {
            // Smooth fade out and then pause
            if (gainNodeRef.current && audioContextRef.current) {
                gainNodeRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.8);

                // Pause after fade out
                setTimeout(() => {
                    if (!useStore.getState().isMusicPlaying && audioRef.current) {
                        audioRef.current.pause();
                    }
                }, 2000);
            }
        }
    }, [isMusicPlaying]);

    return null; // Invisible component
};
