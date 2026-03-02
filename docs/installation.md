---
id: installation
title: Installation
sidebar_label: Installation
---

SENAITE is an add-on for the [Plone Content Management Framework][PLONE].
Installation therefore depends on a working Python environment and the
[Buildout][BUILDOUT] tool.

## Supported Platforms

SENAITE runs on Linux. The recommended distribution is **Ubuntu 22.04 LTS**
or **Ubuntu 24.04 LTS**. Debian is equally supported. macOS works for
development but is not recommended for production deployments.

Installation on Windows is not covered in this guide.


## Python Requirement

The current SENAITE release series is based on **Plone 5.2**, which requires
**Python 2.7**. It is strongly recommended to manage Python using
[Pyenv][PYENV] rather than the system interpreter to avoid version conflicts
and permission issues.


## Step 1: Install System Packages

Log in to a fresh Ubuntu installation and install the required packages:

```shell
sudo apt update
sudo apt install build-essential git byobu zsh \
  libpcre3-dev libcairo2 libpango-1.0-0 \
  libpangocairo-1.0-0
```

Required packages for building Python:

```shell
sudo apt install libbz2-dev zlib1g-dev libssl-dev \
  libsqlite3-dev libffi-dev uuid-dev libnss3-dev \
  libgdbm-dev libgdbm-compat-dev libncursesw5-dev \
  liblzma-dev libreadline-dev
```


## Step 2: Install Pyenv

```shell
curl https://pyenv.run | bash
```

Add the following lines to `~/.bashrc` (or `~/.zshrc` if using Zsh):

```shell
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"
```

Reload your shell:

```shell
source ~/.bashrc
```


## Step 3: Install Python 2.7 and Create a Virtual Environment

```shell
pyenv install 2.7.18
pyenv virtualenv 2.7.18 senaite
pyenv activate senaite
```

Verify the active interpreter:

```shell
which python
# /home/user/.pyenv/versions/senaite/bin/python
```


## Step 4: Set Up a SENAITE Directory

```shell
mkdir senaite && cd senaite
```

Create a `requirements.txt` file:

```
setuptools==44.1.1
zc.buildout==2.13.8
wheel
```

Install the requirements:

```shell
pip install -r requirements.txt
```


## Step 5: Create buildout.cfg

Create a `buildout.cfg` file with the following content. Replace the version
pin for `senaite.lims` with the latest release from [PyPI][SENAITE-PYPI].

```ini
[buildout]
index = https://pypi.org/simple/
extends = https://dist.plone.org/release/5.2.15/versions.cfg
find-links =
    https://dist.plone.org/release/5.2.15/
    https://dist.plone.org/thirdparty/

parts =
    instance

eggs =
    senaite.lims

eggs-directory = eggs
download-cache = downloads

[instance]
recipe = plone.recipe.zope2instance
http-address = 0.0.0.0:8080
user = admin:admin
wsgi = on
eggs =
    ${buildout:eggs}

[versions]
senaite.lims = 2.5.0
et-xmlfile = 1.1.0
```


## Step 6: Run Buildout

```shell
buildout -c buildout.cfg
```

Buildout downloads and installs all required packages. This can take several
minutes on first run.


## Step 7: Start SENAITE

Start the server in foreground mode:

```shell
bin/instance fg
```

The server is ready when the log shows:

```
INFO Zope Ready to handle requests
```

Open a browser and navigate to `http://localhost:8080`.

Log in with `admin:admin` and press the **Install SENAITE LIMS** button on
the site setup page.

The SENAITE dashboard appears once the installation completes.


## Starting and Stopping

```shell
# Start in background (production mode)
bin/instance start

# Stop the server
bin/instance stop

# Start in foreground (debug mode, verbose logging)
bin/instance fg
```


## Further Reading

- [senaite.lims on GitHub][SENAITE-GITHUB]
- [Buildout documentation][BUILDOUT]
- [Pyenv][PYENV]
- [Plone documentation][PLONE-DOCS]


[PLONE]: https://plone.org
[PLONE-DOCS]: https://docs.plone.org/manage/installing/installation.html
[BUILDOUT]: http://www.buildout.org/en/latest/
[PYENV]: https://github.com/pyenv/pyenv
[SENAITE-PYPI]: https://pypi.org/project/senaite.lims/#history
[SENAITE-GITHUB]: https://github.com/senaite/senaite.lims#readme
