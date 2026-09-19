import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icons } from './icons'
import { site } from '../data/content'
import './ContactForm.css'

const initial = { name: '', email: '', phone: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'Please write a short message (at least 10 characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: null }))
  }

  // Phase 3: POST to /api/contact. Kept local until the backend exists.
  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setStatus('sent')
      setForm(initial)
      setTimeout(() => setStatus('idle'), 6000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form__row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={onChange}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="field__error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="field__error">{errors.email}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone">Phone <span className="field__optional">(optional)</span></label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+000 000 000 0000"
          value={form.phone}
          onChange={onChange}
        />
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Tell us which class you are interested in, or ask any question…"
          value={form.message}
          onChange={onChange}
          aria-invalid={!!errors.message}
        ></textarea>
        {errors.message && <p className="field__error">{errors.message}</p>}
      </div>

      <div className="contact-form__actions">
        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          <FontAwesomeIcon icon={icons['paper-plane']} />
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
        <span className="contact-form__note">
          Direct class enquiries are also welcome — contact the academy at{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </span>
      </div>

      {status === 'sent' && (
        <p className="contact-form__success" role="status">
          Thanks — your message has been sent. The academy will get back to you soon, in shā&#x2019; Allāh.
        </p>
      )}
      {status === 'error' && (
        <p className="contact-form__error" role="alert">
          Something went wrong. Please try again, or email {site.email} directly.
        </p>
      )}
    </form>
  )
}