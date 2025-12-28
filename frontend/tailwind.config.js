/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores base
        black: {
          DEFAULT: "#000000",
          dark: "#000000",
        },

        white: "#FFFFFF",

        pink: {
          DEFAULT: "#E83388",
        },

        // Grises y escala extendida
        gray: {
          50: "#F2F2F2",   // Blanco 5%
          100: "#E6E6E6",  // Blanco 10% / “9”
          500: "#808080",  // Blanco 30%
          600: "#666666",  // Black-40
          700: "#272727",  // Gris
          900: "#111216",  // “2”
          925: "#17181C",  // “3”
          950: "#0F0F15",  // “1”
          975: "#1F222D",  // “4”
        },

        border: "#141414",

        // Texto
        text: {
          primary: "#FFFFFF",
        },

        // Gradientes del botón primario
        primary: {
          light: "#F976C6",   // arriba
          dark: "#C9557A",   // abajo
        },
      },

      borderRadius: {
        pill: "100px", // Botones redondeados 
      },
      // *** Para los botones con degradado (gradiente) ***
      backgroundImage: {
        // Nombre de la utilidad: bg-primary-gradient
        'primary-gradient': 'linear-gradient(to right, #FF70B3, #F976C6)', // Usando primary.dark y primary.light
        // Nombre de la utilidad para el hover: bg-primary-gradient-hover
        'primary-gradient-hover': 'linear-gradient(to right, #B94C6D, #E96BB9)', // Un poco más oscuro para el hover
      },
      boxShadow: {
        // Nombre de la utilidad para la sombra: shadow-primary-btn
        'primary-btn': '0 4px 6px -1px rgba(232, 51, 136, 0.4), 0 2px 4px -2px rgba(232, 51, 136, 0.4)',
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};