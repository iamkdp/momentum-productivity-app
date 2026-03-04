// /** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['Sora', 'sans-serif'],
                body: ['DM Sans', 'sans-serif'],
            },
            keyframes: {
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'slide-in': {
                    '0%': { opacity: '0', transform: 'translateX(100%)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                'pulse-once': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.15)' }
                }
            },
            animation: {
                'fade-up': 'fade-up 0.4s ease-out forwards',
                'fade-in': 'fade-in 0.3s ease-out forwards',
                'slide-in': 'slide-in 0.35s ease-out forwards',
                'pulse-once': 'pulse-once 0.4s ease-in-out'
            }
        },
    },
    plugins: [],
}