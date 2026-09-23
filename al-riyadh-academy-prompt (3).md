# AR RIYAADH ACADEMY — MASTER WEBSITE BUILD PROMPT (v2)

You are working inside my current VS Code workspace.

**Build the actual website in code. Do not give me a presentation, mockup, conceptual explanation, or list of things I should build. Inspect the workspace, create/modify the necessary files, implement the frontend, run it, test it, and fix errors.**

The website is for **Ar-Riyaadh Academy**, full name **Umm Abdillah Ar-Riyaadh Academy** (per the official logo), an Islamic educational academy dedicated to teaching **females and girls**, led by **Umm Abdillah Ar-Riyaadh**, a female teacher / Muallima who teaches Islamic and Arabic studies. Motto: **"Rooted Learning, Lasting Impact."**

---

# 1. PROJECT GOAL

Build a beautiful, trustworthy, educational and welcoming academy website for female students of different age groups: teenage girls, young women, adult women, mothers, women interested in Islamic studies and Arabic.

The academy focuses on: Qur'an, Hadith, Tafsir, Arabic language (Lughat al-Arabiyyah), Islamic education, Islamic lectures, purification and worship, Muslim responsibilities and character, Islamic homeschooling, **Hijaamah (Islamic cupping therapy) instruction**, and general beneficial Islamic knowledge.

The site should communicate: **Knowledge • Faith • Growth • Teaching • Perseverance • Community** — peaceful, elegant, scholarly, feminine, trustworthy.

---

# 2. DESIGN SYSTEM (define this before building anything)

This section exists so the site doesn't default to a generic AI-landing-page look. Treat every rule below as binding for all pages.

### 2.1 Logo & signature motif
Use the academy's actual logo (provided separately as an image asset) as the source of truth for brand elements: it features a deep-green circular badge, a thin sage-green inner ring, a line-art mosque/mihrab silhouette, an open-book icon, and a crescent — with the motto "Rooted Learning, Lasting Impact" and Arabic name beneath. Pull one of these existing marks (the crescent, or the open-book line icon) and reuse it consistently as the site's signature motif — for dividers, pull-quote markers, section numbers, or footer accents — rather than introducing a new decorative element. Place the logo itself in the header (left-aligned, appropriately sized, with sufficient clear space around it) and in the footer.

### 2.1a Colors sourced from the logo
Pull the actual palette from the logo file rather than approximating: the deep forest green and the lighter sage/olive green used in the badge and ring are the two primary brand greens; white/cream is the base; near-black is used for the Arabic wordmark and can serve as the charcoal text color. Treat section 2.4 below as this literal palette, not a generic "Islamic green" guess.

### 2.2 Typography — use these exact specs, don't leave it to interpretation
- **English headings:** a refined serif (e.g. Fraunces or Cormorant Garamond), slightly wide letter-spacing on eyebrows/labels.
- **English body:** a clean sans-serif (e.g. Inter or Work Sans), 16–18px base, 1.6–1.7 line-height.
- **Arabic:** a dedicated Arabic font with strong readability (e.g. Amiri or Noto Naskh Arabic), rendered RTL where appropriate.
- **Type scale:** define once and reuse — e.g. H1 48/56px, H2 32/40px, H3 24/32px, body 16–18px, small 14px. No ad-hoc font sizes outside this scale.

### 2.3 Spacing
Use an 8px spacing scale throughout. Section vertical padding: minimum 96px desktop / 56px mobile. Cramped spacing is the fastest way to look unfinished — err generous.

### 2.4 Color palette
CSS variables only, restrained palette: deep green, sage green, cream, warm white, soft beige, muted gold (used sparingly, as accent only — not backgrounds), deep charcoal for text. No neon, no heavy gradients, no glassmorphism.

### 2.5 Shape & component consistency
Pick one border-radius scale and stick to it (e.g. 4px buttons, 12–16px cards) rather than mixing values across components. Buttons, inputs, and cards should share the same corner logic site-wide.

### 2.6 Layout — break the template pattern at least once
Avoid an all-centered-hero + all-3-column-card-grid site. Deliberately vary structure: e.g. an asymmetric hero (image offset, text left-aligned, not centered), an editorial horizontal-scroll or staggered layout for "What We Teach" instead of a plain grid, and a timeline that reads as a real narrative rather than a repeated icon row.

### 2.7 Photography treatment
Apply one consistent color grade/treatment (e.g. slight warm desaturation) across every photo so they read as one shoot, not assorted stock. Define a fixed aspect ratio per section (hero, class cards, testimonials) so layout doesn't shift when real images are swapped in later.

### 2.7a Image sourcing rule — no AI-generated images
Every photo used on the site, especially for the **Hijaamah (cupping) teaching content**, must be a real photograph — never an AI-generated image. Do not use image-generation tools for any content imagery on this site. Real reference images can be manually sourced from places like Pinterest or Yandex Images, then licensed/used appropriately or replaced with the academy's own photos before launch. In the codebase, use clearly labeled placeholder image paths/components for these slots (e.g. `/images/placeholders/hijaamah-1.jpg`) so real photos can be dropped in later without touching layout code — do not have the coding agent generate or fabricate a substitute image on its own.

### 2.8 Micro-details
- Subtle link/underline hover animation, not just color change
- A designed loading skeleton, not a generic spinner
- Empty/placeholder states styled on purpose (e.g. "Testimonials coming soon" as a proper designed state, not blank space)
- Visible, on-brand focus states for accessibility (not the browser default blue outline)

---

# 3. TECHNOLOGY

MERN stack. Frontend first, backend after.

Frontend: React, Vite, JavaScript (no TypeScript unless the project already requires it), React Router, Axios, Framer Motion, Font Awesome.
Backend: Node.js, Express.js, MongoDB, Mongoose.

**Build order:**
- **Phase 1a:** Build Home and About fully, to production-quality polish. Treat these two pages as the design-language reference for the rest of the site — get typography, spacing, color, and the signature motif exactly right here first.
- **Phase 1b:** Propagate that established system to Classes, Lectures, Homeschooling, Testimonials, Contact.
- **Phase 2:** Backend/API.
- **Phase 3:** Connect frontend to backend.
- **Phase 4:** Full test pass and fixes.

---

# 4. INSPECT THE WORKSPACE FIRST

Before writing code: inspect the existing project, understand folder structure, identify installed packages, reuse useful existing config, don't delete unrelated files, don't touch unrelated projects. Then implement — actually write the code, don't just describe it.

---

# 5. BRAND & AUDIENCE

Brand: **AR RIYAADH ACADEMY**. Teacher: **Umm Abdillah Ar-Riyaadh** — may be referred to as Muallima, Teacher, Islamic educator, student of knowledge. Do not claim qualifications not provided.

Audience: females only — teenage Muslimahs, adult Muslimahs, mothers, women beginning Islamic learning, women seeking structured Arabic/Qur'an/Hadith study. The design should visibly reflect a female-focused environment while staying mature and elegant, not childish or overly decorative.

Avoid: excessive gold, excessive Islamic ornamentation, mosque-imagery clichés, neon, heavy gradients, glassmorphism, cartoonish design, generic AI-landing-page look, excessive animation.

---

# 6. ISLAMIC CONTENT ACCURACY (critical)

Do not invent Qur'an verses, Hadith, scholar quotations, Arabic religious statements, rulings, or references. Where a Qur'an verse or Hadith appears, use correct wording and cite the source; never present uncertain wording as authentic.

For the seeking-knowledge hadith, use:
> "Whoever takes a path in which he seeks knowledge, Allah will make easy for him a path to Paradise." — Sahih Muslim

Do not add other fabricated religious quotations. Where more are needed, leave a clearly marked placeholder for verified content.

---

# 7. HEADER

Desktop nav: Home, About, Classes, Lectures, Homeschooling, Testimonials, Contact. Clear CTA: "Join a Class" / "Explore Classes." Mobile: logo, menu icon, nav drawer, close icon (no cart icon needed).

---

# 8. HERO SECTION

Asymmetric layout (see 2.6) — not a centered stock-hero. High-quality, tastefully modest imagery of Muslim women/girls learning, reading Qur'an, studying Arabic, in a female-only classroom setting. No inappropriate or stereotypical framing.

- Eyebrow: **AR RIYAADH ACADEMY**
- Headline: built around "Seeking Knowledge. Growing in Faith." or similar
- Supporting text: structured Islamic and Arabic learning for women and girls
- CTAs: Explore Classes / Join a Telegram Class / Learn More
- Subtle Framer Motion entrance animation, respecting reduced-motion preferences

---

# 9. WHAT WE TEACH

Use the varied layout from 2.6 (editorial/staggered, not a plain 3-col grid) for cards covering: Qur'an, Hadith, Tafsir, Arabic Language, Islamic Education, Lectures, and **Hijaamah (Islamic cupping therapy)**. Font Awesome icons, elegant not generic. For the Hijaamah card specifically, follow the image rule in 2.7a — real photography only, never AI-generated.

---

# 10. CLASSES (Telegram-based)

Dedicated Classes section/page. Each class card: title, short description, intended audience, learning focus, schedule placeholder, Telegram CTA ("Join This Class" / "Request Access"). Do not invent real Telegram URLs — use clearly replaceable placeholders. Organize by category (Qur'an, Hadith, Tafsir, Arabic, Islamic Studies, **Hijaamah**), with filtering if it improves usability.

Include explanatory copy along the lines of: "Interested in joining a class? Select the class you're interested in and follow the provided link or contact the appropriate person for access."

---

# 11. ABOUT UMM ABDILLAH AR-RIYADH

Personal, humble, sincere tone — not exaggerated. Her story: began as a student of knowledge roughly ten years ago, studied at Madrasa Sunnah wal Jama'ah, Iwo, Osun State; the journey included difficulty and perseverance, eventually leading to teaching other women and girls.

Include a visual timeline (Beginning → Learning → Perseverance → Teaching → Ar-Riyaadh Academy) built as a real narrative, with subtle scroll animation.

Do not invent: her age, family details beyond what's given, degrees, teachers she studied under, other institutions, awards, certifications, student counts, additional years of teaching, unlisted locations, or unlisted religious credentials.

---

# 12. HADITH / KNOWLEDGE FEATURE

Calm, respectful presentation of the seeking-knowledge hadith (see Section 6) connecting it to the academy's mission. Not a marketing slogan treatment.

---

# 13. TESTIMONIALS

Present as authentic student experiences, not elaborate invented stories. Themes: a Hadith student who completed the 100 Hadith under Umm Abdillah's tutelage; a long-term student describing growth over time; a student describing gained beneficial knowledge. Use name/initials and category only where supplied; don't fabricate credentials, ages, or locations. If real testimonials aren't yet available, use clearly marked, easily replaceable placeholder content — styled on purpose (see 2.8), not left blank.

---

# 14. LECTURES PAGE

Separate page. Lectures for females, held Fridays/Sundays. Each entry: topic, short description, date placeholder, speaker (Umm Abdillah Ar-Riyaadh), audience (Sisters/Muslimahs), status, access CTA. Topics to include: Purification, Our Responsibilities as Muslims, Homeschooling. Don't invent actual dates.

---

# 15. HOMESCHOOLING SECTION

Separate from Lectures. Personal, educational tone covering: her experience as a mother and teacher, lessons learned, Islamic principles guiding homeschooling, raising children with Islamic values, balancing education and tarbiyah, practical reflections, resources. Present as her experience and perspective — not a universal claim that homeschooling is superior. CTA: "Read More" / "Explore Homeschooling."

Structure for future articles with fields: title, slug, cover image, excerpt, content, date, author, category. Build reusable article cards.

---

# 16. WHY AR RIYAADH ACADEMY

Section on learning values: beneficial knowledge, consistent learning, understanding before practice, learning at different life stages, female-focused environment, Arabic/Qur'an/Hadith education, practical Islamic education, encouragement and perseverance. No unsupported superlative claims ("the best...") unless explicitly supplied.

---

# 17. CONTACT / JOIN

Name, email, phone, message fields. CTAs: "Ask About a Class," "Join a Telegram Class," "Contact the Academy." Use replaceable placeholder contact info — don't invent real details.

---

# 18. FOOTER

Academy name, short description, nav links (Home, About, Classes, Lectures, Homeschooling, Testimonials, Contact), Font Awesome social/contact icons, copyright.

---

# 19. ROUTING

`/`, `/about`, `/classes`, `/lectures`, `/homeschooling`, `/testimonials`, `/contact`. Optional future: `/classes/:id`, `/lectures/:id`, `/homeschooling/:slug`.

---

# 20. COMPONENT ARCHITECTURE

Reusable components: Header, MobileMenu, Hero, SectionHeading, SubjectCard, ClassCard, LectureCard, TestimonialCard, ArticleCard, AboutTeacher, Timeline, CTASection, ContactForm, Footer. No single giant page component.

---

# 21. ANIMATION

Framer Motion, used sparingly and purposefully: hero entrance, image reveal, card/timeline reveal on scroll, mobile menu transition, subtle button hover. Smooth, subtle, respectful — not entertainment-site energy. Respect `prefers-reduced-motion`.

---

# 22. RESPONSIVE & ACCESSIBILITY

Mobile-first. No horizontal scroll, no overlapping sections, no broken images, no unreadable or misaligned Arabic. Semantic HTML, proper heading hierarchy, meaningful alt text, keyboard navigation, visible on-brand focus states, accessible forms, strong contrast, RTL styling for Arabic where appropriate.

---

# 23. BACKEND (after frontend is complete)

MongoDB + Mongoose. Models:

- **Class:** title, category, description, audience, schedule, telegramLink, active, createdAt
- **Lecture:** title, description, topic, date, image, accessLink, createdAt
- **Testimonial:** name, content, category, image, approved, createdAt
- **HomeschoolingArticle:** title, slug, excerpt, content, image, author, publishedAt
- **ContactMessage:** name, email, phone, message, createdAt

Clean REST endpoints for each, with validation, error handling, proper status codes, and clean controller/route structure. Use environment variables for sensitive config. Architecture should allow Umm Abdillah to eventually update classes, lectures, telegram links, testimonials, and articles without a rebuild. Don't invent real Telegram links — keep them configurable per class.

---

# 24. IMAGES

High-quality, tasteful imagery matching Section 8/2.7. Descriptive alt text. No random unrelated stock photos. Structure image sources so placeholders can be swapped for the academy's real photos later. **No AI-generated imagery anywhere on the site** — see 2.7a. This applies with particular importance to the Hijaamah section, where real, accurately representative photography matters for trust and clarity.

---

# 25. CONTENT & RELIGIOUS ACCURACY GUARDRAILS

Do not invent personal details about Umm Abdillah Ar-Riyaadh beyond what's supplied here (age, extra family details, degrees, teachers, other institutions, awards, certifications, student counts, extra years of teaching, unlisted locations or credentials). Do not fabricate Qur'an verses, Hadith, or scholarly statements — use a clearly marked placeholder instead when verified content isn't available.

---

# 26. FINAL EXPERIENCE CHECK

Within a few seconds a visitor should understand: what Ar-Riyaadh Academy is (a female-focused Islamic and Arabic academy), who teaches (Umm Abdillah Ar-Riyaadh), what's taught (Qur'an, Hadith, Tafsir, Arabic, Islamic education), who can join (females of various ages), how to join (class/Telegram access), that there are lectures (including Friday/Sunday sessions), and that there's dedicated homeschooling content.

The final result should read as **a refined, modern Islamic learning academy built specifically for women and girls** — not a generic template, mosque site, blog, or portfolio.

---

# 27. FINAL TESTING

1. Start frontend and backend; fix build/console errors.
2. Test every route and the mobile nav.
3. Test class cards, Telegram CTA placeholders, lecture pages, homeschooling articles, contact form, API requests.
4. Test loading and empty/error states.
5. Test responsive layouts at mobile/tablet/desktop/large breakpoints.
6. Check Arabic typography and RTL rendering.
7. Check image loading and accessibility basics (contrast, focus states, alt text, keyboard nav).
8. Remove unused imports/code. Confirm the design system (Section 2) is applied consistently across every page before calling it done.

**Do not stop after creating the design. Actually build the working website in the current VS Code workspace.**
