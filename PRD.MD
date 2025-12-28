Product Requirements Document: Shvasa (श्वास)
Version: 2.0
Type: Progressive Web Application (PWA)
Core Philosophy: "Ancient Wisdom, Modern Science."
1. Executive Summary
Shvasa is a mobile-first Progressive Web App designed to guide users through a scientifically structured breathing protocol deeply rooted in Indian Vedic traditions (Pranayama). Unlike generic meditation apps, Shvasa focuses on physiological state-shifting—using controlled breath retention (Kumbhaka) and rhythmic breathing to lower the resting heart rate, activate the parasympathetic nervous system, and unlock deep focus states (Dharana).
Target Audience: High-performance individuals, students, and anyone seeking to elevate efficiency and productivity by mastering their autonomic nervous system.
2. The Core User Journey: "The Prana Path"
The application follows a linear, "rail-roaded" journey. The user cannot skip ahead without completing the previous step, ensuring discipline (Tapas).
Phase 1: Tuning In (Dharana)
Step 1: The Sankalpa (Welcome)
Concept: Setting intention.
UI: Minimalist. A single pulsating circle.
Action: "Begin Journey" button.
Affirmation: “Prana is the bridge between body and mind.”
Step 2: Udgeeth (Om Chanting)
Scripture Reference: Mandukya Upanishad (Om is the sound of the universe).
Logic: 5 repetitions. 25% "O" sound, 75% "M" sound (vagus nerve stimulation).
Interaction: User taps a large ripple-effect button after each chant. Counter 1/5.
Phase 2: Balancing (Nadi Shodhana)
Step 3: Pre-Warm Up (Equal Breathing)
Sanskrit: Sama Vritti.
Duration: 3 Minutes.
Visual: A circle expanding (inhale) and contracting (exhale) smoothly.
Step 4 & 5: Surya & Chandra Bhedana (Single Nostril)
Step 4 (Left Nostril - Chandra): Cooling, calming energy. Background Theme: Cool Indigo.
Step 5 (Right Nostril - Surya): Heating, active energy. Background Theme: Warm Amber.
Duration: 3 Minutes each.
Step 6: Anulom Vilom (Alternate Nostril)
Scripture Reference: Hatha Yoga Pradipika (Purification of the Nadis).
Visual Guide: An animation that flows in a figure-8 or sine wave, indicating the switching of nostrils.
Phase 3: Vitality (Kumbhaka)
Step 7: The "Test" Hold
Concept: A short breath hold to prepare the lungs.
Duration: 3 Minutes guided session.
Step 8: Sama Vritti (Box Breathing)
Logic: Rhythmic stabilization.
Customization: User toggle for "Apprentice (2-8-2-8)" vs "Yogi (3-12-3-12)".
Visual: A square path tracing the breath: Inhale > Hold > Exhale > Hold.
Phase 4: The Peak (Tapas)
Step 9: High-Intensity Retention (6 Rounds)
Concept: Controlled Hypoxia (Simulating high altitude to boost red blood cells).
The Loop (Repeats 6 times):
Hyperventilation (30s): Fast, rhythmic pulsing visual (Bellows breath / Bhastrika).
Retention (Manual): User taps "Hold". Timer starts counting up from 00:00. Screen goes dark to save battery and focus.
Release: User taps "Exhale".
Recovery: 15s cool down before the next round auto-starts.
Data Capture: The app MUST record the "Retention" time for rounds 1 through 6 silently.
Phase 5: Integration (Samadhi)
Step 10: Sakshi Bhav (Witnessing)
Action: Meditation in "Chaos". Observe sounds without reaction.
Step 11: Hridaya (Heart Focus)
Action: Listen to the heartbeat.
Completion: The session ends automatically after the timer.
Phase 6: The Mirror (Results)
Content: Display a clean list of Breath Hold Times for Rounds 1, 2, 3, 4, 5, and 6.
Tone: "Observe your capacity. Do not judge it."
Action: "Restart" or "Share Quote".
3. Technical Architecture & Implementation Notes
A. The "Unbreakable" Timer Logic (Critical)
Mobile browsers throttle JavaScript timers (setInterval or setTimeout) when the screen turns off or the tab is backgrounded to save battery. This ruins breathing apps.
The Solution:
Screen Wake Lock API: The app must request navigator.wakeLock immediately upon starting the session. This prevents the screen from dimming or locking, which is the preferred behavior for a guided session.
JavaScript
let wakeLock = null;
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch (err) {
    console.log(`${err.name}, ${err.message}`);
  }
};


Web Workers (The Heartbeat): Do not run the timer on the main UI thread. Spawn a dedicated Web Worker to handle the "tick". Web Workers run in a separate thread and are less susceptible to UI jank.
Delta Correction:
Store const startTime = Date.now();
On every tick, calculate elapsed = Date.now() - startTime;
Update the UI based on elapsed. Do not rely on count++ inside an interval, as it will drift.
B. Audio Architecture
Library: Use Howler.js for reliable mobile audio.
Assets:
Drone.mp3: A base 432Hz Tanpura drone (always looping).
Guide.mp3: Specific tracks for active phases.
Behavior: Audio must continue playing even if the Wake Lock fails and the screen goes dark. (Use the HTML5 Audio API with playsinline).
C. Technology Stack
Framework: React (Next.js is preferred for PWA ease).
Styling: Tailwind CSS (for rapid, utility-first styling).
State Management: Zustand (lightweight). We need to store the "Round 1-6" data globally so it persists if a component re-renders.
Persistence: localStorage. If the user accidentally refreshes during Round 4, the app should ask "Resume Session?" and restore state.
4. UX/UI & Design System
Color Psychology (Trigunas)
Sattva (Purity/Balance): White #FFFFFF & Sky Blue #E0F7FA (Used for Anulom Vilom).
Rajas (Energy/Action): Soft Amber #FFECB3 (Used for Right Nostril & Hyperventilation).
Tamas (Rest/Grounding): Deep Indigo #1A237E (Used for Breath Holds & Meditation).
Haptic Feedback (The "Invisible" UI)
Since users often close their eyes:
Short Vibration: Start of Inhale.
Long Vibration: Start of Exhale.
Double Pulse: Phase complete.
Implementation: navigator.vibrate(200) (Check for iOS compatibility/fallback).
5. Affirmations & Scriptural Tone
Use these strings for the "loading" or "transition" screens to reinforce the Indian context.
Welcome: "Yogash chitta vritti nirodhah" — Yoga is the stilling of the fluctuations of the mind. (Patanjali Yoga Sutras 1.2)
Breath Hold: "When the breath wanders the mind also is unsteady. But when the breath is calmed the mind too will be still." (Hatha Yoga Pradipika)
Hyperventilation: "Burn the impurities of the mind in the fire of discipline."
Meditation: "I am not the body, I am not even the mind." (Nirvana Shatakam)
Completion: "Rest in your own true nature." (Swarupa)

