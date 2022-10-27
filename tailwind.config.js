/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  prefix: 'tw-',
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: {
    preflight: false,
  },
  plugins: [require('daisyui')],
  daisyui: {
    base: false,
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: '#172d72',
        },
      },
      {
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          primary: '#10a6fa',
        },
      },
    ],
  },
}
