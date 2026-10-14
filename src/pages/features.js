import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./features.module.css";

const FEATURES = [
  {
    title: "Sample Management",
    image: "/img/features/sample-management.webp",
    alt:
      "Sample listing with status filters, progress bars and samples"
      + " from several clients in different states",
    content:
      "Register any sample type from any client in a single unified"
      + " interface. Custom IDs, matrix-specific fields, priority flags"
      + " and a configurable status lifecycle are available from day one.",
  },
  {
    title: "Worksheets",
    image: "/img/features/worksheets.webp",
    alt:
      "Worksheet in transposed layout with a blank, a control and"
      + " routine samples, each with calcium and magnesium results",
    content:
      "Group analyses across samples and clients into a single working"
      + " batch. Blanks, controls and duplicates sit alongside real"
      + " analyses and are evaluated automatically during verification.",
  },
  {
    title: "Batches",
    image: "/img/features/batches.webp",
    alt:
      "Samples of the batch Borehole survey 2026 with their states",
    content:
      "Link related samples under a project or client batch for"
      + " collective tracking and reporting, and publish them"
      + " together.",
  },
  {
    title: "Partitions and Aliquots",
    image: "/img/features/partitions.webp",
    alt:
      "Client sample listing with a primary sample expanded to show its"
      + " two partitions",
    content:
      "Split samples into partitions with different containers, volumes"
      + " and analysis sets. The parent\u2013child relationship is"
      + " preserved throughout, and partitions can be detached when"
      + " needed.",
  },
  {
    title: "Profiles and Templates",
    image: "/img/features/profiles.webp",
    alt:
      "Analysis profile Total Hardness listing calcium, magnesium and"
      + " total hardness with methods, units and prices",
    content:
      "An analysis profile bundles a set of services so that one"
      + " selection adds all required tests. Templates add"
      + " auto-partitioning logic triggered automatically on sample"
      + " reception.",
  },
  {
    title: "Instrument Management",
    image: "/img/features/instruments.webp",
    alt:
      "Instrument listing with type, brand, model and calibration expiry date",
    content:
      "Record calibration certificates and maintenance history for"
      + " each instrument. An instrument whose certificate has expired"
      + " or whose control results fail is marked invalid and cannot"
      + " take new results until it is fixed.",
  },
  {
    title: "Audit Log",
    image: "/img/features/audit-log.webp",
    alt:
      "Audit log of a sample: versions with date, user, remote IP,"
      + " action, workflow state and changed fields",
    content:
      "Every change to a record is stored as a snapshot with user,"
      + " IP address and timestamp. The full history of any object is"
      + " available for inspection at any time.",
  },
  {
    title: "Calculations",
    image: "/img/features/calculations.webp",
    alt:
      "Calculation Total Hardness with the formula [Ca] + [Mg] and"
      + " additional Python library functions",
    content:
      "Write formulas that reference results from other analyses,"
      + " interim fields or custom parameters. For advanced cases,"
      + " embed Python code and call third-party libraries directly.",
  },
  {
    title: "Roles and Permissions",
    image: "/img/features/roles.webp",
    alt:
      "Users and Groups control panel: groups such as Analysts, Lab"
      + " Clerks and Lab Managers mapped to roles",
    content:
      "Built-in roles from client contact through sampler, analyst"
      + " and verifier to lab manager, with permissions that change"
      + " with the state of each sample and analysis.",
  },
  {
    title: "Client Portal",
    image: "/img/features/client-portal.webp",
    alt:
      "Sample listing of a client contact who sees only the samples of"
      + " their own client",
    content:
      "Clients log in to submit sample requests, monitor status and"
      + " download published reports. Each client sees only their own"
      + " data.",
  },
  {
    title: "Reports and Publishing",
    image: "/img/features/reports.webp",
    alt:
      "SENAITE Impress publish view with template, paper format and a"
      + " preview of the analysis report",
    content:
      "SENAITE Impress generates PDF reports with fully customisable"
      + " templates. Reports are reviewed and published to clients in"
      + " a single step.",
  },
  {
    title: "REST JSON API",
    image: "/img/features/json-api.webp",
    alt:
      "Formatted JSON response of a sample search with paging fields",
    content:
      "Every resource and workflow action is accessible via a"
      + " RESTful JSON API. Build integrations with ERP systems, BI"
      + " platforms, custom applications and external instruments.",
  },
];

function FeatureCard({ title, content, image, alt }) {
  const src = useBaseUrl(image);
  return (
    <div className={clsx("col col--4", styles.featureCard)}>
      <div className={styles.featureCardInner}>
        <a className={styles.featureShot} href={src}>
          <img src={src} alt={alt} loading="lazy" width="1600" height="1000" />
        </a>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <Layout
      title="Features"
      description={
        "SENAITE covers the complete analytical workflow: sample"
        + " management, worksheets, calculations, audit log, client"
        + " portal, REST API and more, all included."
      }
    >
      {/* Hero */}
      <header className={styles.hero}>
        <div className="container">
          <h1>Features</h1>
          <p>
            A complete LIMS, configurable without compromise.
          </p>
        </div>
      </header>

      <main>
        {/* Feature grid */}
        <section className="senaite-section">
          <div className="container">
            <div className="senaite-section__header">
              <h2 className="senaite-section__title">
                What&apos;s Included
              </h2>
              <p className="senaite-section__subtitle">
                Every module covers a real workflow. Nothing is an add-on.
              </p>
            </div>
            <div className="row">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-banner">
          <div className="container">
            <h2 className="cta-banner__title">
              Evaluate SENAITE against your requirements
            </h2>
            <p className="cta-banner__subtitle">
              The installation guide gets you a running system quickly.
              For a guided evaluation with your actual workflows, talk
              to a service provider.
            </p>
            <div className="cta-banner__buttons">
              <Link
                className="button button--primary button--lg"
                to="/docs/installation"
              >
                Installation Guide
              </Link>
              <Link
                className="button button--outline button--secondary button--lg"
                to="/enterprise"
              >
                Professional Services
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
