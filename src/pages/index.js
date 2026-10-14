import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import styles from "./index.module.css";

// The states a sample passes through in the default workflow, in
// order. Ids are the workflow state ids of senaite.core 2.x.
const LIFECYCLE = [
  {
    id: "sample_due",
    label: "Due",
    text: "Registered and expected in the lab.",
  },
  {
    id: "sample_received",
    label: "Received",
    text: "Arrived and checked in. Results can be entered.",
  },
  {
    id: "to_be_verified",
    label: "To be verified",
    text: "All results submitted, waiting for a second person.",
  },
  {
    id: "verified",
    label: "Verified",
    text: "Every result confirmed by someone other than the analyst.",
  },
  {
    id: "published",
    label: "Published",
    text: "The report is generated and sent to the client.",
  },
];

// A real response from a SENAITE 2.x site, trimmed to the fields a
// first integration usually reads.
const API_EXAMPLE = `{
  "count": 3,
  "pagesize": 1,
  "page": 1,
  "items": [
    {
      "id": "BAR-0001",
      "uid": "6960062448d14893b82fba6dc560f449",
      "review_state": "published",
      "getClientTitle": "Klaymore",
      "getClientID": "KL",
      "getSampleTypeTitle": "Barley",
      "getDateSampled": "2026-10-04T09:30:00+00:00",
      "getDateReceived": "2026-10-14T10:33:54+00:00",
      "getAnalysesKeywords": ["Moist", "Phos", "DM"],
      "getProgress": 100
    }
  ],
  "next": "…/analysisrequest?getClientID=KL&limit=1&b_start=1"
}`;

const TOPICS = [
  {
    title: "Less manual work",
    intro:
      "The bench works from worksheets, results arrive from"
      + " instruments, and the workflow only offers the next step"
      + " when it is allowed.",
    image: "/img/features/worksheets.webp",
    alt:
      "A SENAITE worksheet with sample analyses, a blank, a control"
      + " and a duplicate in their positions",
    points: [
      {
        title: "Guided workflow",
        text:
          "Every sample and analysis follows a defined lifecycle."
          + " Transitions appear only when their conditions are met,"
          + " so steps cannot be skipped by accident.",
      },
      {
        title: "Instrument results",
        text:
          "Results are imported from the files your instruments"
          + " export instead of being typed in, which removes a"
          + " transcription step and its errors.",
      },
      {
        title: "Turnaround time",
        text:
          "Each analysis has a due date. Worksheets plan the work at"
          + " the bench, and late analyses stand out in the listings.",
      },
    ],
  },
  {
    title: "Under control",
    intro:
      "Who changed what, and when, is recorded on the object itself."
      + " Verification by a second person is built into the workflow.",
    image: "/img/features/audit-log.webp",
    alt:
      "The audit log of a sample with versions, users, timestamps"
      + " and the changed fields",
    points: [
      {
        title: "Ready for ISO/IEC 17025",
        text:
          "SENAITE supports the process controls an accredited"
          + " laboratory needs. The accreditation itself stays with"
          + " the laboratory and how it runs the system.",
      },
      {
        title: "Audit trail",
        text:
          "Every edit of a sample, an analysis or a setup object"
          + " stores a snapshot with the user, the time and the"
          + " changed fields. A lab wide audit log can be switched on"
          + " in the setup.",
      },
      {
        title: "Dashboard and data access",
        text:
          "The dashboard shows throughput over days, weeks and"
          + " months. Reporting and BI tools read the same data"
          + " through the JSON API.",
      },
    ],
  },
  {
    title: "Built to run for years",
    intro:
      "A web application on proven open source infrastructure,"
      + " with a documented API for everything around it.",
    code: {
      title: "curl -u user:password $SITE/@@API/senaite/v1/"
        + "analysisrequest?getClientID=KL&limit=1",
      body: API_EXAMPLE,
    },
    points: [
      {
        title: "Permissions on every object",
        text:
          "Roles and workflow states decide who may see or change"
          + " what, and at which point in the process.",
      },
      {
        title: "Standard infrastructure",
        text:
          "Runs on Linux behind a regular web server or reverse"
          + " proxy. Several application processes can share one"
          + " database server as the lab grows.",
      },
      {
        title: "In the browser",
        text:
          "No desktop software to install or update. Any device with"
          + " a browser works, and IT keeps one central installation.",
      },
    ],
  },
];

const OPEN_SOURCE = [
  {
    title: "No license fees",
    text:
      "Budget goes into configuration and integration for your lab,"
      + " not into licenses that renew every year.",
  },
  {
    title: "Open to review",
    text:
      "The complete source code is public. Your IT and your auditors"
      + " can read exactly what runs in your network.",
  },
  {
    title: "Yours to keep",
    text:
      "Workflows, configuration and extensions built on SENAITE"
      + " belong to your organisation, and so does the decision who"
      + " supports them.",
  },
];

const TRUSTED_BY = [
  {
    name: "BECHEM Lubrication Technology",
    image: "/logos/bechem.svg",
    url: "https://bechem.de",
  },
  {
    name: "CERMEL",
    image: "/logos/cermel.png",
    url: "https://cermel.org",
  },
  {
    name: "LISCON",
    image: "/logos/liscon.jpg",
    url: "https://liscon.de",
  },
  {
    name: "Caribbean Public Health Agency",
    image: "/logos/carpha.jpg",
    url: "https://carpha.org",
  },
  {
    name: "Ministry of Health and Child Care Zimbabwe",
    image: "/logos/mhcc_zim.jpg",
    url: null,
  },
  {
    name: "Botswana Harvard AIDS Institute Partnership",
    image: "/logos/bhp.png",
    url: "https://www.botswanaharvardpartnership.org",
  },
];

function HeroBanner() {
  return (
    <header className={styles.hero}>
      <div className={clsx("container", styles.heroGrid)}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            The open source LIMS, from sample intake to published report
          </h1>
          <p className={styles.heroSubtitle}>
            SENAITE manages samples, analyses, worksheets, instruments
            and reports for testing laboratories. Free to use, free to
            extend, and the code is yours.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/installation"
            >
              Install SENAITE
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/enterprise"
            >
              Find a service provider
            </Link>
          </div>
        </div>
        <figure className={styles.heroShot}>
          <div className={styles.browserBar} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <img
            src="/img/features/sample-management.webp"
            alt={
              "The SENAITE sample listing with samples in different"
              + " states, their clients, sample types and due dates"
            }
          />
        </figure>
      </div>
    </header>
  );
}

// The step marker is the hexagon of the SENAITE logo, outlined in
// the colour of the state.
function StepMarker({ number }) {
  return (
    <span className={styles.marker} aria-hidden="true">
      <svg viewBox="0 0 28 32" focusable="false">
        <polygon points="14,2 26,9 26,23 14,30 2,23 2,9" />
      </svg>
      <span className={styles.markerNumber}>{number}</span>
    </span>
  );
}

function Lifecycle() {
  return (
    <section className={styles.lifecycle}>
      <div className="container">
        <h2 className={styles.lifecycleTitle}>
          How a sample moves through SENAITE
        </h2>
        <ol className={styles.lifecycleTrack}>
          {LIFECYCLE.map(({ id, label, text }, index) => (
            <li key={id} className={styles.state} data-state={id}>
              <StepMarker number={index + 1} />
              <span className={styles.stateLabel}>{label}</span>
              <code className={styles.stateId}>{id}</code>
              <p className={styles.stateText}>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Topic({ title, intro, image, alt, code, points, reverse }) {
  return (
    <section className={styles.topic}>
      <div
        className={clsx("container", styles.topicGrid, {
          [styles.topicReverse]: reverse,
        })}
      >
        <div className={styles.topicText}>
          <h2 className={styles.topicTitle}>{title}</h2>
          <p className={styles.topicIntro}>{intro}</p>
          <dl className={styles.points}>
            {points.map((point) => (
              <div key={point.title} className={styles.point}>
                <dt>{point.title}</dt>
                <dd>{point.text}</dd>
              </div>
            ))}
          </dl>
        </div>
        {code ? (
          <div className={styles.topicCode}>
            <CodeBlock language="json" title={code.title}>
              {code.body}
            </CodeBlock>
          </div>
        ) : (
          <a className={styles.topicShot} href={image}>
            <img src={image} alt={alt} loading="lazy" />
          </a>
        )}
      </div>
    </section>
  );
}

function OpenSourceSection() {
  return (
    <section className={styles.openSource}>
      <div className="container">
        <div className={styles.openSourceHead}>
          <h2 className={styles.topicTitle}>Open source, GPLv2</h2>
          <p className={styles.topicIntro}>
            No license fees, no vendor lock-in, full access to the
            source code on{" "}
            <a href="https://github.com/senaite">GitHub</a>.
          </p>
        </div>
        <dl className={styles.openSourceGrid}>
          {OPEN_SOURCE.map((point) => (
            <div key={point.title} className={styles.point}>
              <dt>{point.title}</dt>
              <dd>{point.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function TrustedBySection() {
  return (
    <section className={styles.trusted}>
      <div className="container">
        <p className={styles.trustedLead}>
          Used in diagnostic laboratories, research centres and public
          health programmes worldwide
        </p>
        <div className="trusted-logos">
          {TRUSTED_BY.map(({ name, image, url }) =>
            url ? (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={name}
              >
                <img src={image} alt={name} />
              </a>
            ) : (
              <span key={name} title={name}>
                <img src={image} alt={name} />
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className={styles.cta}>
      <div className={clsx("container", styles.ctaInner)}>
        <div>
          <h2 className={styles.ctaTitle}>Start with SENAITE</h2>
          <p className={styles.ctaText}>
            Install it yourself with Docker or from PyPI, or work with a
            service provider who knows the code base.
          </p>
        </div>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/installation"
          >
            Installation guide
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/enterprise"
          >
            Service providers
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Open Source LIMS"
      description={
        "SENAITE is an open source Laboratory Information Management"
        + " System covering the complete analytical workflow, from"
        + " sample intake to report publication."
      }
    >
      <HeroBanner />
      <main>
        <Lifecycle />
        {TOPICS.map((topic, index) => (
          <Topic key={topic.title} reverse={index % 2 === 1} {...topic} />
        ))}
        <OpenSourceSection />
        <TrustedBySection />
        <CtaBanner />
      </main>
    </Layout>
  );
}
