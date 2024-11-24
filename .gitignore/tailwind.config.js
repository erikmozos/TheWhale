/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {

      margin: {
        'mt-custom': '2rem', // Aquí defines el valor que desees para el margen superior
      },

      backgroundImage: {
        'gradient-peri-1': 'linear-gradient(90deg, #7BE0AD, #559D7E)',
      },

      colors: {
        background: '#F1F1F1',
        text: '#595959',
        primary: '#7BE0AD',
        secondary: '#559D7E',
        white: '#FFFFFF',
        black: '#000000',
        border: '#ccc',
        'box-shadow': 'rgba(0, 0, 0, 0.3)',
        'box-shadow-light': 'rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
        lora: ['Lora', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        h1: '40px',
        h2: '33px',
        h3: '26px',
        h4: '22px',
        p: '16px',
        titol: '36px',
        redirect: '18px',
      },
      spacing: {
        'header-height': '90px',
        'card-width': '500px',
        'card-height': '450px',
        'login-container-width': '300px',
      },
      boxShadow: {
        default: '0 4px 15px rgba(0, 0, 0, 0.3)',
        light: '0 4px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        custom: 'var(--radius)', // Añade esta si necesitas personalizar el mixin de radius
      },
      transitionProperty: {
        custom: 'all', // Para replicar el mixin de `transition`
      },
      transitionTimingFunction: {
        custom: 'ease', // Para la animación suave
      },
      transitionDuration: {
        custom: '300ms', // Por defecto
      },
    },
  },
  plugins: [],
};
