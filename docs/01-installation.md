---
id: installation
title: Installation
sidebar_label: Installation
---

SENAITE is assembled with [Buildout][BUILDOUT], which installs the right
version of every package and generates the scripts that run the server.
The recommended starting point is [senaite.starter][SENAITE-STARTER], a
ready made buildout maintained by the SENAITE developers.

To try SENAITE without installing Python, use the
[Docker image](./02-docker.md) instead.


## Supported Platforms

SENAITE runs on Linux. The commands below are for **Ubuntu 22.04 LTS**
and **Ubuntu 24.04 LTS**; Debian works the same way. macOS works for
development but is not recommended for production deployments.

Installation on Windows is not covered in this guide.


## Python Requirement

SENAITE 2.x runs on **Python 2.7**. Current distributions no longer ship
it, so install it with [pyenv][PYENV] into your home directory. This keeps
it apart from the system Python and needs no root rights.

Python 2.7 no longer receives security fixes. Run SENAITE behind a web
server and do not expose the application server directly to the
internet.


## Step 1: Install System Packages

SENAITE renders PDFs and processes XML and images through C libraries,
and several Python packages compile against them. Install them first,
together with the libraries needed to build Python itself:

```shell
sudo apt update
sudo apt install -y git build-essential curl \
  libxml2 libxml2-dev libxslt1.1 libxslt1-dev \
  libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
  libgdk-pixbuf2.0-0 zlib1g zlib1g-dev libjpeg-dev \
  libbz2-dev libssl-dev libsqlite3-dev libffi-dev uuid-dev \
  libnss3-dev libgdbm-dev libgdbm-compat-dev libncursesw5-dev \
  liblzma-dev libreadline-dev \
  fonts-dejavu fonts-liberation
```

The fonts are used by the PDF reports. Without them, reports render
boxes instead of letters.


## Step 2: Install Pyenv

```shell
curl https://pyenv.run | bash
```

This installs pyenv together with its virtualenv plugin. Add the
following lines to `~/.bashrc` (or `~/.zshrc` if you use Zsh):

```shell
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

Reload your shell:

```shell
source ~/.bashrc
```


## Step 3: Install Python 2.7 and Create a Virtual Environment

```shell
pyenv install 2.7.18
pyenv virtualenv 2.7.18 python2.7-senaite
pyenv activate python2.7-senaite
```

`pyenv install` compiles Python from source. If it stops with a message
about a missing module, a `-dev` package from Step 1 is missing.

Name the environment as shown, with the version first. On pyenv 2.8 and
newer, a name that starts with `python-` is resolved differently and can
point to another environment.

Verify the interpreter:

```shell
python -V
# Python 2.7.18
```

Every following command assumes this environment is active.


## Step 4: Get senaite.starter

```shell
git clone https://github.com/senaite/senaite.starter.git senaite
cd senaite
pip install -r requirements.txt
```

`requirements.txt` installs Buildout and the matching `setuptools` into
the virtual environment. `buildout.cfg` pins the latest SENAITE release
from [PyPI][SENAITE-PYPI] together with the versions of its dependencies.


## Step 5: Run Buildout

```shell
buildout
```

Buildout downloads and installs all required packages and generates
`bin/instance`. This takes several minutes on the first run. If it fails
while compiling a package, a `-dev` package from Step 1 is usually
missing; read the compiler output above the Buildout traceback.

The starter's defaults suit a local evaluation: the server listens on all
network interfaces (`0.0.0.0:8080`) and the admin login is `admin:admin`.
For a server, change both in a configuration file of your own that
extends `buildout.cfg`, before the first start:

```ini
# production.cfg
[buildout]
extends = buildout.cfg
senaite-user = admin:a-long-random-password

[instance]
http-address = 127.0.0.1:8080
```

Then build with `buildout -c production.cfg`. The admin password only
applies when the instance is created; changing it in the file later does
not change an existing account.


## Step 6: Start SENAITE and Create a Site

Start the server in the foreground:

```shell
bin/instance fg
```

The server is ready when the log shows:

```
INFO Zope Ready to handle requests
```

Open `http://localhost:8080` in a browser and click
**Create a new SENAITE site**. Log in with the admin account from
`buildout.cfg`. The form that follows suggests the site id `senaite`;
click **Create SENAITE Site**. The site is then available at
`http://localhost:8080/senaite`.


## Starting and Stopping

```shell
# Start in the background
bin/instance start

# Stop the server
bin/instance stop

# Start in the foreground (debug mode, log on the console)
bin/instance fg
```

`fg` runs in debug mode, which is slower and shows more detail. Use
`start` for normal operation.


## Further Reading

- [senaite.starter on GitHub][SENAITE-STARTER]
- [senaite.lims on PyPI][SENAITE-PYPI]
- [Buildout documentation][BUILDOUT]
- [Pyenv][PYENV]


[BUILDOUT]: https://www.buildout.org/en/latest/
[PYENV]: https://github.com/pyenv/pyenv
[SENAITE-STARTER]: https://github.com/senaite/senaite.starter
[SENAITE-PYPI]: https://pypi.org/project/senaite.lims/#history
