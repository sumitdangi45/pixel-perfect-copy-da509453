import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Grid2X2, Handshake, LockKeyhole, Mail, MapPin, Menu, MessageSquare, Phone, Send, ShieldCheck, UserRound, UsersRound, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import contactPerson from "@/assets/contact-person-matched.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Contact Us | Anni Web Solutions" },
    { name: "description", content: "Get in touch with Anni Web Solutions for a custom website, AI automation, or digital marketing consultation." },
    { property: "og:title", content: "Contact Us | Anni Web Solutions" },
    { property: "og:description", content: "Have a project in mind? Let's talk with Anni Web Solutions." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContactPage,
});

const serviceOptions = ["Prebuilt Website", "Customized Website", "AI Automation", "Digital Marketing", "Other"];

function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const service = String(data.get("service") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Project inquiry: ${service}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`);
    window.location.href = `mailto:info@anniwebsolutions.com?subject=${subject}&body=${body}`;
  }

  return <div className="site" id="top">
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Anni Web Solutions home"><span className="brand-symbol" aria-hidden="true"><span /><span /><i /></span><span className="brand-copy"><strong>Anni</strong><small>WEB SOLUTIONS PVT. LTD.</small></span></a>
      <nav className={menuOpen ? "site-nav site-nav-open" : "site-nav"} aria-label="Main navigation">
        <a href="#contact" onClick={() => setMenuOpen(false)}>Prebuilt</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Customized</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>AI Automation</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Digital Marketing</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a className="active" href="#contact" onClick={() => setMenuOpen(false)}>Contact Us</a>
      </nav>
      <Button variant="quote" className="header-quote" onClick={() => document.getElementById("name")?.focus()}>Get a Free Quote <ArrowRight /></Button>
      <Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
    </header>

    <main id="contact">
      <section className="contact-hero" aria-labelledby="contact-heading">
        <div className="hero-copy">
          <div className="eyebrow"><Phone size={15} fill="currentColor" /> Let's Connect</div>
          <h1 id="contact-heading">Have a Project<br />in Mind? <span>Let’s Talk!</span></h1>
          <p className="hero-intro">Whether you have a question, need a custom solution, or just want to explore possibilities — our team is here to help.</p>
          <div className="contact-methods">
            <a className="contact-method" href="https://wa.me/919876543210" target="_blank" rel="noreferrer"><span className="method-icon whatsapp-icon"><Phone size={23} fill="currentColor" /></span><span><strong>Chat on WhatsApp</strong><small>Get quick support</small></span><ChevronRight size={18} className="method-arrow" /></a>
            <a className="contact-method" href="tel:+919876543210"><span className="method-icon phone-icon"><Phone size={23} fill="currentColor" /></span><span><strong>Call Us</strong><small>+91 98765 43210</small></span><ChevronRight size={18} className="method-arrow" /></a>
            <a className="contact-method" href="mailto:info@anniwebsolutions.com"><span className="method-icon email-icon"><Mail size={23} /></span><span><strong>Email Us</strong><small>info@anniwebsolutions.com</small></span><ChevronRight size={18} className="method-arrow" /></a>
            <a className="contact-method" href="https://www.google.com/maps/search/?api=1&query=Bhopal%2C+Madhya+Pradesh" target="_blank" rel="noreferrer"><span className="method-icon office-icon"><MapPin size={23} /></span><span><strong>Our Office</strong><small>Bhopal, Madhya Pradesh</small></span><ChevronRight size={18} className="method-arrow" /></a>
          </div>
        </div>

        <div className="visual-side">
          <div className="mint-halo" /><div className="mint-halo-secondary" />
          <div className="hand-note">Let's<br />Build Something<br />Amazing Together <span>↙</span></div>
          <div className="spark spark-one" /><div className="spark spark-two" />
          <img className="contact-person" src={contactPerson} alt="Anni team member working at a laptop" width={1024} height={1024} />
        </div>

        <form className="message-form" onSubmit={sendMessage}>
          <h2>Send Us a Message</h2><p>Fill out the form and we'll get back to you within 24 hours.</p>
          <div className="form-grid">
            <label className="field"><UserRound size={17} /><input id="name" name="name" placeholder="Full Name *" aria-label="Full Name" required /></label>
            <label className="field"><Mail size={17} /><input type="email" name="email" placeholder="Email Address *" aria-label="Email Address" required /></label>
            <label className="field"><Phone size={17} /><input type="tel" name="phone" placeholder="Phone Number *" aria-label="Phone Number" required /></label>
            <label className="field"><Grid2X2 size={17} /><select name="service" aria-label="Select Service" required defaultValue=""><option value="" disabled>Select Service *</option>{serviceOptions.map(item => <option key={item} value={item}>{item}</option>)}</select><ChevronDown size={16} className="select-arrow" /></label>
          </div>
          <label className="field message-field"><MessageSquare size={17} /><textarea name="message" placeholder="Your Message *" aria-label="Your Message" required /></label>
          <Button variant="quote" type="submit" className="send-button"><Send size={16} /> Send Message <ArrowRight size={17} /></Button>
          <div className="privacy"><LockKeyhole size={11} /> Your information is safe with us. We never share your data.</div>
        </form>
      </section>

      <section className="stats-band" aria-label="Our commitments"><div className="stats-inner">
        <div className="stat"><span className="stat-icon"><Zap fill="currentColor" /></span><span><strong>Quick Response</strong><small>Within 24 Hours</small></span></div>
        <div className="stat"><span className="stat-icon"><UsersRound fill="currentColor" /></span><span><strong>Expert Consultation</strong><small>Free Initial Discussion</small></span></div>
        <div className="stat"><span className="stat-icon"><ShieldCheck fill="currentColor" /></span><span><strong>Customized Solutions</strong><small>As Per Your Needs</small></span></div>
        <div className="stat"><span className="stat-icon"><Handshake /></span><span><strong>Long-Term Partnership</strong><small>We Grow Together</small></span></div>
      </div></section>
    </main>
    <footer className="site-editor-footer"><Link to="/editor">Visual review for editors <ArrowRight size={14} /></Link></footer>
  </div>;
}