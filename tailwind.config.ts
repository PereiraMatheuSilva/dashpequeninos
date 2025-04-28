/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... outras configurações
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        // ... outras cores
      },
      // ... outras extensões do tema
    },
  },
  plugins: [require("tailwindcss-animate")],
}