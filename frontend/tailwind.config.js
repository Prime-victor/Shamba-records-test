/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2F855A",
        "primary-dark": "#276749",
        "primary-light": "#48BB78",
        secondary: "#D69E2E",
        "secondary-light": "#F6E05E",
        danger: "#E53E3E",
        success: "#38A169",
        info: "#3182CE",
        background: "#F7FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        ink: "#1A202C",
        muted: "#4A5568",
        sidebar: "#1A202C",
        "sidebar-text": "#CBD5E0",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 14px 30px rgba(26, 32, 44, 0.08)",
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      backgroundImage: {
        "field-grid":
          "radial-gradient(circle at 1px 1px, rgba(47,133,90,0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
