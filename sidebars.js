/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "installation",
        "docker",
        "upgrade",
      ],
    },
  ],
};

module.exports = sidebars;
