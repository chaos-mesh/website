module.exports = function () {
  return {
    name: 'docusaurus-tailwind',
    configurePostCss(options) {
      options.plugins.push(require('@tailwindcss/postcss'))

      return options
    },
  }
}
