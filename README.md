# senaite3.com

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
senaite3.com/
├── docs/                   Documentation pages (Markdown)
│   ├── installation.md     Bare-metal installation guide
│   ├── docker.md           Docker installation guide
│   └── upgrade.md          Upgrade guide
├── src/
│   ├── css/
│   │   └── custom.css      Global styles and brand tokens
│   └── pages/
│       ├── index.js        Homepage
│       ├── features.js     Features overview
│       └── enterprise.js   Professional services / providers
├── static/
│   ├── img/                Images and SVG illustrations
│   └── logos/              Customer and partner logos
├── docusaurus.config.js    Site configuration
└── sidebars.js             Documentation sidebar structure
```


## Deployment

Deployment is handled automatically by GitHub Actions on every push to
`main`. The workflow builds the site and pushes the `build/` directory to
[senaite/senaite.github.io](https://github.com/senaite/senaite.github.io),
which serves the live site.

See `.github/workflows/deploy.yml` for the full workflow definition.

### Deploy key setup

The workflow authenticates to `senaite/senaite.github.io` using an SSH
deploy key. This is a one-time setup.

Generate a key pair:

```bash
ssh-keygen -t ed25519 -C "senaite3.com deploy" -f senaite3_deploy
```

Add the **public key** (`senaite3_deploy.pub`) as a deploy key on
`senaite/senaite.github.io` with write access.

Add the **private key** (`senaite3_deploy`) as the `DEPLOY_KEY` secret
on `senaite/senaite3.com`.

Once the secret is in place, every push to `main` triggers a build and
publishes the result.


## Licence

Content is published under the
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
licence. Code is MIT licenced.
