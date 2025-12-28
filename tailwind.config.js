/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sattva: {
                    main: '#FFFFFF',
                    light: '#E0F7FA', // Sky Blue
                },
                rajas: {
                    main: '#FFECB3', // Soft Amber
                    accent: '#FFB74D', // Deeper Orange/Saffron
                },
                tamas: {
                    main: '#1A237E', // Deep Indigo
                    dark: '#000051',
                },
                shvasa: {
                    saffron: '#FF9933',
                    indigo: '#1A237E',
                }
            },
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
