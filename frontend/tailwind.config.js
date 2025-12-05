/** @type {import('tailwindcss').Config} */
module.exports = {
    // 1. Ensure content paths are correct
    content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
    theme: {
        extend: {
            // 2. Add the custom animation for card entry
            keyframes: {
                'slide-in': {
                    '0%': { 
                        opacity: '0', 
                        transform: 'translateY(20px)' 
                    },
                    '100%': { 
                        opacity: '1', 
                        transform: 'translateY(0)' 
                    },
                },
            },
            animation: {
                'slide-in': 'slide-in 0.5s ease-out forwards',
            },
        },
    },
    // 3. Add the Tailwind Scrollbar plugin (if installed)
    plugins: [
        require('tailwind-scrollbar'),
    ],
}