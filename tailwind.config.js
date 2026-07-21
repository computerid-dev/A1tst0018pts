/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        panel: "#101014",
        panel2: "#16161c",
        border: "#242430",
        muted: "#9a9aa5",
        accent: "#7c5cff",
        accent2: "#33b5ff",
        danger: "#ff4a4a",
        success: "#2dae5f"
      },
      borderRadius: {
        card: "16px"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.5)"
      }
    }
  },
  plugins: []
};
