/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 토스 컬러 시스템
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        toss: {
          blue: '#3182f6',
          'blue-light': '#e8f3ff',
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
          red: '#f04452',
          green: '#52c41a',
          orange: '#fa8c16',
        },
        // LoL 티어 컬러
        tier: {
          iron: '#5a5a5a',
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          platinum: '#00ffff',
          emerald: '#50c878',
          diamond: '#b9f2ff',
          master: '#9d4edd',
          grandmaster: '#ff6b6b',
          challenger: '#ffd43b',
        }
      },
      fontFamily: {
        'pretendard': ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'toss': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'toss-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
} 