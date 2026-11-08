module.exports = function docusaurusClarity(context, options) {
  const { projectId } = options

  return {
    name: 'docusaurus-clarity',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://www.clarity.ms',
            },
          },
          {
            tagName: 'script',
            innerHTML: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/${projectId}";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${projectId}");`,
          },
        ],
      }
    },
  }
}
