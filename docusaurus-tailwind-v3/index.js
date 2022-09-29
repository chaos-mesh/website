module.exports = function () {
  return {
    name: 'docusaurus-tailwind-v3',
    configurePostCss(options) {
      options.plugins.push(
        require('postcss-import'),
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('autoprefixer') // Already exists in Docusaurus dependencies.
      )

      return options
    },
  }
}
