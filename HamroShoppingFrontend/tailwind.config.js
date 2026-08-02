/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1f2937",
        primary: "#2563eb",
        secondary: "#1e40af",
        accent: "#f59e0b",
        success: "#10b981",
        error: "#ef4444",
        muted: "#f3f4f6",
      },
    },
  },
  plugins: [],
};