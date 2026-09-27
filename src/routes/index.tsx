import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, ChevronRight, Crown, Gem, Headphones, IndianRupee, Menu, Play, ShieldCheck, Star, UsersRound, X, ChartNoAxesColumnIncreasing, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pricing Plans | Anni Web Solutions" },
      { name: "description", content: "Explore transparent website and digital solution pricing from Anni Web Solutions, with plans for startups, growing businesses, and enterprises." },
      { property: "og:title", content: "Pricing Plans | Anni Web Solutions" },
      { property: "og:description", content: "Simple, transparent plans for every stage of growth. Find the right solution for your business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const plans = [
  { name: "Starter", audience: "For Small Businesses", price: "₹2,999", features: ["Essenting Features", "Basic Support", "Standard Plugins", "Ideal for Startups"], action: "Get Started", className: "starter-card" },
  { name: "Growth", audience: "For Growing Businesses", price: "₹7,999", features: ["Everything in Starter", "Advanced Features", "Priority Support", "Growth Focused Tools"], action: "Get Started", className: "growth-card" },
  { name: "Enterprise", audience: "For Large Organizations", price: "₹19,999", features: ["Custom Solutions", "Dedicated Manager", "Advanced Security", "Scalable Infrastructure"], action: "Contact Sales", className: "enterprise-card" },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Anni Web Solutions home">
      <span className="brand-symbol" aria-hidden="true"><span /><span /><i /></span>
      <span className="brand-copy"><strong>Anni</strong><small>WEB SOLUTIONS PVT. LTD.</small></span>
    </a>
  );
}

function PricingPage() {
  const [dialog, setDialog] = useState<"quote" | "guide" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Growth");

  const openQuote = (plan = "Growth") => { setSelectedPlan(plan); setDialog("quote"); setMenuOpen(false); };

  return (
    <div className="site" id="top">
      <header className="site-header">
        <Brand />
        <nav className={menuOpen ? "site-nav site-nav-open" : "site-nav"} aria-label="Main navigation">
          <a href="#plans" onClick={() => setMenuOpen(false)}>Prebuilt</a>
          <a href="#plans" onClick={() => setMenuOpen(false)}>Customized</a>
          <a href="#plans" onClick={() => setMenuOpen(false)}>AI Automation</a>
          <a href="#plans" onClick={() => setMenuOpen(false)}>Digital Marketing</a>
          <a className="active" href="#plans" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#contact" onClick={() => openQuote()}>Contact Us</a>
        </nav>
        <Button variant="quote" className="header-quote" onClick={() => openQuote()}>Get a Free Quote <ArrowRight aria-hidden="true" /></Button>
        <Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </header>

      <main>
        <section className="pricing-hero" id="plans" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="eyebrow"><Tag size={17} strokeWidth={2.5} aria-hidden="true" /> Simple &amp; Transparent Pricing</div>
            <h1 id="hero-heading">Plans for Every<br /><span>Stage of Growth</span></h1>
            <p className="hero-intro">Whether you’re a startup, a growing business, or an enterprise, we have the right plan for you. No hidden charges, no surprises — just real value.</p>
            <div className="benefits" aria-label="Why choose Anni">
              <div className="benefit"><span className="benefit-icon"><IndianRupee /></span><span>Affordable<br />Plans</span></div>
              <div className="benefit"><span className="benefit-icon"><Gem /></span><span>Feature-Rich<br />Solutions</span></div>
              <div className="benefit"><span className="benefit-icon"><ShieldCheck /></span><span>No Hidden<br />Charges</span></div>
              <div className="benefit"><span className="benefit-icon"><Headphones /></span><span>Dedicated<br />Support</span></div>
            </div>
            <div className="hero-actions">
              <Button variant="quote" onClick={() => openQuote()}>Get a Free Consultation <ArrowRight aria-hidden="true" /></Button>
              <Button variant="pricingOutline" onClick={() => setDialog("guide")}><span className="play-ring"><Play size={11} fill="currentColor" /></span> Watch Pricing Guide</Button>
            </div>
          </div>

          <div className="plans-scene" aria-label="Pricing plans">
            <div className="scene-halo halo-one" /><div className="scene-halo halo-two" /><div className="scene-halo halo-three" />
            <div className="hand-note top-note">Invest<br />in a Smarter<br />Tomorrow <span className="curved-arrow">↘</span></div>
            <span className="scribble scribble-left" aria-hidden="true" /><span className="scribble scribble-right" aria-hidden="true" />
            <div className="plan-cards">
              {plans.map((plan, index) => (
                <article className={`plan-card ${plan.className}`} key={plan.name}>
                  {index === 1 && <div className="popular"><Crown size={15} fill="currentColor" /> Most Popular</div>}
                  <div className="plan-heading"><h2>{plan.name}</h2><p>{plan.audience}</p></div>
                  <div className="plan-price"><strong>{plan.price}</strong><span>/month</span></div>
                  <ul>{plan.features.map(feature => <li key={feature}><span className="check-icon"><Check size={11} strokeWidth={2.7} /></span>{feature}</li>)}</ul>
                  <Button variant={index === 1 ? "growth" : "planOutline"} className="plan-action" onClick={() => openQuote(plan.name)}>{plan.action} <ArrowRight size={15} /></Button>
                </article>
              ))}
            </div>
            <div className="hand-note bottom-note"><span className="bottom-arrow">↖</span> Flexible Plans<br />Real Results</div>
          </div>
        </section>

        <section className="stats-band" aria-label="Our results">
          <div className="stats-inner">
            <div className="stat"><span className="stat-icon"><UsersRound fill="currentColor" /></span><span><strong>500+</strong><small>Happy Clients</small></span></div>
            <div className="stat"><span className="stat-icon"><ChartNoAxesColumnIncreasing fill="currentColor" /></span><span><strong>1000+</strong><small>Projects Delivered</small></span></div>
            <div className="stat"><span className="stat-icon"><Star /></span><span><strong>4.9/5</strong><small>Client Satisfaction</small></span></div>
            <div className="stat"><span className="stat-icon"><ShieldCheck /></span><span><strong>100%</strong><small>Transparent Pricing</small></span></div>
          </div>
        </section>
      </main>

      {dialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
        <div className="dialog-panel" role="dialog" aria-modal="true" aria-label={dialog === "quote" ? "Get a free quote" : "Pricing guide"}>
          <Button variant="ghost" size="icon" className="dialog-close" aria-label="Close" onClick={() => setDialog(null)}><X /></Button>
          {dialog === "guide" ? <><p className="dialog-kicker">PRICING GUIDE</p><h2>Find your fit.</h2><p>Start small, build momentum, or create a solution tailored to your organization.</p><div className="guide-list">{plans.map(plan => <div key={plan.name}><span>{plan.name}</span><strong>{plan.price}<small> /month</small></strong></div>)}</div><Button variant="quote" onClick={() => openQuote()}>Get a Free Consultation <ArrowRight /></Button></> : <><p className="dialog-kicker">LET’S TALK</p><h2>Get a free quote.</h2><p>Tell us which plan interests you and we’ll help you choose the right next step.</p><div className="selected-plan">Your selected plan <strong>{selectedPlan}</strong></div><div className="quote-options">{plans.map(plan => <Button key={plan.name} variant={selectedPlan === plan.name ? "growth" : "pricingOutline"} onClick={() => setSelectedPlan(plan.name)}>{plan.name}</Button>)}</div><p className="contact-notice">Contact details will be available soon.</p></>}
        </div>
      </div>}
    </div>
  );
}