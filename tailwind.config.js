/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0F172A', // Slate 900
                    foreground: '#F8FAFC', // Slate 50
                },
                accent: {
                    DEFAULT: '#6366F1', // Indigo 500
                    hover: '#4F46E5', // Indigo 600
                },
                background: '#FAF9F6', // Off-white/Cream
                surface: '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Calistoga', 'serif'], // Good for "University" feel
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [],
}
