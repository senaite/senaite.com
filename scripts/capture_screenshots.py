#!/usr/bin/env python3
"""Capture the screenshots of the quickstart guide.

Runs the quickstart (docs/02-quickstart.md) against an empty SENAITE
site, through the web interface, and saves a screenshot at each point
the guide shows one. The data is the data the guide prescribes, so
the images match the text.

Start a throwaway container first:

    docker run -d --name senaite-shots -p 8090:8080 senaite/senaite:2.x
    python scripts/capture_screenshots.py --url http://localhost:8090

The script creates the site if it does not exist yet. Run it against
a fresh container only: it adds content and does not clean up.
"""

import argparse
import asyncio
import datetime
import re
from pathlib import Path

from playwright.async_api import Page
from playwright.async_api import async_playwright

SCRIPT_DIR = Path(__file__).parent
SCREENSHOTS_DIR = SCRIPT_DIR.parent / "docs" / "quickstart"

VIEWPORT = {"width": 1440, "height": 900}
TIMEOUT = 30000

LAB_CONTACT = {"Firstname": "Lisa", "Surname": "Chen"}

DEPARTMENT = {
    "title": "Chemistry",
    "description": "Analytical chemistry department",
    "department_id": "CHEM",
}

CATEGORY = {
    "title": "Water Chemistry",
    "description": "Chemical water analyses",
}

SERVICES = [
    {"title": "Calcium", "keyword": "Ca"},
    {"title": "Magnesium", "keyword": "Mg"},
    {"title": "Total Hardness", "keyword": "THCaCO3"},
]

RESULTS = ["42", "9", "140"]

SAMPLE_TYPE = {"title": "Water", "prefix": "H2O", "min_volume": "100 ml"}

CLIENT = {"Name": "Happy Hills", "ClientID": "HH"}

CLIENT_CONTACT = {"firstname": "Maria", "surname": "Lopez"}
CLIENT_CONTACT_EMAIL = "maria.lopez@example.com"


class Site:
    """URLs of the SENAITE site under test."""

    def __init__(self, base, site_id):
        self.base = base.rstrip("/")
        self.site_id = site_id

    def url(self, path=""):
        return "{}/{}/{}".format(self.base, self.site_id, path.lstrip("/"))


# -- Page helpers -----------------------------------------------------

async def open_page(page: Page, url: str) -> None:
    """Navigate and wait until the listings have loaded."""
    await page.goto(url)
    await page.wait_for_load_state("networkidle")


async def screenshot(page: Page, name: str) -> None:
    """Save a viewport screenshot under docs/quickstart/."""
    await page.wait_for_load_state("networkidle")
    # Park the pointer, so no hover state or tooltip ends up in the image.
    await page.mouse.move(0, 0)
    await page.wait_for_timeout(500)
    dest = SCREENSHOTS_DIR / name
    await page.screenshot(path=str(dest))
    print("  -> {}".format(dest.name))


async def select_reference(page: Page, name: str, term: str) -> None:
    """Pick the first match in a reference widget.

    The widget container carries the field name in data-name. Typing
    into its search input loads matching records into a table below,
    and clicking a row selects it.
    """
    widget = page.locator('[data-name="\\"{}\\""]'.format(name))
    search = widget.locator("input[name='query-select-search']")
    await search.click()
    await search.fill(term)
    row = widget.locator("table tbody tr").filter(has_text=term).first
    await row.wait_for(timeout=TIMEOUT)
    await row.click()
    await page.wait_for_load_state("networkidle")


async def fill_fields(page: Page, prefix: str, values: dict) -> None:
    """Fill text fields by name, with a name prefix for DX forms."""
    for key, value in values.items():
        field = "[name='{}{}']:visible".format(prefix, key)
        await page.locator(field).first.fill(value)


async def save_dx(page: Page) -> None:
    await page.click("input[name='form.buttons.save']")
    await page.wait_for_load_state("networkidle")


async def save_at(page: Page) -> None:
    await page.click("input[name='form.button.save']")
    await page.wait_for_load_state("networkidle")


def button_label(label: str):
    """Match a button by its label.

    Workflow buttons carry a counter badge ("Receive 1"), and the
    review state filters reuse the words ("Received"), so no letter
    may follow the label.
    """
    return re.compile(r"^\s*{}(?![A-Za-z])".format(re.escape(label)))


def find_button(page: Page, label: str):
    return page.locator(
        "button:visible", has_text=button_label(label)).first


async def click_button(page: Page, label: str) -> None:
    """Click a listing or workflow button by its visible label."""
    button = find_button(page, label)
    await button.wait_for(timeout=TIMEOUT)
    await button.click()
    await page.wait_for_load_state("networkidle")


async def run_transition(page: Page, label: str) -> None:
    """Click a workflow button and wait until the listing is done.

    The listing transitions the selected items over ajax and redraws
    without the button once all of them are done. Leaving the page
    earlier aborts the remaining ones.
    """
    button = find_button(page, label)
    await button.wait_for(timeout=TIMEOUT)
    await button.click()
    await button.wait_for(state="hidden", timeout=120000)
    await page.wait_for_load_state("networkidle")


async def select_first_row(page: Page) -> None:
    """Tick the first item in a listing."""
    checkbox = page.locator("table tbody tr input[type='checkbox']").first
    await checkbox.wait_for(timeout=TIMEOUT)
    await checkbox.check()
    await page.wait_for_load_state("networkidle")


# -- Site --------------------------------------------------------------

async def site_exists(page: Page, site: Site) -> bool:
    response = await page.goto(site.url())
    return response is not None and response.status == 200


async def create_site(page: Page, site: Site) -> None:
    print("Creating site...")
    await open_page(page, "{}/@@senaite-addsite".format(site.base))
    await page.fill("input[name='site_id']", site.site_id)
    await page.fill("input[name='title']", "SENAITE LIMS")
    await page.click("input[type='submit']")
    await page.wait_for_load_state("networkidle", timeout=300000)


async def login(page: Page, site: Site, username: str,
                password: str) -> None:
    """Log in through the form, so every request carries the cookie.

    HTTP basic auth alone is not enough: the site answers some
    anonymous requests with a redirect to the login form instead of
    a 401, and the browser then never sends the credentials.
    """
    await open_page(page, site.url("login"))
    await page.fill("input[name='__ac_name']", username)
    await page.fill("input[name='__ac_password']", password)
    await page.click("#login-form [type='submit'], form [type='submit']")
    await page.wait_for_load_state("networkidle")


# -- Setup steps -------------------------------------------------------

async def add_lab_contact(page: Page, site: Site) -> None:
    print("Lab contact...")
    await open_page(page, site.url(
        "bika_setup/bika_labcontacts/createObject?type_name=LabContact"))
    await fill_fields(page, "", LAB_CONTACT)
    await save_at(page)
    await open_page(page, site.url("bika_setup/bika_labcontacts"))
    await screenshot(page, "lab-contacts-listing.png")


async def add_department(page: Page, site: Site) -> None:
    print("Lab department...")
    await open_page(page, site.url(
        "setup/departments/++add++Department"))
    await fill_fields(page, "form.widgets.", DEPARTMENT)
    await select_reference(
        page, "form.widgets.manager", LAB_CONTACT["Surname"])
    await save_dx(page)
    await open_page(page, site.url("setup/departments"))
    await screenshot(page, "lab-departments-listing.png")


async def add_category(page: Page, site: Site) -> None:
    print("Analysis category...")
    await open_page(page, site.url(
        "setup/analysiscategories/++add++AnalysisCategory"))
    await fill_fields(page, "form.widgets.", CATEGORY)
    await select_reference(
        page, "form.widgets.department", DEPARTMENT["title"])
    await save_dx(page)
    await open_page(page, site.url("setup/analysiscategories"))
    await screenshot(page, "analysis-categories-listing.png")


async def add_service(page: Page, site: Site, service: dict) -> None:
    await open_page(page, site.url(
        "bika_setup/bika_analysisservices/"
        "createObject?type_name=AnalysisService"))
    await page.fill("input[name='title']", service["title"])
    await page.fill("input[name='Unit']", "mg/L")
    await page.fill("input[name='Keyword']", service["keyword"])
    await page.check("input[name='PointOfCapture'][value='lab']")
    await select_reference(page, "Category", CATEGORY["title"])
    await select_reference(page, "Department", DEPARTMENT["title"])
    await save_at(page)


async def add_services(page: Page, site: Site) -> None:
    print("Analysis services...")
    for service in SERVICES:
        await add_service(page, site, service)
    await open_page(page, site.url("bika_setup/bika_analysisservices"))
    await screenshot(page, "analysis-services-listing.png")


async def add_sample_type(page: Page, site: Site) -> None:
    print("Sample type...")
    await open_page(page, site.url("setup/sampletypes/++add++SampleType"))
    await fill_fields(page, "form.widgets.", SAMPLE_TYPE)
    await save_dx(page)
    await open_page(page, site.url("setup/sampletypes"))
    await screenshot(page, "sample-types-listing.png")


async def add_client(page: Page, site: Site) -> str:
    """Add the client and return the URL of its view."""
    print("Client...")
    await open_page(page, site.url("clients/createObject?type_name=Client"))
    await fill_fields(page, "", CLIENT)
    await save_at(page)
    await open_page(page, site.url("clients"))
    await screenshot(page, "clients-listing.png")
    link = page.locator("table tbody a", has_text=CLIENT["Name"]).first
    href = await link.get_attribute("href")
    # The listing links to the client's samples view.
    return href.split("?")[0].rsplit("/", 1)[0]


async def add_client_contact(page: Page, client_url: str) -> None:
    print("Client contact...")
    await open_page(page, "{}/contacts".format(client_url))
    await page.locator("a", has_text="Add").first.click()
    await page.wait_for_load_state("networkidle")
    await fill_fields(page, "form.widgets.", CLIENT_CONTACT)
    await page.locator("a", has_text="Email Telephone Fax").first.click()
    await page.locator(
        "input[name^='form.widgets.email']:visible").first.fill(
            CLIENT_CONTACT_EMAIL)
    await save_dx(page)
    await open_page(page, "{}/contacts".format(client_url))
    await screenshot(page, "client-contacts-listing.png")


# -- Sample ------------------------------------------------------------

async def tick_service(page: Page, title: str) -> None:
    row = page.locator("tr.service", has_text=title).first
    await row.locator("input[type='checkbox']").first.check()


async def expand_category(page: Page, title: str) -> None:
    """Open a collapsed analysis category in the sample add form."""
    row = page.locator("tr.category", has_text=title).first
    if not await row.is_visible():
        await page.locator("text=Lab Analyses").first.click()
    await row.click()
    service = page.locator("tr.service", has_text=SERVICES[0]["title"])
    await service.first.wait_for(state="visible", timeout=TIMEOUT)


async def register_sample(page: Page, client_url: str) -> None:
    print("Registering the sample...")
    await open_page(page, "{}/analysisrequests".format(client_url))
    await screenshot(page, "client-samples-listing.png")
    await open_page(page, "{}/ar_add?ar_count=1".format(client_url))
    # The add form preselects the contact when the client has only one.
    await page.locator("[data-name='\"Contact-0\"']",
                       has_text=CLIENT_CONTACT["surname"]).wait_for()
    # Yesterday morning: the form refuses a date after the server's
    # current time, and the container's clock runs on UTC.
    sampled = datetime.datetime.now() - datetime.timedelta(days=1)
    await page.fill("input[name='DateSampled-0-date']",
                    sampled.strftime("%Y-%m-%d"))
    await page.fill("input[name='DateSampled-0-time']", "09:00")
    await select_reference(page, "SampleType-0", SAMPLE_TYPE["title"])
    await expand_category(page, CATEGORY["title"])
    for service in SERVICES:
        await tick_service(page, service["title"])
    await page.wait_for_load_state("networkidle")
    await page.evaluate("window.scrollTo(0, 0)")
    await screenshot(page, "sample-add-form.png")
    await page.click("input[name='save_button']")
    await page.wait_for_url(lambda url: "ar_add" not in url)
    await show_listing(page, client_url, "Sample due",
                       "sample-listing-sample-due.png")


async def sample_url(page: Page, client_url: str) -> str:
    """Return the URL of the one sample of the client."""
    await open_page(page, "{}/analysisrequests".format(client_url))
    link = page.locator(
        "table tbody tr a[href*='/{}-']".format(SAMPLE_TYPE["prefix"]))
    await link.first.wait_for(timeout=TIMEOUT)
    href = await link.first.get_attribute("href")
    return href.split("?")[0]


async def select_all_analyses(page: Page) -> None:
    """Tick the select-all box of the analyses listing."""
    box = page.locator("input[name='select_all']").last
    await box.wait_for()
    if not await box.is_checked():
        await box.check()
    await page.wait_for_load_state("networkidle")


async def scroll_to_analyses(page: Page) -> None:
    heading = page.locator("h3, h2", has_text="Analyses").first
    await heading.evaluate("el => window.scrollTo(0, "
                           "el.getBoundingClientRect().top "
                           "+ window.scrollY - 20)")


async def open_samples(page: Page, client_url: str, state: str) -> None:
    """Open the client's samples once the sample shows `state`.

    Transitions finish in the background after the button returns,
    so the listing is reloaded until the state column has caught up.
    """
    cell = re.compile(r"^\s*{}\s*$".format(re.escape(state)))
    row = page.locator("table tbody td", has_text=cell).first
    for _attempt in range(15):
        await open_page(page, "{}/analysisrequests".format(client_url))
        await page.locator("table tbody tr").first.wait_for()
        if await row.is_visible():
            return
        await page.wait_for_timeout(2000)
    raise RuntimeError("Sample never reached state {!r}".format(state))


async def show_listing(page: Page, client_url: str, state: str,
                       name: str) -> None:
    await open_samples(page, client_url, state)
    await screenshot(page, name)


async def receive(page: Page, client_url: str) -> None:
    print("Receive...")
    await open_page(page, "{}/analysisrequests".format(client_url))
    await select_first_row(page)
    await screenshot(page, "sample-listing-receive.png")
    await run_transition(page, "Receive")
    await show_listing(
        page, client_url, "Received", "sample-listing-received.png")


async def submit(page: Page, url: str, client_url: str) -> None:
    print("Submit...")
    await open_page(page, url)
    inputs = page.locator("table input[type='text'][name^='Result']")
    await inputs.first.wait_for(timeout=TIMEOUT)
    for index, value in enumerate(RESULTS):
        await inputs.nth(index).click()
        await inputs.nth(index).press_sequentially(value)
        await inputs.nth(index).press("Tab")
        # Leaving a result field refreshes the row over ajax.
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(500)
    # Save stores the results; only then does Submit appear.
    await click_button(page, "Save")
    await select_all_analyses(page)
    await find_button(page, "Submit").wait_for()
    await scroll_to_analyses(page)
    await screenshot(page, "sample-view-submit-results.png")
    await run_transition(page, "Submit")
    await show_listing(page, client_url, "To be verified",
                       "sample-listing-to-be-verified.png")


async def allow_self_verification(page: Page, site: Site) -> None:
    """The quickstart runs as one user, who also verifies.

    Real labs keep this off and verify with a second user.
    """
    await open_page(page, site.url("setup/edit"))
    await page.click("#analyses-tab")
    await page.check(
        "input[name='form.widgets.self_verification_enabled:list']")
    await save_dx(page)


async def verify(page: Page, url: str, client_url: str) -> None:
    print("Verify...")
    await open_page(page, url)
    await select_all_analyses(page)
    await find_button(page, "Verify").wait_for()
    await scroll_to_analyses(page)
    await screenshot(page, "sample-view-verify-results.png")
    await run_transition(page, "Verify")
    await show_listing(
        page, client_url, "Verified", "sample-listing-verified.png")


async def publish_preview(page: Page, client_url: str) -> None:
    print("Publish preview...")
    await open_samples(page, client_url, "Verified")
    await select_first_row(page)
    await screenshot(page, "sample-listing-publish.png")
    await click_button(page, "Publish")
    await page.wait_for_url("**/publish**", timeout=TIMEOUT)
    await page.locator(".report").first.wait_for(timeout=TIMEOUT)
    await screenshot(page, "senaite-impress-preview.png")
    await screenshot_toolbar(page, "senaite-impress-save-email.png")


async def screenshot_toolbar(page: Page, name: str) -> None:
    """Save the Impress toolbar (template, paper, Email, Save)."""
    # The deepest element holding both the template selector and the
    # buttons is the toolbar row.
    toolbar = page.locator("div", has=page.locator("select")).filter(
        has=find_button(page, "Save")).last
    box = await toolbar.bounding_box()
    clip = {
        "x": max(box["x"] - 16, 0),
        "y": max(box["y"] - 16, 0),
        "width": box["width"] + 32,
        "height": box["height"] + 32,
    }
    await page.screenshot(path=str(SCREENSHOTS_DIR / name), clip=clip)
    print("  -> {}".format(name))


async def publish(page: Page, client_url: str) -> None:
    """Store the PDF, then publish it from the client's reports."""
    print("Publish...")
    await click_button(page, "Save")
    await page.wait_for_url("**/reports_listing**", timeout=120000)
    await select_first_row(page)
    await find_button(page, "Publish").wait_for()
    await screenshot(page, "report-listing-publish.png")
    await run_transition(page, "Publish")
    # Published samples leave the default (active) samples listing,
    # so the reports listing shows the end state.
    published = re.compile(r"^\s*Published\s*$")
    await page.locator("table tbody td", has_text=published).first.wait_for()
    await screenshot(page, "report-listing-published.png")


# -- Main --------------------------------------------------------------

async def run(args) -> None:
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    site = Site(args.url, args.site)
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        # English UI regardless of the machine's language settings.
        context = await browser.new_context(
            viewport=VIEWPORT,
            locale="en-US",
            extra_http_headers={"Accept-Language": "en-US,en"},
            http_credentials={
                "username": args.username,
                "password": args.password,
            },
        )
        page = await context.new_page()
        page.set_default_timeout(TIMEOUT)

        if not await site_exists(page, site):
            await create_site(page, site)
        await login(page, site, args.username, args.password)

        await open_page(page, site.url("@@lims-setup"))
        await screenshot(page, "setup-screen.png")
        await add_lab_contact(page, site)
        await add_department(page, site)
        await add_category(page, site)
        await add_services(page, site)
        await add_sample_type(page, site)
        client_url = await add_client(page, site)
        await add_client_contact(page, client_url)
        await register_sample(page, client_url)
        url = await sample_url(page, client_url)
        await receive(page, client_url)
        await submit(page, url, client_url)
        await allow_self_verification(page, site)
        await verify(page, url, client_url)
        await publish_preview(page, client_url)
        await publish(page, client_url)
        await browser.close()


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--url", default="http://localhost:8090")
    parser.add_argument("--site", default="senaite")
    parser.add_argument("--username", default="admin")
    parser.add_argument("--password", default="admin")
    return parser.parse_args()


if __name__ == "__main__":
    asyncio.run(run(parse_args()))
