module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      zh: {
        label: '简体中文',
      },
    },
  },
  title: 'Chaos Mesh',
  tagline: 'A Powerful Chaos Engineering Platform for Kubernetes',
  url: 'https://chaos-mesh.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'chaos-mesh', // Usually your GitHub org/user name.
  projectName: 'chaos-mesh.github.io', // Usually your repo name.
  trailingSlash: true,
  themeConfig: {
    image: 'chaos-mesh-social-preview.png',
    algolia: {
      apiKey: '49739571d4f89670b12f39d5ad135f5a',
      indexName: 'chaos-mesh',
    },
    googleAnalytics: {
      trackingID: 'UA-90760217-2',
    },
    announcementBar: {
      content:
        'Chaos Mesh 2.0 was released in July, 2021, see <a href="/blog/chaos-mesh-2.0-to-a-chaos-engineering-ecology">what\'s new</a>!',
      backgroundColor: '#37b5fb',
    },
    navbar: {
      hideOnScroll: true,
      title: 'Chaos Mesh',
      logo: {
        alt: 'Chaos Mesh',
        src: 'img/logos/logo-mini.svg',
        srcDark: 'img/logos/logo-mini-white.svg',
      },
      items: [
        { type: 'docsVersionDropdown' },
        { to: 'docs', label: 'Documentation' },
        { to: 'interactive-tutorial', label: 'Interactive Tutorial' },
        {
          to: 'blog',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://community.cncf.io/chaos-mesh-community/',
          label: 'Events',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/chaos-mesh/chaos-mesh',
          className: 'header-github-link',
          'aria-label': 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Quick Start',
              to: 'docs/quick-start',
            },
            {
              label: 'Run a Chaos Experiment',
              to: 'docs/run-a-chaos-experiment',
            },
            {
              label: 'Developer Guide Overview',
              to: 'docs/developer-guide-overview',
            },
            {
              label: 'FAQs',
              to: 'docs/faqs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/chaos_mesh',
            },
            {
              label: 'Slack (#project-chaos-mesh)',
              href: 'https://slack.cncf.io/',
            },
            {
              label: 'Events',
              href: 'https://community.cncf.io/chaos-mesh-community/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/chaos-mesh/chaos-mesh',
            },
            {
              label: 'Blog',
              to: 'blog',
            },
          ],
        },
        {
          title: 'Others',
          items: [
            {
              html: '<a href="https://www.netlify.com"><img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" /></a>',
            },
          ],
        },
      ],
      copyright: `
        <br />
        <strong>© Chaos Mesh® Authors ${new Date().getFullYear()} | Documentation Distributed under CC-BY-4.0 </strong>
        <br />
        <br />
        © ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/"> Trademark Usage</a> page.
      `,
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    },
  },
  onBrokenLinks: 'warn',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/chaos-mesh/website/edit/master/',
          editLocalizedFiles: true,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/chaos-mesh/website/edit/master/',
          editLocalizedFiles: true,
        },
        theme: {
          customCss: require.resolve('./src/styles/custom.css'),
        },
      },
    ],
  ],
}
