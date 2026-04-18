// tailwind.config.ts
// Thêm animations custom vào config hiện tại

import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
                sans: ['Be Vietnam Pro', 'Inter', 'sans-serif'],
            },
            colors: {
                rose: {
                    // Custom rose palette cho wedding
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#C8445A',  // Primary brand
                    600: '#b03050',
                    700: '#951d42',
                    800: '#7e1838',
                    900: '#6b1630',
                },
                gold: {
                    400: '#C9984A',
                    500: '#b8852f',
                },
            },
            animation: {
                'wish-enter': 'wishEnter 0.4s ease-out forwards',
                'fade-out': 'fadeOut 4s ease-out forwards',
                'fade-in': 'fadeIn 0.3s ease-out',
                'bounce-once': 'bounceOnce 0.6s ease-out',
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'scroll-up': 'scrollUp var(--marquee-duration, 30s) linear infinite',
            },
            keyframes: {
                wishEnter: {
                    '0%': { transform: 'translateY(-12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '70%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                bounceOnce: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.3)' },
                },
                scrollUp: {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-50%)' },
                },
            },
        },
    },
    plugins: [],
}

export default config