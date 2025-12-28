export type Theme = 'sattva' | 'rajas' | 'tamas' | 'haryana';

export type StepId =
    | 'sankalpa'
    | 'udgeeth'
    | 'sama-vritti-warmup'
    | 'chandra-bhedana'
    | 'surya-bhedana'
    | 'anulom-vilom'
    | 'test-hold'
    | 'box-breathing'
    | 'high-intensity'
    | 'sakshi-bhav'
    | 'hridaya'
    | 'results';

export interface StepData {
    id: StepId;
    title: string;
    subtitle: string;
    description?: string;
    duration?: number; // in seconds, if fixed
    theme: Theme;
    colorClass: string;
    bgClass: string;
    textClass: string;
    hexColor: string; // Keep for fallback or meta theme color
    gradientColors: [string, string, string]; // 3 colors for rich gradient
    circleColor: string; // High contrast circle color
    circleTextColor: string;
    quote?: string;
}

// Indian Pastel / Vibrant Soothing Palette
export const STEPS: StepData[] = [
    {
        id: 'sankalpa',
        title: 'Sankalpa',
        subtitle: 'The Intention',
        description: 'Prana is the bridge between body and mind.',
        theme: 'sattva',
        colorClass: 'text-teal-900',
        bgClass: 'bg-teal-50',
        textClass: 'text-teal-950',
        hexColor: '#E0F2F1',
        gradientColors: ['#E0F2F1', '#B2DFDB', '#80CBC4'],
        circleColor: '#00897B', // Teal 600
        circleTextColor: '#FFFFFF',
        quote: '"Yogash chitta vritti nirodhah" — Yoga is the stilling of the fluctuations of the mind. (Yoga Sutras 1.2)'
    },
    {
        id: 'udgeeth',
        title: 'Udgeeth',
        subtitle: 'Om Chanting',
        description: 'Chant Om 5 times. 25% "O", 75% "M".',
        theme: 'tamas',
        colorClass: 'text-indigo-900',
        bgClass: 'bg-indigo-100',
        textClass: 'text-indigo-950',
        hexColor: '#D1C4E9',
        gradientColors: ['#EDE7F6', '#D1C4E9', '#9575CD'],
        circleColor: '#5E35B1', // Deep Purple 600
        circleTextColor: '#FFFFFF'
    },
    {
        id: 'sama-vritti-warmup',
        title: 'Sama Vritti',
        subtitle: 'Equal Breathing',
        duration: 180, // 3 mins
        theme: 'sattva',
        colorClass: 'text-indigo-900',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-950',
        hexColor: '#E8EAF6',
        gradientColors: ['#E8EAF6', '#C5CAE9', '#7986CB'],
        circleColor: '#3949AB', // Indigo 600
        circleTextColor: '#FFFFFF'
    },
    {
        id: 'chandra-bhedana',
        title: 'Chandra Bhedana',
        subtitle: 'Left Nostril',
        description: 'Cooling, calming energy.',
        duration: 180,
        theme: 'tamas',
        colorClass: 'text-blue-900',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-950',
        hexColor: '#E3F2FD',
        gradientColors: ['#E3F2FD', '#BBDEFB', '#64B5F6'],
        circleColor: '#1E88E5', // Blue 600
        circleTextColor: '#FFFFFF'
    },
    {
        id: 'surya-bhedana',
        title: 'Surya Bhedana',
        subtitle: 'Right Nostril',
        description: 'Heating, active energy.',
        duration: 180,
        theme: 'rajas',
        colorClass: 'text-orange-900',
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-950',
        hexColor: '#FFF3E0',
        gradientColors: ['#FFF3E0', '#FFE0B2', '#FFB74D'],
        circleColor: '#FB8C00', // Orange 600
        circleTextColor: '#FFFFFF'
    },
    {
        id: 'anulom-vilom',
        title: 'Anulom Vilom',
        subtitle: 'Alternate Nostril',
        description: 'Balancing the Nadis.',
        duration: 300,
        theme: 'sattva',
        colorClass: 'text-purple-900',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-950',
        hexColor: '#F3E5F5',
        gradientColors: ['#F3E5F5', '#E1BEE7', '#BA68C8'],
        circleColor: '#8E24AA', // Purple 600
        circleTextColor: '#FFFFFF'
    },
    {
        id: 'test-hold',
        title: 'The Test',
        subtitle: 'Breath Hold Check',
        duration: 180,
        theme: 'tamas',
        colorClass: 'text-slate-900',
        bgClass: 'bg-slate-100',
        textClass: 'text-slate-950',
        hexColor: '#ECEFF1',
        gradientColors: ['#ECEFF1', '#CFD8DC', '#90A4AE'],
        circleColor: '#546E7A', // BlueGrey 600
        circleTextColor: '#FFFFFF',
        quote: '"When the breath wanders the mind also is unsteady. But when the breath is calmed the mind too will be still." (Hatha Yoga Pradipika)'
    },
    {
        id: 'box-breathing',
        title: 'Sama Vritti',
        subtitle: 'Box Breathing',
        duration: 300,
        theme: 'sattva',
        colorClass: 'text-cyan-900',
        bgClass: 'bg-cyan-50',
        textClass: 'text-cyan-950',
        hexColor: '#E0F7FA',
        gradientColors: ['#E0F7FA', '#B2EBF2', '#4DD0E1'],
        circleColor: '#00ACC1', // Cyan 600
        circleTextColor: '#FFFFFF'
    },
    {
        id: 'high-intensity',
        title: 'Tapas',
        subtitle: 'High Intensity Retention',
        theme: 'rajas',
        colorClass: 'text-red-900',
        bgClass: 'bg-red-50',
        textClass: 'text-red-950',
        hexColor: '#FFEBEE',
        gradientColors: ['#FFEBEE', '#FFCDD2', '#E57373'],
        circleColor: '#E53935', // Red 600
        circleTextColor: '#FFFFFF',
        quote: '"Burn the impurities of the mind in the fire of discipline."'
    },
    {
        id: 'sakshi-bhav',
        title: 'Sakshi Bhav',
        subtitle: 'Witnessing',
        duration: 120, // Approx
        theme: 'tamas',
        colorClass: 'text-neutral-900',
        bgClass: 'bg-neutral-50',
        textClass: 'text-neutral-950',
        hexColor: '#F5F5F5',
        gradientColors: ['#FAFAFA', '#EEEEEE', '#BDBDBD'],
        circleColor: '#757575', // Grey 600
        circleTextColor: '#FFFFFF',
        quote: '"I am not the body, I am not even the mind." (Nirvana Shatakam)'
    },
    {
        id: 'hridaya',
        title: 'Hridaya',
        subtitle: 'Heart Focus',
        duration: 120,
        theme: 'sattva',
        colorClass: 'text-rose-900',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-950',
        hexColor: '#FCE4EC',
        gradientColors: ['#FCE4EC', '#F8BBD0', '#F06292'],
        circleColor: '#D81B60', // Pink 600
        circleTextColor: '#FFFFFF',
        quote: '"I am not the body, I am not even the mind." (Nirvana Shatakam)'
    },
    {
        id: 'results',
        title: 'The Mirror',
        subtitle: 'Session Results',
        theme: 'sattva',
        colorClass: 'text-amber-900',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-950',
        hexColor: '#FFF8E1',
        gradientColors: ['#FFF8E1', '#FFECB3', '#FFD54F'],
        circleColor: '#FFB300', // Amber 600
        circleTextColor: '#FFFFFF',
        quote: '"Rest in your own true nature." (Swarupa)'
    }
];
