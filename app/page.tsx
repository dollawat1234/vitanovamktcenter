import { LeadForm } from "./lead-form";

const stats = [
  { label: "Launch window", value: "7 days" },
  { label: "Core pages", value: "5+" },
  { label: "Lead capture", value: "Ready" }
];

const features = [
  "Clear positioning for campaigns and product launches",
  "Lead capture API wired for Vercel Postgres",
  "Deployment-ready structure for GitHub and Vercel"
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav" aria-label="Primary">
          <strong>Marketing Site</strong>
          <a href="#contact">Contact</a>
        </nav>
        <div className="heroContent">
          <p className="eyebrow">Built for fast campaign launches</p>
          <h1>Marketing that turns visits into real conversations.</h1>
          <p className="intro">
            A polished landing page foundation with GitHub, Vercel deployment,
            and database-backed lead capture ready to connect.
          </p>
          <div className="actions">
            <a className="button primary" href="#contact">
              Start a campaign
            </a>
            <a className="button secondary" href="#details">
              View details
            </a>
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Project highlights">
        {stats.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section id="details" className="contentBand">
        <div>
          <p className="eyebrow">Ready foundation</p>
          <h2>Everything needed for the next production step.</h2>
        </div>
        <ul className="featureList">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section id="contact" className="contact">
        <div>
          <p className="eyebrow">Lead capture</p>
          <h2>Collect qualified leads from day one.</h2>
          <p>
            Submissions go through a server route and can be stored in Vercel
            Postgres once the database integration is connected.
          </p>
        </div>
        <LeadForm />
      </section>
    </main>
  );
}
