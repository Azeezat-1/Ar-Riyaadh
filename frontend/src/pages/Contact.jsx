import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from '../components/icons'
import PageWrapper from '../components/PageWrapper'
import SectionHeading from '../components/SectionHeading'
import ContactForm from '../components/ContactForm'
import { Reveal } from '../components/motion'
import { site } from '../data/content'

const contactMethods = [
  {
    icon: icons.brandTelegram,
    title: 'Telegram',
    text: 'Classes and lectures are joined through Telegram. Follow the class link or ask for access.',
  },
  {
    icon: icons.envelope,
    title: 'Email',
    text: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: icons.phone,
    title: 'Phone / WhatsApp',
    text: site.phone,
    href: `tel:${site.phone.replace(/\s/g, '')}`,
  },
]

export default function Contact() {
  return (
    <PageWrapper>
      <section className="page-head">
        <div className="container">
          <div className="page-head__inner">
            <span className="eyebrow">Contact</span>
            <h1>Get in touch</h1>
            <p className="lede">
              Questions about joining a class, choosing your starting point, or enrolling for
              lectures? Reach out below — the academy is happy to guide you.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'start' }}>
            <Reveal as="div">
              <SectionHeading
                align="left"
                eyebrow="Reach us"
                title="Ways to contact the academy"
                lede="Prefer messaging? Any of these channels work."
              />
              <ul className="contact-methods">
                {contactMethods.map((m) => (
                  <li key={m.title} className="card contact-method">
                    <span className="icon-wrap icon-wrap--gold">
                      <FontAwesomeIcon icon={m.icon} aria-hidden="true" />
                    </span>
                    <span className="contact-method__body">
                      <span className="contact-method__title">{m.title}</span>
                      {m.href ? <a href={m.href}>{m.text}</a> : <span>{m.text}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="div">
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.35rem', marginBottom: '1.25rem' }}>
                  Send a message
                </h3>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tinted" id="join-cta">
        <div className="container container--narrow" style={{ textAlign: 'center' }}>
          <SectionHeading
            eyebrow="Class enquiries"
            title="Ask about a class"
            lede="Tell us which class you're interested in and where you are in your learning journey — we'll help you find a good starting point."
          />
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" className="btn btn--primary">
              Ask About a Class
            </a>
            <a href="#" className="btn btn--gold">
              <FontAwesomeIcon icon={icons.brandTelegram} />
              Join a Telegram Class
            </a>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}