# senaite.com

Source for the [SENAITE](https://www.senaite.com) website, built with
[Docusaurus v3](https://docusaurus.io).

Published output is pushed to
[senaite/senaite.github.io](https://github.com/senaite/senaite.github.io)
on every commit to `main`.


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
npm start
```

The site is available at `http://localhost:3000`. Most changes are reflected
immediately without a full page reload.


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

Deployment is handled automatically by GitHub Actions on every push to
`main`. The workflow builds the site and pushes the `build/` directory to
[senaite/senaite.github.io](https://github.com/senaite/senaite.github.io),
which serves the live site.

See `.github/workflows/deploy.yml` for the full workflow definition.

### Personal access token setup

The workflow authenticates to `senaite/senaite.github.io` using a GitHub
Personal Access Token (PAT). This is a one-time setup.

Generate a classic PAT at `https://github.com/settings/tokens`:

- Note: `senaite.com deploy`
- Scope: `repo` (full control of private repositories)

Add the token as a repository secret on `senaite/senaite.com`:

- Name: `PERSONAL_TOKEN`
- Value: the token string

Once the secret is in place, every push to `main` triggers a build and
publishes the result.


## Licence

Content is published under the
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
licence. Code is MIT licenced.
