/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ece9fe',
          200: '#d9d3fd',
          300: '#bcb0fb',
          400: '#9a86f7',
          500: '#7c5cf0',
          600: '#6a3fe3',
          700: '#5a30c8',
          800: '#4a29a1',
          900: '#3e2481'
        },
        peach: {
          100: '#fff1e8',
          300: '#ffcfa8',
          500: '#ff9f5b'
        }
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(76, 41, 161, 0.25)',
        card: '0 4px 24px -4px rgba(20, 10, 60, 0.08)'
      },
      borderRadius: {
        xl2: '1.5rem'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        pop: 'pop 0.3s ease-out both'
      }
    }
  },
  plugins: []
};
