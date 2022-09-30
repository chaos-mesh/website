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
      appId: '3BY0S3HQX6',
      apiKey: '99bb3af44d57f0e8f6d7e019d7e2c2d7',
      indexName: 'chaos-mesh',
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
        {
          type: 'docsVersionDropdown',
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr style="margin: .5em 0;" />',
            },
            { to: '/versions', label: 'All versions' },
          ],
        },
        { to: 'docs', label: 'Documentation' },
        {
          href: 'https://community.cncf.io/chaos-mesh-community/',
          label: 'Events',
        },
        {
          to: 'blog',
          label: 'Blog',
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
              label: 'Events',
              href: 'https://community.cncf.io/chaos-mesh-community/',
            },
            {
              label: 'Slack (#project-chaos-mesh)',
              href: 'https://slack.cncf.io/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/chaos_mesh',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/chaos-mesh/chaos-mesh',
            },
          ],
        },
        {
          title: 'Thanks',
          items: [
            {
              html: '<a href="https://www.netlify.com"><img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" /></a>',
            },
          ],
        },
      ],
      copyright: `
        <br />
        <strong>© Chaos Mesh Authors ${new Date().getFullYear()} | Documentation Distributed under CC-BY-4.0 </strong>
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
        googleAnalytics: {
          trackingID: 'UA-90760217-2',
        },
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
  plugins: ['./docusaurus-tailwind-v3'],
  scripts: ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js'],
}
