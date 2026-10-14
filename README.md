# senaite.com

Source for the [SENAITE](https://www.senaite.com) website, built with
[Docusaurus v3](https://docusaurus.io).

The site is served by GitHub Pages from
[senaite/senaite.github.io](https://github.com/senaite/senaite.github.io)
and published with `bin/deploy`.


## Requirements

- Node.js 20 or later
- npm (bundled with Node.js)


## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
bin/dev
```

The site is available at `http://localhost:3001` (port 3001, so it can run
next to other Docusaurus sites on 3000; override with `PORT=`). Most changes
are reflected immediately without a full page reload. `bin/dev --kill` stops a
stale dev server left on the port.


## Build

Generate the static site:

```bash
npm run build
```

Output is written to `build/`. Serve it locally to verify the production
build:

```bash
npm run serve
```


## Project structure

```
senaite.com/
├── bin/
│   ├── dev                  Local dev server
│   └── deploy               Build and publish to GitHub Pages
├── docs/                    Documentation pages (Markdown)
│   ├── 01-installation.md   Bare-metal installation guide
│   ├── 02-docker.md         Docker installation guide
│   └── 03-upgrade.md        Upgrade guide
├── src/
│   ├── css/
│   │   └── custom.css       Global styles and brand tokens
│   └── pages/
│       ├── index.js         Homepage
│       ├── features.js      Features overview
│       └── enterprise.js    Professional services / providers
├── static/
│   ├── img/                 Images and SVG illustrations
│   └── logos/               Customer and partner logos
├── docusaurus.config.js     Site configuration
└── sidebars.js              Documentation sidebar structure
```


## Deployment

Merging to `main` does not publish anything. A deploy is a separate step,
run by hand from an up to date `main`:

```bash
bin/deploy --dry-run    # build and list what would change
bin/deploy              # build, confirm, publish
```

`bin/deploy` refuses to run on a dirty tree, off `main` or when `main` is not
pushed. It builds the site, replaces the contents of the `master` branch of
[senaite/senaite.github.io](https://github.com/senaite/senaite.github.io)
with `build/` as one new commit, waits for the GitHub Pages build and checks
that the site answers. It asks for the word `deploy` before pushing
(`DEPLOY_CONFIRM=deploy` skips the prompt for unattended runs).

Pushing needs write access to `senaite/senaite.github.io` over SSH, and the
`gh` CLI logged in to read the Pages build status. The custom domain comes
from `static/CNAME`.


## Licence

Content is published under the
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
licence. Code is MIT licenced.
