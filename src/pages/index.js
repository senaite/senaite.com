import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

const PERFORMANCE_CARDS = [
  {
    title: "Process Automation",
    image: "/img/undraw_investment.svg",
    content:
      "Configure step-by-step workflows that guide analysts through"
      + " the analytical process. Automated result imports, data"
      + " validation rules and transition constraints eliminate"
      + " repetitive manual tasks.",
  },
  {
    title: "Instrument Integration",
    image: "/img/undraw_solution_mindset.svg",
    content:
      "Connect directly to laboratory instruments using built-in"
      + " interfaces. Results are imported automatically, removing the"
      + " transcription step and the errors that come with it.",
  },
  {
    title: "Turnaround Time",
    image: "/img/undraw_done_checking.svg",
    content:
      "Set priorities and due dates on individual analyses. Daily work"
      + " is planned through worksheets, and overdue tests are visible"
      + " at a glance.",
  },
];

const CONTROL_CARDS = [
  {
    title: "ISO/IEC 17025 Ready",
    image: "/img/undraw_process.svg",
    content:
      "SENAITE supports the process controls required for ISO/IEC"
      + "\u00a017025 accreditation when deployed and operated in a"
      + " suitable infrastructure.",
  },
  {
    title: "Audit and Traceability",
    image: "/img/undraw_done.svg",
    content:
      "Every change to an electronic record creates an immutable"
      + " snapshot. User name, IP address and timestamp are captured"
      + " automatically. Nothing can be altered without trace.",
  },
  {
    title: "Data Insights",
    image: "/img/undraw_all_the_data.svg",
    content:
      "The built-in dashboard shows laboratory throughput across"
      + " daily, weekly, monthly and annual intervals. External BI"
      + " tools connect through the REST JSON API.",
  },
];

const TECHNOLOGY_CARDS = [
  {
    title: "Proven Security",
    image: "/img/undraw_security.svg",
    content:
      "Built on Plone, which holds the best security track record of"
      + " any major CMS. Role-based access control and a strict state"
      + " machine prevent unauthorised modification of electronic"
      + " records.",
  },
  {
    title: "Reliable Architecture",
    image: "/img/undraw_deliveries.svg",
    content:
      "Runs on Linux with standard web server infrastructure. Load"
      + " balancers, reverse proxies and virtualisation are all"
      + " supported. The architecture scales with your laboratory.",
  },
  {
    title: "Browser-Based",
    image: "/img/undraw_goals.svg",
    content:
      "No desktop software to install or maintain. Centralised"
      + " deployment gives IT full control and any device with a"
      + " browser can access the system.",
  },
];

const OPEN_SOURCE_CARDS = [
  {
    title: "No License Fees",
    image: "/img/undraw_invest.svg",
    content:
      "The cost shifts from recurring license fees to implementation"
      + " and customisation — a capital expense that builds real"
      + " capability rather than renting access to a black box.",
  },
  {
    title: "Reliability and Transparency",
    image: "/img/undraw_heatmap.svg",
    content:
      "Open source software is subject to worldwide scrutiny. Research"
      + " consistently shows it matches or exceeds proprietary"
      + " alternatives on reliability and security. The source code"
      + " is always available for audit.",
  },
  {
    title: "An Investment That Compounds",
    image: "/img/undraw_predictive_analytics.svg",
    content:
      "Every workflow, configuration and integration built on SENAITE"
      + " is owned outright by the organisation. The work accumulates"
      + " as institutional knowledge and capability — unlike proprietary"
      + " systems where costs continue indefinitely and switching"
      + " remains expensive.",
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

function FeatureCard({ title, image, content }) {
  return (
    <div className={clsx("col col--4", styles.featureCard)}>
      {image && (
        <div className="feature-card__icon">
          <img src={image} alt="" role="presentation" />
        </div>
      )}
      <h3 className="feature-card__title">{title}</h3>
      <p>{content}</p>
    </div>
  );
}

function Section({ title, subtitle, children, grey, dark }) {
  return (
    <section
      className={clsx("senaite-section", {
        "senaite-section--grey": grey,
        "senaite-section--dark": dark,
      })}
    >
      <div className="container">
        <div className="senaite-section__header">
          <h2 className="senaite-section__title">{title}</h2>
          {subtitle && (
            <p className="senaite-section__subtitle">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function HeroBanner() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <img
          src="/img/senaite_product_logo.svg"
          alt="SENAITE"
          className={styles.heroLogo}
        />
        <p className={styles.heroTagline}>
          Open source LIMS for serious laboratories
        </p>
        <p className={styles.heroSubtitle}>
          From sample intake to published report, SENAITE covers the
          complete analytical workflow — free to use, free to extend.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/installation"
          >
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/enterprise"
          >
            Professional Services
          </Link>
        </div>
      </div>
    </header>
  );
}

function PerformanceSection() {
  return (
    <Section
      title="Performance"
      subtitle="Less manual work, faster results"
    >
      <div className="row">
        {PERFORMANCE_CARDS.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
    </Section>
  );
}

function ControlSection() {
  return (
    <Section
      title="Control"
      subtitle={
        "Complete visibility over every step of the"
        + " analytical process"
      }
      grey
    >
      <div className="row">
        {CONTROL_CARDS.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
    </Section>
  );
}

function TechnologySection() {
  return (
    <Section
      title="Technology"
      subtitle="A stack built for production — today and ten years from now"
    >
      <div className="row">
        {TECHNOLOGY_CARDS.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
    </Section>
  );
}

function OpenSourceSection() {
  return (
    <Section
      title="Open Source"
      subtitle="No license fees. No vendor lock-in. Full access to the source code."
      grey
    >
      <div className="row">
        {OPEN_SOURCE_CARDS.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
    </Section>
  );
}

function TrustedBySection() {
  return (
    <Section
      title="Trusted By"
      subtitle={
        "Used in diagnostic laboratories, research centres and"
        + " public health programmes worldwide"
      }
    >
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
    </Section>
  );
}

function CtaBanner() {
  return (
    <div className="cta-banner">
      <h2 className="cta-banner__title">
        Start using SENAITE
      </h2>
      <p className="cta-banner__subtitle">
        Self-install from PyPI or work with a professional service
        provider who knows the codebase inside out.
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
        <PerformanceSection />
        <ControlSection />
        <TechnologySection />
        <OpenSourceSection />
        <TrustedBySection />
        <CtaBanner />
      </main>
    </Layout>
  );
}
