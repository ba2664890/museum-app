/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          amber: "#f59e0b",
          orange: "#ea580c",
          red: "#dc2626",
        },
        secondary: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          green: "#10b981",
          pink: "#ec4899",
        },
        text: {
          primary: "#1f2937",
          secondary: "#6b7280",
          muted: "#9ca3af",
        },
        bg: {
          primary: "#ffffff",
          secondary: "#f9fafb",
          accent: "#fef3c7",
        },
        border: {
          light: "#e5e7eb",
          medium: "#d1d5db",
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgba(78, 13, 13, 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
