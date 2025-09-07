// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Kondev Blog',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://blog.kondev.de',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB',
      },
      de: {
        htmlLang: 'de-DE',
      },
    }
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          routeBasePath: '/', // Serve the blog at the site's root
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Konstantin Protzen.`,
            createFeedItems: async (params) => {
              const { blogPosts, defaultCreateFeedItems, ...rest } = params;
              return defaultCreateFeedItems({
                blogPosts: blogPosts.filter((item, index) => index < 100),
                ...rest,
              });
            },
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Konstantin Protzen',
        logo: {
          alt: 'Konstantin Protzen Logo',
          src: 'img/logo.webp',
        },
        items: [
          {
            href: 'https://github.com/cuzimbisonratte',
            label: 'GitHub',
            position: 'left',
          },
          {
            href: 'https://konstantin-protzen.de',
            label: 'Homepage',
            position: 'left',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Links',
            items: [
              {
                label: 'Homepage',
                href: 'http://konstantin-protzen.de',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/cuzimbisonratte',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/users/584769962355326995/',
              },
              {
                label: 'Steam',
                href: 'https://s.team/p/cqmc-jtcd',
              },
            ],
          },
          {
            title: 'Projects',
            items: [
              {
                label: 'Overview',
                href: 'https://konstantin-protzen.de/?slide=3',
              },
              {
                label: 'ShareSimple',
                href: 'https://sharesimple.de',
              },
              {
                label: 'Noten-App',
                href: 'https://noten-app.de',
              },
              {
                label: 'OSLeM',
                href: 'https://github.com/cuzimbisonratte/oslem',
              },
              {
                label: 'PresentStat',
                href: 'https://github.com/cuzimbisonratte/presentstat',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Konstantin Protzen.<br><h6 class="affiliate-note">Links to any external platform may be affiliate links. If you buy something through one of these links, I get a small commission at no extra cost for you. This helps me to keep this blog running. Thank you for your support!</h6>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          },
          {
            className: 'code-block-remove-line',
            line: 'remove-next-line',
            block: { start: 'remove-start', end: 'remove-end' },
          },
          {
            className: 'code-block-add-line',
            line: 'add-next-line',
            block: { start: 'add-start', end: 'add-end' },
          },
        ],
      },
    }),
};

export default config;
