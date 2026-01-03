/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Carbon Terminal Theme
                'carbon-bg': '#0E0F12',
                'carbon-panel': '#16181D',
                'carbon-accent': '#4ADE80',
                'carbon-accent-blue': '#38BDF8',
                'carbon-danger': '#F87171',
                'carbon-text': '#E5E7EB',
                'carbon-text-secondary': '#9CA3AF',
                'carbon-border': '#1F2937',
            },
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Consolas', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.3s ease-in',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
