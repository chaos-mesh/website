/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,jsx}'],
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  plugins: [require('daisyui')],
}
