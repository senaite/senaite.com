---
id: upgrade
title: Upgrading SENAITE
sidebar_label: Upgrading SENAITE
---

SENAITE follows a regular release cycle. Each new version may include data
migration steps that must be executed after updating the software packages.
This guide covers the full upgrade procedure.

## Before You Upgrade

Read the release notes before upgrading:

- [`senaite.lims` changelog on PyPI][SENAITE-PYPI]
- [`senaite.core` releases on GitHub][SENAITE-CORE-RELEASES]

If you maintain a custom add-on, review the `senaite.core` changelog
carefully for API changes.

**Strongly recommended steps before proceeding:**

- Test the upgrade on a clone of your production environment first.
- Run `bin/zeopack` to compact the database before upgrading.
- Create a full backup of both `filestorage/` and `blobstorage/`.
- Bring as many analyses as possible to a verified or published state.
- Stop any background services that consume significant memory.
- Clear the Zope log file so the upgrade log is easy to read.


## Step 1: Update the Version Pin

Open your `buildout.cfg` and update the `senaite.lims` version pin in the
`[versions]` section:

```ini
[versions]
senaite.lims = 2.x.x   # replace with the target version
```

Check the [PyPI history][SENAITE-PYPI] for the latest stable release.


## Step 2: Re-run Buildout

```shell
buildout -c buildout.cfg
```

Buildout downloads the updated packages. If you use a custom buildout
configuration, replace `buildout.cfg` with the appropriate file name.


## Step 3: Start SENAITE in Foreground Mode

Always run the upgrade in foreground mode so that errors are visible
immediately:

```shell
bin/instance fg
```

Wait for the ready message:

```
INFO Zope Ready to handle requests
```


## Step 4: Run the Upgrade Steps

Open a browser and navigate to the portal setup upgrade page:

```
http://localhost:8080/senaite/portal_setup/manage_upgrades
```

Select the `senaite.core` profile from the dropdown and click **Upgrade**.

Repeat for any other profiles that show pending upgrades (for example,
`senaite.impress`, `senaite.app.listing`, or custom add-on profiles).

:::note
If no upgrade step appears, the profile may already be at the latest version.
Use the second dropdown and click **Show old upgrades** to verify.
:::


## Step 5: Verify Installed Versions

After the upgrade steps complete, check the installed versions in the
add-ons control panel:

```
http://localhost:8080/senaite/prefs_install_products_form
```

The version shown for each package should match the pins in your
`buildout.cfg`.


## Step 6: Restart in Production Mode

Once you have verified the upgrade on a test system, repeat the process
on production and restart the server in background mode:

```shell
bin/instance stop
bin/instance start
```


## ZEO Setups

If you run a ZEO cluster, stop all clients before upgrading and run the
upgrade steps with a single reserved client in foreground mode:

```shell
bin/client_reserved fg
```

Restart the remaining clients only after the upgrade steps have completed
successfully.


## Professional Upgrade Support

Upgrades across major versions or on systems with custom add-ons require
careful planning. Professional service providers offer paid upgrade support
including pre-upgrade assessment, migration testing and post-upgrade
validation.

See the [Enterprise Solutions](/enterprise) page for details.


[SENAITE-PYPI]: https://pypi.org/project/senaite.lims/#history
[SENAITE-CORE-RELEASES]: https://github.com/senaite/senaite.core/releases
