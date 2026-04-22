# Screenshot Capture Scripts

Scripts for capturing documentation screenshots from a running SENAITE
instance using Playwright.

## Prerequisites

- Python 3.8+
- A running SENAITE instance with demo data installed

## Setup

Install the Python dependencies and the Chromium browser:

```bash
pip install -r scripts/requirements.txt
playwright install chromium
```

## capture_screenshots.py

Navigates the SENAITE UI, creates a fresh sample, walks it through the
full workflow, and writes all screenshots to `docs/quickstart/`.

### Usage

```bash
python scripts/capture_screenshots.py
```

All arguments are optional:

| Argument | Default | Description |
|---|---|---|
| `--url` | `http://localhost:8080` | Base URL of the SENAITE instance |
| `--site` | `senaite` | Plone site id |
| `--username` | `admin` | Login username |
| `--password` | `admin` | Login password |

### Demo data

The script assumes demo data is installed. Demo data provides the client
"Happy Hills" (id: `client-1`), lab contacts, analysis services, and
sample types that the script uses for navigation and sample creation.

To install demo data, open the portal setup in a browser and run the
`senaite.core:default` import step:

```
http://localhost:8080/senaite/portal_setup/manage_importSteps
```

### What the script captures

**Setup screens** — navigates directly to each listing:

| Screenshot | URL |
|---|---|
| `setup-screen.png` | `@@lims-setup` |
| `lab-departments-listing.png` | `setup/departments` |
| `analysis-categories-listing.png` | `setup/analysiscategories` |
| `analysis-services-listing.png` | `setup/analysisservices` |
| `sample-types-listing.png` | `setup/sampletypes` |
| `clients-listing.png` | `clients` |
| `client-contacts-listing.png` | `clients/client-1/contacts` |
| `client-samples-listing.png` | `clients/client-1/analysisrequests` |

**Sample workflow** — creates a fresh sample each run and steps through
every transition:

| Screenshot | Workflow step |
|---|---|
| `sample-add-form.png` | Sample add form filled in |
| `sample-listing-sample-due.png` | After save — Sample Due |
| `sample-listing-receive.png` | Sample selected, Receive button visible |
| `sample-listing-received.png` | After Receive — Received |
| `sample-view-submit-results.png` | Results entered, Submit button visible |
| `sample-listing-to-be-verified.png` | After Submit — To be verified |
| `sample-view-verify-results.png` | Verify button visible |
| `sample-listing-verified.png` | After Verify — Verified |
| `sample-listing-publish.png` | Sample selected, Publish button visible |
| `senaite-impress-preview.png` | SENAITE Impress report preview |
| `senaite-impress-save-email.png` | Impress Save / Email toolbar |
