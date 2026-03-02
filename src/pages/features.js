import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./features.module.css";

const FEATURES = [
  {
    title: "Sample Management",
    content:
      "Register any sample type from any client in a single unified"
      + " interface. Custom IDs, matrix-specific fields, priority flags"
      + " and a configurable status lifecycle are available from day one.",
  },
  {
    title: "Worksheets",
    content:
      "Group analyses across samples and clients into a single working"
      + " batch. Blanks, controls and duplicates sit alongside real"
      + " analyses and are evaluated automatically during verification.",
  },
  {
    title: "Batches",
    content:
      "Link related samples under a project or client batch for"
      + " collective tracking and reporting. Clients can create batch"
      + " requests directly through the portal.",
  },
  {
    title: "Partitions and Aliquots",
    content:
      "Split samples into partitions with different containers, volumes"
      + " and analysis sets. The parent\u2013child relationship is"
      + " preserved throughout, and partitions can be detached when"
      + " needed.",
  },
  {
    title: "Profiles and Templates",
    content:
      "An analysis profile bundles a set of services so that one"
      + " selection adds all required tests. Templates add"
      + " auto-partitioning logic triggered automatically on sample"
      + " reception.",
  },
  {
    title: "Instrument Management",
    content:
      "Record calibration certificates and maintenance history for"
      + " each instrument. Results imported from instruments are"
      + " validated against active calibration data, and QC tests"
      + " monitor performance continuously.",
  },
  {
    title: "Audit Log",
    content:
      "Every action on every record produces an immutable snapshot."
      + " User, IP address and timestamp are stored. The full history"
      + " of any object is available for inspection at any time.",
  },
  {
    title: "Calculations",
    content:
      "Write formulas that reference results from other analyses,"
      + " interim fields or custom parameters. For advanced cases,"
      + " embed Python code and call third-party libraries directly.",
  },
  {
    title: "Roles and Permissions",
    content:
      "Eleven built-in roles with status-aware permission sets: from"
      + " client contact through sampler, analyst and verifier to lab"
      + " manager and regulatory inspector. Custom roles are also"
      + " supported.",
  },
  {
    title: "Client Portal",
    content:
      "Clients log in to submit sample requests, monitor status and"
      + " download published reports. Each client sees only their own"
      + " data.",
  },
  {
    title: "Reports and Publishing",
    content:
      "SENAITE Impress generates PDF reports with fully customisable"
      + " templates. Reports are reviewed and published to clients in"
      + " a single step.",
  },
  {
    title: "REST JSON API",
    content:
      "Every resource and workflow action is accessible via a"
      + " RESTful JSON API. Build integrations with ERP systems, BI"
      + " platforms, custom applications and external instruments.",
  },
];

function FeatureCard({ title, content }) {
  return (
    <div className={clsx("col col--4", styles.featureCard)}>
      <div className={styles.featureCardInner}>
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
        + " portal, REST API and more — all included, nothing extra."
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
      </main>
    </Layout>
  );
}
