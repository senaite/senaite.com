import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./enterprise.module.css";

/**
 * tier: 1 = Core Maintainer, 2 = Certified Partner
 * Core Maintainers are rendered prominently; Certified Partners
 * appear in a second, subtler row below.
 */
const PROVIDERS = [
  {
    tier: 1,
    name: "RIDING BYTES",
    logo: "/img/ridingbytes.svg",
    tagline: "Professional Open Source Solutions",
    url: "https://www.ridingbytes.com",
    description:
      "Germany-based software company and the primary maintainer of"
      + " the SENAITE platform. RIDING BYTES leads core development,"
      + " publishes every major release and has driven SENAITE"
      + " implementations across Europe and Africa.",
  },
  {
    tier: 1,
    name: "Nara Labs",
    logo: "/img/naralabs.png",
    tagline: "Open Source LIMS Specialists",
    url: "https://naralabs.com",
    description:
      "Spain-based company and active co-maintainer of SENAITE."
      + " Nara Labs contributes core development and supports"
      + " laboratories in Southern Europe and Latin America with"
      + " implementation, training and long-term support.",
  },
  {
    tier: 2,
    name: "YME",
    logo: "/img/yme.svg",
    tagline: "Making Complex Simple \u2014 with Standards",
    url: "https://yme.rocks/en",
    description:
      "Healthcare automation company based in Novosibirsk,"
      + " specialising in workflow orchestration and system"
      + " interoperability. YME delivers SENAITE-based laboratory"
      + " solutions integrated with clinical systems using HL7,"
      + " FHIR and IHE standards.",
  },
];

const WHY_CHOOSE = [
  {
    title: "Deep Platform Knowledge",
    image: "/img/undraw_version_control.svg",
    content:
      "Providers are the authors of SENAITE. They understand the"
      + " codebase thoroughly, know why design decisions were made"
      + " and can add capabilities or adapt existing behaviour"
      + " without introducing regressions. Development work feeds"
      + " back into the platform and benefits the whole community.",
  },
  {
    title: "Laboratory and IT Fluency",
    image: "/img/undraw_usability_testing.svg",
    content:
      "Successful LIMS implementation requires fluency in both"
      + " laboratory science and software engineering. Providers"
      + " have worked with laboratory staff and IT teams across"
      + " multiple continents and understand the practical"
      + " constraints on both sides.",
  },
  {
    title: "Defined Delivery Standards",
    image: "/img/undraw_confirmation.svg",
    content:
      "All code is peer-reviewed before delivery. Automated test"
      + " suites cover the platform and every new feature. The"
      + " result is a stable system that does not degrade over time"
      + " and is straightforward for a future team to maintain.",
  },
  {
    title: "Scoped Project Plans",
    image: "/img/undraw_organizing_projects.svg",
    content:
      "Every engagement begins with a requirements meeting and a"
      + " formal GAP analysis that establishes exactly what SENAITE"
      + " covers out of the box, what requires configuration and"
      + " what requires custom development. A project plan with"
      + " explicit scope, milestones and deliverables follows.",
  },
  {
    title: "Capacity Building",
    image: "/img/undraw_high_five.svg",
    content:
      "Functional workshops train laboratory staff to use the"
      + " system with confidence and expose edge cases that generic"
      + " configuration misses. Technical training gives"
      + " administrators and developers the knowledge to manage and"
      + " extend the platform without outside help.",
  },
  {
    title: "Long-Term Support",
    image: "/img/undraw_instant_support.svg",
    content:
      "Support contracts cover version updates, security patches,"
      + " system monitoring and corrective actions. The objective is"
      + " a system that stays current with both new SENAITE releases"
      + " and the evolving requirements of the laboratory.",
  },
];

const tier1 = PROVIDERS.filter((p) => p.tier === 1);
const tier2 = PROVIDERS.filter((p) => p.tier === 2);

function ProviderCard({ name, logo, tagline, url, description, compact }) {
  return (
    <div
      className={clsx("provider-card", styles.providerCard, {
        [styles.providerCardCompact]: compact,
      })}
    >
      <div className="provider-card__logo">
        <img src={logo} alt={name} />
      </div>
      <p className={styles.providerTagline}>{tagline}</p>
      <p className={styles.providerDescription}>{description}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="button button--primary button--sm"
      >
        Visit {name}
      </a>
    </div>
  );
}

function WhyCard({ title, image, content }) {
  return (
    <div className={clsx("col col--4", styles.whyCard)}>
      {image && (
        <div className={styles.whyIcon}>
          <img src={image} alt="" role="presentation" />
        </div>
      )}
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

export default function Enterprise() {
  return (
    <Layout
      title="Professional Services"
      description={
        "Implementation, training and long-term support for SENAITE"
        + " from the teams who build and maintain the platform."
      }
    >
      {/* Hero */}
      <header className={styles.hero}>
        <div className="container">
          <h1>Professional Services</h1>
          <p>
            Implementation, training and support from the teams
            who build the platform.
          </p>
        </div>
      </header>

      <main>
        {/* Providers */}
        <section className="senaite-section">
          <div className="container">
            <div className="senaite-section__header">
              <h2 className="senaite-section__title">
                Service Providers
              </h2>
              <p className="senaite-section__subtitle">
                Each provider is an active contributor to the SENAITE
                codebase, combining deep technical knowledge with
                direct laboratory experience.
              </p>
            </div>

            {/* Tier 1 — Core Maintainers */}
            <p className={styles.tierLabel}>Core Maintainers</p>
            <div className="provider-grid">
              {tier1.map((p) => (
                <ProviderCard key={p.name} {...p} />
              ))}
            </div>

            {/* Tier 2 — Certified Partners */}
            <p className={clsx(styles.tierLabel, styles.tierLabelSpaced)}>
              Certified Partners
            </p>
            <div className={styles.partnerGrid}>
              {tier2.map((p) => (
                <ProviderCard key={p.name} {...p} compact />
              ))}
            </div>
          </div>
        </section>

        {/* Why professional providers */}
        <section className="senaite-section senaite-section--grey">
          <div className="container">
            <div className="senaite-section__header">
              <h2 className="senaite-section__title">
                What Sets Professional Providers Apart
              </h2>
              <p className="senaite-section__subtitle">
                Implementation quality determines whether a LIMS
                delivers long-term value
              </p>
            </div>
            <div className="row">
              {WHY_CHOOSE.map((item) => (
                <WhyCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="cta-banner">
          <h2 className="cta-banner__title">
            Work with the teams who build SENAITE
          </h2>
          <p className="cta-banner__subtitle">
            Providers have experience across clinical, research and
            environmental laboratories. Contact one directly to
            discuss your requirements.
          </p>
          <div className="cta-banner__buttons">
            <a
              href="https://www.ridingbytes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--lg"
            >
              Contact RIDING BYTES
            </a>
            <a
              href="https://naralabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--lg"
            >
              Contact Nara Labs
            </a>
            <a
              href="https://yme.rocks/en"
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary button--lg"
            >
              Contact YME
            </a>
            <Link
              className="button button--primary button--lg"
              to="/docs/installation"
            >
              Self-Install Guide
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
