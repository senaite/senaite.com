# Screenshot Capture Scripts

Scripts for capturing documentation screenshots from a running SENAITE
instance using Playwright.

## Prerequisites

- Python 3.8+
- Docker, for a throwaway SENAITE instance

## Setup

Install the Python dependencies and the Chromium browser:

```bash
pip install -r scripts/requirements.txt
playwright install chromium
```

## capture_screenshots.py

Runs the quickstart guide (`docs/02-quickstart.md`) against an empty
SENAITE site through the web interface and writes a screenshot to
`docs/quickstart/` at every point the guide shows one. It uses the data
the guide prescribes, so the images and the text match.

### Usage

Start a fresh container from the image the Docker guide names, then run
the script against it:

```bash
docker run -d --name senaite-shots -p 8090:8080 senaite/senaite:2.x
python scripts/capture_screenshots.py --url http://localhost:8090
docker rm -f senaite-shots
```

The script creates the `senaite` site if it does not exist yet. It adds
content and does not clean up, so run it against a fresh container
every time.

| Argument | Default | Description |
|---|---|---|
| `--url` | `http://localhost:8090` | Base URL of the instance |
| `--site` | `senaite` | Site id |
| `--username` | `admin` | Login username |
| `--password` | `admin` | Login password |

The browser runs with an English locale, so the screenshots show the
English interface whatever the machine's language is.

### What the script does

| Step | Screenshots |
|---|---|
| Open LIMS Setup | `setup-screen.png` |
| Add the lab contact Lisa Chen | `lab-contacts-listing.png` |
| Add the department Chemistry (manager Lisa Chen) | `lab-departments-listing.png` |
| Add the category Water Chemistry | `analysis-categories-listing.png` |
| Add Calcium, Magnesium, Total Hardness | `analysis-services-listing.png` |
| Add the sample type Water (prefix H2O) | `sample-types-listing.png` |
| Add the client Happy Hills (HH) | `clients-listing.png` |
| Add the client contact Maria Lopez | `client-contacts-listing.png` |
| Register one sample | `client-samples-listing.png`, `sample-add-form.png`, `sample-listing-sample-due.png` |
| Receive | `sample-listing-receive.png`, `sample-listing-received.png` |
| Save and submit results | `sample-view-submit-results.png`, `sample-listing-to-be-verified.png` |
| Verify | `sample-view-verify-results.png`, `sample-listing-verified.png` |
| Open the report preview | `sample-listing-publish.png`, `senaite-impress-preview.png`, `senaite-impress-save-email.png` |
| Save the report and publish it | `report-listing-publish.png`, `report-listing-published.png` |

Before verifying, the script enables self-verification in the setup,
because it runs as a single user. The guide says the same to readers who
walk through it alone.
