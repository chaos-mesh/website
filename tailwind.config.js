/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  plugins: [require('daisyui')],
  daisyui: {
    theme: false,
  },
}
