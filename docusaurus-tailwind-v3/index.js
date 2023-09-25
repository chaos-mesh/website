module.exports = function () {
  return {
    name: 'docusaurus-tailwind-v3',
    configurePostCss(options) {
      options.plugins.push(require('tailwindcss'), require('autoprefixer'))

      return options
    },
  }
}
