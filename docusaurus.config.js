// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
import { themes as prismThemes } from 'prism-react-renderer'

/** @type {import('@docusaurus/types').Config} */
const config = {
  future: {
    experimental_faster: true,
    v4: true,
  },
  title: 'Chaos Mesh',
  tagline: 'A Powerful Chaos Engineering Platform for Kubernetes',
  favicon: '/img/favicon.ico',

  // Set the production url of your site here
  url: 'https://chaos-mesh.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'chaos-mesh', // Usually your GitHub org/user name.
  projectName: 'chaos-mesh.github.io', // Usually your repo name.

  onBrokenLinks: 'warn',
  trailingSlash: true,

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

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-T31S4LR9LL',
        },
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/chaos-mesh/website/edit/master/',
          editLocalizedFiles: true,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/chaos-mesh/website/edit/master/',
          editLocalizedFiles: true,
        },
        theme: {
          customCss: './src/styles/custom.css',
        },
      }),
    ],
  ],

  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    image: '/img/chaos-mesh-social-preview.png',
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
        { to: 'docs', label: 'Documentation' },
        {
          to: 'blog',
          label: 'Blog',
        },
        {
          href: 'https://community.cncf.io/chaos-mesh-community/',
          label: 'Community Group',
        },
        {
          to: 'contact',
          label: 'Contact Us',
        },

        {
          type: 'docsVersionDropdown',
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr style="margin: .5em 0;" />',
            },
            { to: '/versions', label: 'All Versions' },
            { to: '/supported-releases', label: 'Supported Releases' },
          ],
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
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'CNCF Community Group',
              href: 'https://community.cncf.io/chaos-mesh-community/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/chaos-mesh/chaos-mesh',
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
          title: 'Acknowledgements',
          items: [
            {
              label: 'Thanks for the technology illustrations by Storyset',
              href: 'https://storyset.com/technology',
            },
            {
              html: `
                <a href="https://www.netlify.com">
                  <img src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg" alt="Deploys by Netlify" />
                </a>
              `,
            },
            {
              html: `
                <img
                  referrerpolicy="no-referrer-when-downgrade"
                  src="https://static.scarf.sh/a.png?x-pxid=3103bfa4-2073-4b9a-bdac-f36f63d979a4"
                />
              `,
            },
          ],
        },
      ],
      copyright: `
        <p style="font-weight: 500;">Copyright © Chaos Mesh Authors ${new Date().getFullYear()} | Documentation Distributed under CC-BY-4.0</p>
        © ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/"> Trademark Usage</a> page.
      `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: {
        plain: prismThemes.vsDark.plain,
        styles: [
          ...prismThemes.vsDark.styles,
          {
            types: ['function', 'keyword'],
            style: {
              color: '#f25c7c',
            },
          },
        ],
      },
      additionalLanguages: ['bash'],
    },
  },

  plugins: [
    './docusaurus-tailwind-v3',
    ['@gracefullight/docusaurus-plugin-microsoft-clarity', { projectId: 'lggqck9srz' }],
  ],
}

export default config
