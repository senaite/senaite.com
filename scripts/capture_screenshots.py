#!/usr/bin/env python3
"""
SENAITE Quickstart Screenshot Capture Script

Navigates a running SENAITE instance, creates a fresh sample, walks
it through the full workflow, and saves screenshots for the quickstart
documentation.

Prerequisites
-------------
- Python 3.8+
- pip install playwright
- playwright install chromium
- A running SENAITE instance with demo data installed.

Demo data installation (one-time, run before this script):
  Open http://localhost:8080/senaite/portal_setup/manage_importSteps
  and import the senaite.core:default profile, which will trigger
  the demo data import step.

  Alternatively, trigger it from the ZMI:
  http://localhost:8080/senaite/portal_setup

Usage
-----
  python scripts/capture_screenshots.py
  python scripts/capture_screenshots.py --url http://localhost:8080
  python scripts/capture_screenshots.py --username admin --password admin
  python scripts/capture_screenshots.py --site mysite

All screenshots are written to docs/quickstart/ relative to this
script's parent directory.
"""

import argparse
import asyncio
import datetime
import sys
from pathlib import Path

from playwright.async_api import Browser, Page, async_playwright


# ── Paths ──────────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
SCREENSHOTS_DIR = SCRIPT_DIR.parent / "docs" / "quickstart"

# ── Defaults ───────────────────────────────────────────────────────────────────

DEFAULT_URL = "http://localhost:8080"
DEFAULT_SITE = "senaite"
DEFAULT_USERNAME = "admin"
DEFAULT_PASSWORD = "admin"

# Demo data ships with "client-1" (Happy Hills, HH)
CLIENT_ID = "client-1"

# Viewport size used for all screenshots
VIEWPORT = {"width": 1440, "height": 900}


# ── Helpers ────────────────────────────────────────────────────────────────────

def site_url(base: str, site: str, path: str = "") -> str:
    return f"{base}/{site}/{path.lstrip('/')}"


async def wait_and_screenshot(page: Page, name: str) -> None:
    """Wait for network idle then save a viewport screenshot."""
    await page.wait_for_load_state("networkidle")
    dest = SCREENSHOTS_DIR / name
    await page.screenshot(path=str(dest))
    print(f"  -> {dest.name}")


async def dismiss_overlays(page: Page) -> None:
    """Close any open status messages or popups."""
    for selector in [
        "button.close",
        "[data-dismiss='alert']",
        ".portalMessage .close",
    ]:
        for el in await page.query_selector_all(selector):
            try:
                await el.click()
            except Exception:
                pass


async def login(
    page: Page, base: str, site: str, username: str, password: str
) -> None:
    print("Logging in...")
    await page.goto(site_url(base, site, "login"))
    await page.wait_for_load_state("networkidle")
    await page.fill("input[name='__ac_name']", username)
    await page.fill("input[name='__ac_password']", password)
    await page.click("input[type='submit']")
    await page.wait_for_load_state("networkidle")


async def fill_reference_field(
    page: Page, field_id: str, search_term: str = ""
) -> None:
    """
    Fill a SENAITE QuerySelectWidget (React-based reference field).

    The widget root is a <div id="{field_id}"> that React mounts into.
    It renders:
      .queryselectwidget-search-field input  — the visible search input
      .queryselectwidget-results-container   — the results dropdown

    Focusing the input fires an AJAX search; the first <tr> in the
    results container is clicked to select the value.
    """
    search_input = f"#{field_id} .queryselectwidget-search-field input"
    first_result = (
        f"#{field_id} .queryselectwidget-results-container tr:first-child"
    )

    await page.click(search_input)
    if search_term:
        await page.type(search_input, search_term)

    await page.wait_for_selector(first_result, timeout=10000)
    await page.click(first_result)
    await page.wait_for_load_state("networkidle")


# ── Setup screens ──────────────────────────────────────────────────────────────

async def capture_setup_screens(
    page: Page, base: str, site: str
) -> None:
    print("Capturing setup screens...")

    # LIMS Setup main screen
    await page.goto(site_url(base, site, "@@lims-setup"))
    await wait_and_screenshot(page, "setup-screen.png")

    # Lab Departments
    await page.goto(site_url(base, site, "setup/departments"))
    await wait_and_screenshot(page, "lab-departments-listing.png")

    # Analysis Categories
    await page.goto(site_url(base, site, "setup/analysiscategories"))
    await wait_and_screenshot(page, "analysis-categories-listing.png")

    # Analysis Services — try new path first, fall back to old
    try:
        await page.goto(
            site_url(base, site, "setup/analysisservices"),
            wait_until="networkidle",
        )
        if "analysisservices" not in page.url:
            raise Exception("redirect away from expected URL")
    except Exception:
        await page.goto(
            site_url(
                base, site,
                "bika_setup/bika_analysisservices",
            )
        )
    await wait_and_screenshot(page, "analysis-services-listing.png")

    # Sample Types
    await page.goto(site_url(base, site, "setup/sampletypes"))
    await wait_and_screenshot(page, "sample-types-listing.png")


# ── Client screens ─────────────────────────────────────────────────────────────

async def capture_client_screens(
    page: Page, base: str, site: str
) -> None:
    print("Capturing client screens...")

    # Clients listing
    await page.goto(site_url(base, site, "clients"))
    await wait_and_screenshot(page, "clients-listing.png")

    client_base = site_url(base, site, f"clients/{CLIENT_ID}")

    # Contacts tab
    await page.goto(f"{client_base}/contacts")
    await wait_and_screenshot(page, "client-contacts-listing.png")

    # Samples tab — demo data client-1 uses analysisrequests
    await page.goto(f"{client_base}/analysisrequests")
    await wait_and_screenshot(page, "client-samples-listing.png")


# ── Sample creation ────────────────────────────────────────────────────────────

async def create_sample(
    page: Page, base: str, site: str
) -> str:
    """
    Open the sample add form, fill it in, save, and return the
    URL of the newly created sample.
    """
    print("Creating sample...")

    client_base = site_url(base, site, f"clients/{CLIENT_ID}")

    # Navigate to the sample add form (ar_count=1 → single sample)
    await page.goto(f"{client_base}/ar_add?ar_count=1")
    await page.wait_for_load_state("networkidle")

    # --- Contact ---
    # The UIDReferenceField widget renders an input with id "Contact-0"
    await fill_reference_field(page, "Contact-0", "")

    # --- Date Sampled ---
    # The datetimewidget renders two visible inputs:
    #   input[name='DateSampled-0-date']  type="date"  (YYYY-MM-DD)
    #   input[name='DateSampled-0-time']  type="time"  (HH:MM)
    # The input[name='DateSampled-0'] is hidden and must not be filled.
    now = datetime.datetime.now()
    await page.fill(
        "input[name='DateSampled-0-date']",
        now.strftime("%Y-%m-%d"),
    )
    await page.fill(
        "input[name='DateSampled-0-time']",
        now.strftime("%H:%M"),
    )

    # --- Sample Type ---
    # Type a space to trigger autocomplete showing all types, then pick the
    # first result. Adjust the search string if you want a specific type.
    await fill_reference_field(page, "SampleType-0", "")

    # --- Analyses ---
    # Checkboxes have class "analysisservice-cb-0" but are hidden by CSS.
    # Click via JavaScript to bypass visibility and fire change handlers.
    await page.evaluate("""() => {
        const cbs = document.querySelectorAll(".analysisservice-cb-0");
        for (let i = 0; i < Math.min(3, cbs.length); i++) {
            cbs[i].click();
        }
    }""")
    await page.wait_for_load_state("networkidle")

    # Screenshot of the filled form
    await wait_and_screenshot(page, "sample-add-form.png")

    # Save the form — try several common SENAITE button variants
    save_btn = await page.query_selector(
        "input[value='Save'], "
        "input[value='save'], "
        "button:has-text('Save'), "
        "input[type='submit']"
    )
    if save_btn is None:
        # Log available buttons to help diagnose selector mismatches
        buttons = await page.evaluate("""() => {
            const els = document.querySelectorAll(
                "input[type='submit'], button[type='submit'], button"
            );
            return Array.from(els).map(
                e => e.tagName + ' value=' + (e.value || '')
                     + ' text=' + e.textContent.trim().slice(0, 40)
            );
        }""")
        print("  Available buttons:", buttons, file=sys.stderr)
        raise RuntimeError(
            "Could not find Save button on sample add form."
        )
    await save_btn.click()
    await page.wait_for_load_state("networkidle")

    # We land on the samples listing; wait for rows then capture
    await wait_for_listing_rows(page)
    await wait_and_screenshot(page, "sample-listing-sample-due.png")

    # Return the URL of the first sample row so we can open it later.
    # Sample links have no _authenticator parameter; nav tabs do.
    debug_info = await page.evaluate("""() => {
        const allLinks = Array.from(
            document.querySelectorAll("a[href]")
        ).map(a => a.href).filter(
            h => !h.includes("_authenticator")
              && !h.includes("@@")
              && !h.includes("/++")
              && h.includes("/senaite/")
        );
        const checkboxes = Array.from(
            document.querySelectorAll("input[type='checkbox']")
        ).map(cb => ({id: cb.id, name: cb.name, cls: cb.className}));
        return {links: allLinks, checkboxes: checkboxes.slice(0, 5)};
    }""")
    print("  Non-nav links:", debug_info["links"][:10], file=sys.stderr)
    print("  Checkboxes:", debug_info["checkboxes"], file=sys.stderr)

    # Try direct sample URL patterns first
    sample_link = await page.query_selector(
        "table tbody tr:first-child td a[href*='/H'],"
        "table tbody tr:first-child td a[href*='/AR'],"
        "tr:first-child td a[href*='/H'],"
        "tr:first-child td a[href*='/AR'],"
        "tr:nth-child(2) td a"
    )
    if sample_link:
        return await sample_link.get_attribute("href")
    # Fall back: first non-nav link on the page
    for href in debug_info["links"]:
        # Skip client root and known sub-collections
        skip = (
            "analysisrequests" in href
            or "contacts" in href
            or "batches" in href
            or href.rstrip("/").endswith("client-1")
            or "login" in href
        )
        if not skip:
            return href
    return ""


# ── Sample workflow ────────────────────────────────────────────────────────────

async def wait_for_listing_rows(page: Page, timeout: int = 15000) -> None:
    """Wait for the senaite.app.listing React table to populate rows."""
    await page.wait_for_selector(
        "table tbody tr td input[type='checkbox']",
        timeout=timeout,
    )


async def receive_sample(page: Page, client_base: str) -> None:
    print("  Receive...")
    await page.goto(f"{client_base}/analysisrequests")
    await page.wait_for_load_state("networkidle")
    await wait_for_listing_rows(page)

    # Select the first sample row
    first_cb = await page.query_selector(
        "table tbody tr:first-child input[type='checkbox']"
    )
    await first_cb.check()

    # Screenshot: listing with Receive button visible
    await wait_and_screenshot(page, "sample-listing-receive.png")

    # Click Receive
    receive_btn = await page.query_selector(
        "button:has-text('Receive'), input[value='Receive']"
    )
    await receive_btn.click()
    await page.wait_for_load_state("networkidle")
    await dismiss_overlays(page)

    # Screenshot: listing after receive
    await wait_and_screenshot(page, "sample-listing-received.png")


async def submit_results(page: Page, sample_url: str) -> None:
    print("  Submit results...")
    await page.goto(sample_url)
    await page.wait_for_load_state("networkidle")

    # Enter a numeric result for each visible result input
    result_inputs = await page.query_selector_all(
        "input[id*='Result'][type='text'], "
        "input[class*='form-control'][name*='Result']"
    )
    for i, inp in enumerate(result_inputs):
        await inp.fill(str(10 + i * 5))

    # Save first so recalculations run, then screenshot, then submit
    save_btn = await page.query_selector(
        "button:has-text('Save'), input[value='Save']"
    )
    if save_btn:
        await save_btn.click()
        await page.wait_for_load_state("networkidle")

    # Reload to get updated state before submitting
    await page.goto(sample_url)
    await page.wait_for_load_state("networkidle")

    # Screenshot: sample view with results entered and Submit button visible
    await wait_and_screenshot(page, "sample-view-submit-results.png")

    # Submit all results
    submit_btn = await page.query_selector(
        "button:has-text('Submit'), input[value='Submit']"
    )
    await submit_btn.click()
    await page.wait_for_load_state("networkidle")
    await dismiss_overlays(page)


async def capture_to_be_verified(
    page: Page, client_base: str
) -> None:
    print("  To be verified listing...")
    await page.goto(f"{client_base}/analysisrequests")
    await page.wait_for_load_state("networkidle")
    await wait_for_listing_rows(page)
    await wait_and_screenshot(page, "sample-listing-to-be-verified.png")


async def verify_results(page: Page, sample_url: str) -> None:
    print("  Verify...")
    await page.goto(sample_url)
    await page.wait_for_load_state("networkidle")

    # Screenshot: sample view with Verify button
    await wait_and_screenshot(page, "sample-view-verify-results.png")

    verify_btn = await page.query_selector(
        "button:has-text('Verify'), input[value='Verify']"
    )
    await verify_btn.click()
    await page.wait_for_load_state("networkidle")
    await dismiss_overlays(page)


async def capture_verified(page: Page, client_base: str) -> None:
    print("  Verified listing...")
    await page.goto(f"{client_base}/analysisrequests")
    await page.wait_for_load_state("networkidle")
    await wait_for_listing_rows(page)
    await wait_and_screenshot(page, "sample-listing-verified.png")


async def publish_sample(
    page: Page, client_base: str
) -> None:
    print("  Publish...")
    await page.goto(f"{client_base}/analysisrequests")
    await page.wait_for_load_state("networkidle")
    await wait_for_listing_rows(page)

    # Select the first sample
    first_cb = await page.query_selector(
        "table tbody tr:first-child input[type='checkbox']"
    )
    await first_cb.check()

    # Screenshot: listing with Publish button visible
    await wait_and_screenshot(page, "sample-listing-publish.png")

    publish_btn = await page.query_selector(
        "button:has-text('Publish'), input[value='Publish']"
    )
    await publish_btn.click()
    await page.wait_for_load_state("networkidle")

    # Impress report preview
    await wait_and_screenshot(page, "senaite-impress-preview.png")

    # Save/Email button row in Impress
    save_email_row = await page.query_selector(
        ".impress-controls, .btn-toolbar, "
        "div:has(button:has-text('Save')):has(button:has-text('Email'))"
    )
    if save_email_row:
        await save_email_row.scroll_into_view_if_needed()
    await wait_and_screenshot(page, "senaite-impress-save-email.png")


# ── Main ───────────────────────────────────────────────────────────────────────

async def run(
    base: str, site: str, username: str, password: str
) -> None:
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as pw:
        browser: Browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport=VIEWPORT)
        page = await context.new_page()

        await login(page, base, site, username, password)
        await capture_setup_screens(page, base, site)
        await capture_client_screens(page, base, site)

        client_base = site_url(base, site, f"clients/{CLIENT_ID}")
        sample_url = await create_sample(page, base, site)

        if not sample_url:
            print(
                "ERROR: could not determine sample URL after creation.\n"
                "  Check that the sample listing anchor selector matches\n"
                "  the actual sample ID pattern in your SENAITE instance.",
                file=sys.stderr,
            )
            await browser.close()
            return

        await receive_sample(page, client_base)
        await submit_results(page, sample_url)
        await capture_to_be_verified(page, client_base)
        await verify_results(page, sample_url)
        await capture_verified(page, client_base)
        await publish_sample(page, client_base)

        await browser.close()

    print(f"\nAll screenshots saved to: {SCREENSHOTS_DIR}")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Capture SENAITE quickstart screenshots with Playwright"
    )
    p.add_argument(
        "--url",
        default=DEFAULT_URL,
        help=f"Base URL of the SENAITE instance (default: {DEFAULT_URL})",
    )
    p.add_argument(
        "--site",
        default=DEFAULT_SITE,
        help=f"Plone site id (default: {DEFAULT_SITE})",
    )
    p.add_argument(
        "--username",
        default=DEFAULT_USERNAME,
        help=f"Login username (default: {DEFAULT_USERNAME})",
    )
    p.add_argument(
        "--password",
        default=DEFAULT_PASSWORD,
        help=f"Login password (default: {DEFAULT_PASSWORD})",
    )
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(run(args.url, args.site, args.username, args.password))
