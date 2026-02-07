/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tron: {
          black: "#0a0a0f",
          panel: "#12121a",
          blue: "#00d4ff",
          "blue-dim": "#00a8cc",
          "blue-glow": "rgba(0, 212, 255, 0.4)",
          orange: "#ff9500",
        },
      },
      boxShadow: {
        "tron-glow": "0 0 20px rgba(0, 212, 255, 0.3)",
        "tron-glow-sm": "0 0 10px rgba(0, 212, 255, 0.2)",
      },
    },
  },
  plugins: [],
};
