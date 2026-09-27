/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We support both light and dark modes
  theme: {
    extend: {
      colors: {
        // Concept B: Soft Social Base Colors
        background: {
          light: '#FAFAFA', // Soft off-white
          dark: '#0F172A',  // Deep slate/navy
        },
        card: {
          light: '#FFFFFF',
          dark: '#1E293B',
        },
        // Semantic Colors
        primary: {
          DEFAULT: '#6366F1', // Indigo (Brand / Action)
          light: '#EEF2FF',
          dark: '#4F46E5',
        },
        success: {
          DEFAULT: '#10B981', // Mint Green (Settled / Money)
          light: '#D1FAE5',
          dark: '#059669',
        },
        danger: {
          DEFAULT: '#F43F5E', // Rose / Coral (Debt / Alert)
          light: '#FFE4E6',
          dark: '#E11D48',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber (Pending)
          light: '#FEF3C7',
          dark: '#D97706',
        }
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'soft-dark': '0 10px 40px -10px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
