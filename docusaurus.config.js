// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "SENAITE",
  tagline: "Enterprise Open Source Laboratory System",
  favicon: "img/favicon.ico",

  url: "https://www.senaite.com",
  baseUrl: "/",

  organizationName: "senaite",
  projectName: "senaite.com",

  onBrokenLinks: "warn",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/senaite/senaite.com/tree/main/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/senaite_product_logo.svg",

      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      navbar: {
        title: "",
        logo: {
          alt: "SENAITE",
          src: "img/senaite_product_logo_text.svg",
          srcDark: "img/senaite_product_logo_grey.svg",
          width: 160,
        },
        items: [
          {
            to: "/features",
            label: "Features",
            position: "left",
          },
          {
            to: "/enterprise",
            label: "Enterprise",
            position: "left",
          },
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://community.senaite.org",
            label: "Community",
            position: "right",
          },
          {
            href: "https://github.com/senaite/senaite.core",
            label: "GitHub",
            position: "right",
          },
        ],
      },

      footer: {
        style: "light",
        links: [
          {
            title: "Product",
            items: [
              { label: "Features", to: "/features" },
              { label: "Enterprise", to: "/enterprise" },
              { label: "Documentation", to: "/docs/installation" },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Community Forum",
                href: "https://community.senaite.org",
              },
              {
                label: "GitHub",
                href: "https://github.com/senaite",
              },
              {
                label: "PyPI",
                href: "https://pypi.org/project/senaite.lims",
              },
            ],
          },
          {
            title: "Service Providers",
            items: [
              {
                label: "RIDING BYTES",
                href: "https://www.ridingbytes.com",
              },
              {
                label: "Nara Labs",
                href: "https://naralabs.com",
              },
              {
                label: "YME",
                href: "https://yme.rocks/en",
              },
            ],
          },
        ],
        copyright: `Copyright \u00a9 2017\u2013${new Date().getFullYear()} SENAITE Project`,
      },

      prism: {
        theme: require("prism-react-renderer").themes.github,
        darkTheme: require("prism-react-renderer").themes.dracula,
        additionalLanguages: ["ini", "bash", "shell-session"],
      },
    }),
};

module.exports = config;
