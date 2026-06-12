/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ios-bg': '#F2F2F7',
        'ios-surface': '#FFFFFF',
        'ios-text': '#1C1C1E',
        'ios-text-secondary': '#8E8E93',
        'ios-accent': '#007AFF',
        'ios-destructive': '#FF3B30',
        'ios-success': '#34C759',
        'ios-separator': 'rgba(60,60,67,0.12)',
        'ios-blur-bg': 'rgba(255,255,255,0.72)',
      },
      fontFamily: {
        'ios': ['-apple-system', 'SF Pro Display', 'SF Pro Text', 'PingFang SC', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
      boxShadow: {
        'ios': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'ios-md': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'ios-lg': '0 8px 24px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.04)',
        'ios-tab': '0 -2px 16px rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        'ios': '20px',
      }
    },
  },
  plugins: [],
}
