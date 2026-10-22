// Seeds the database with the academy's content plus the reference data the
// dashboards need (subjects, admin account, services, service slots).
//
// Run with: npm run seed  (requires MongoDB running + server/.env)
//
// The seed is idempotent for the reference data: content collections are
// cleared and re-inserted, while accounts, subjects, services and slots are
// upserted so re-running never duplicates a login or a booking calendar.
import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import { realpathSync } from 'node:fs'
import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import Class from '../src/models/Class.js'
import Lecture from '../src/models/Lecture.js'
import Testimonial from '../src/models/Testimonial.js'
import Article from '../src/models/HomeschoolingArticle.js'
import Subject from '../src/models/Subject.js'
import User, { hashPassword } from '../src/models/User.js'
import Service from '../src/models/Service.js'
import ServiceSlot from '../src/models/ServiceSlot.js'
import Setting from '../src/models/Setting.js'

// Telegram join links are PLACEHOLDERS. Replace with the academy's real
// Telegram group links per class when they are supplied.
const TELEGRAM_JOIN = 'https://t.me/ArRiyadhAcademy'

const classes = [
  {
    title: 'Qurʼān Recitation & Tajweed',
    category: 'Qurʼān',
    icon: 'book-quran',
    description:
      'Master correct pronunciation, fluency and the rules of Tajweed, building a strong, correct relationship with the Book of Allah.',
    audience: 'Teenage girls • Adult women • Mothers',
    focus: ['Tajwēd foundations', 'Fluency in recitation', 'Consistent daily reading'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM_JOIN,
    slug: 'quran-recitation-tajweed',
    accessType: 'free',
    deliveryMode: 'hybrid',
    priceKobo: 0,
    displayOrder: 1,
  },
  {
    title: 'Fluent Arabic Speaking Class',
    category: 'Arabic Language',
    icon: 'language',
    description:
      'A dedicated spoken Arabic course for practical conversation, helping you express yourself in Arabic with confidence.',
    audience: 'Beginners • Continuing students',
    focus: ['Practical conversation', 'Vocabulary building', 'Simple grammar foundations'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM_JOIN,
    slug: 'fluent-arabic-speaking',
    accessType: 'paid',
    deliveryMode: 'live',
    priceKobo: 1500000,
    capacity: 25,
    displayOrder: 2,
  },
  {
    title: 'Tafseer (Qurʼānic Exegesis)',
    category: 'Tafsir',
    icon: 'book-open',
    description:
      'A guided study of the meaning and context of the Qurʼān, building a personal understanding that goes beyond translation.',
    audience: 'Adult women • Mothers',
    focus: ['Context and meaning', 'Classical commentary', 'Personal reflection'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM_JOIN,
    slug: 'tafseer-quranic-exegesis',
    accessType: 'free',
    deliveryMode: 'recorded',
    priceKobo: 0,
    displayOrder: 3,
  },
  {
    title: 'Hadith Memorization',
    category: 'Hadith',
    icon: 'book-heart',
    description:
      'Memorise the Prophetic narrations with the supporting chains and scholars, building a lasting understanding of the Sunnah.',
    audience: 'Teenage girls • Adult women',
    focus: ['Memorisation plan', 'Supporting scholars', 'Daily revision'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM_JOIN,
    slug: 'hadith-memorization',
    accessType: 'free',
    deliveryMode: 'live',
    priceKobo: 0,
    displayOrder: 4,
  },
  {
    title: 'Islamic Studies & Purification',
    category: 'Islamic Studies',
    icon: 'mosque',
    description:
      'The essentials of Islamic belief and practice: purification, prayer, character and the responsibilities of a Muslim.',
    audience: 'Adult women • Mothers • New learners',
    focus: ['Purification', 'Practising what is learnt', 'Character and manners'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM_JOIN,
    slug: 'islamic-studies-purification',
    accessType: 'free',
    deliveryMode: 'hybrid',
    priceKobo: 0,
    displayOrder: 5,
  },
]

const lectures = [
  {
    title: 'Purification: The Foundation of Worship',
    description: 'Understanding wuḍūʾ, ghusl and tayammum with the relevant evidences.',
    topic: 'Purification',
    tags: ['Purification', 'Worship'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Sisters / Muslimahs',
    status: 'Ongoing',
    accessLink: TELEGRAM_JOIN,
    displayOrder: 1,
  },
  {
    title: 'Our Responsibilities as Muslims',
    description: 'The duties every Muslim carries, and how to keep them in daily life.',
    topic: 'Islamic Studies',
    tags: ['Responsibilities', 'Character'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Sisters / Muslimahs',
    status: 'Upcoming',
    accessLink: TELEGRAM_JOIN,
    displayOrder: 2,
  },
  {
    title: 'Islamic Homeschooling: An Introduction',
    description: 'The principles that guide homeschooling from an Islamic perspective.',
    topic: 'Homeschooling',
    tags: ['Homeschooling', 'Tarbiyah'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Sisters / Muslimahs',
    status: 'Upcoming',
    accessLink: TELEGRAM_JOIN,
    displayOrder: 3,
  },
]

const testimonials = [
  {
    name: 'Aisha',
    category: 'Hadith',
    content:
      'I completed the one hundred hadith with Umm Abdillah. The teaching was patient and clear, and I felt supported at every step.',
    approved: true,
    rating: 5,
    displayOrder: 1,
  },
  {
    name: 'Maryam',
    category: 'Arabic',
    content:
      'The Arabic class changed how I learn. The vocabulary I gained in one term was more than I had managed in a year on my own.',
    approved: true,
    rating: 5,
    displayOrder: 2,
  },
  {
    name: 'Hafso',
    category: 'Islamic Studies',
    content:
      'I have been a student for several years now. What I value most is the consistency and the reminders to keep going.',
    approved: true,
    rating: 5,
    displayOrder: 3,
  },
]

const articles = [
  {
    title: 'Rooted Learning: A Personal Reflection',
    slug: 'rooted-learning-a-personal-reflection',
    excerpt: 'What ten years of seeking knowledge taught me about staying grounded.',
    content:
      'This article will be filled in with the full writing by Umm Abdillah Ar-Riyaadah.',
    author: 'Umm Abdillah Ar-Riyaadah',
    category: 'Reflections',
    publishedAt: new Date(),
  },
  {
    title: 'Balancing Teaching and Raising Children',
    slug: 'balancing-teaching-and-raising-children',
    excerpt:
      'Some honest reflections on the balance between teaching students and raising children, and the lessons learnt along the way.',
    content:
      'This article will be filled in with the full writing by Umm Abdillah Ar-Riyaadah.',
    author: 'Umm Abdillah Ar-Riyaadah',
    category: 'Reflections',
    publishedAt: new Date(),
  },
]

// Reference data used by the dashboards.
const subjects = [
  { name: 'Qurʼān', slug: 'quran', description: 'Recitation, memorisation and Tajwēd.', icon: 'book-quran', displayOrder: 1 },
  { name: 'Hadith', slug: 'hadith', description: 'The narrations of the Prophet ﷺ and their meanings.', icon: 'book-heart', displayOrder: 2 },
  { name: 'Tafsir', slug: 'tafsir', description: 'Understanding the Qurʼān in context.', icon: 'book-open', displayOrder: 3 },
  { name: 'Arabic Language', slug: 'arabic-language', description: 'Lughat al-ʻArabiyyah for practical use.', icon: 'language', displayOrder: 4 },
  { name: 'Islamic Studies', slug: 'islamic-studies', description: 'Belief, worship, character and responsibilities.', icon: 'mosque', displayOrder: 5 },
  { name: 'Hijaamah', slug: 'hijaamah', description: 'Islamic cupping therapy instruction.', icon: 'droplet', displayOrder: 6 },
]

const services = [
  {
    title: 'Hijaamah (Cupping Therapy) Session',
    slug: 'hijaamah-cupping-therapy-session',
    category: 'hijama',
    description:
      'A guided cupping therapy appointment with the Muallima, following the Sunnah. Suitable for women seeking preventative care.',
    durationMinutes: 60,
    priceKobo: 1500000,
    capacityPerSlot: 1,
    requiresHealthForm: true,
    preparationNotes:
      'Hydrate well in the 48 hours before your appointment. Bring a clean towel. Do not arrive on a heavy or full stomach.',
    location: 'Academy, Abuja',
    displayOrder: 1,
    active: true,
  },
  {
    title: 'Islamic Studies Consultation',
    slug: 'islamic-studies-consultation',
    category: 'consultation',
    description: 'A one-to-one session to discuss a study plan, a book, or a question you have been sitting with.',
    durationMinutes: 45,
    priceKobo: 0,
    capacityPerSlot: 1,
    requiresHealthForm: false,
    location: 'Online',
    displayOrder: 2,
    active: true,
  },
]

const settings = [
  { key: 'support_email', value: 'salam@arriyaadh.com', description: 'Address shown on the contact page.' },
  { key: 'telegram_link', value: TELEGRAM_JOIN, description: 'Main Telegram channel link.' },
  { key: 'whatsapp_link', value: '', description: 'WhatsApp contact number.' },
  { key: 'payment_currency', value: 'NGN', description: 'Currency used for all prices.' },
  { key: 'booking_slot_increment_hours', value: 24, description: 'How far ahead booking slots are generated.' },
]

// The admin account. Credentials come from the environment so the password
// never lives in the repository.
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@arriyaadh.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'

async function seed() {
  await connectDB()

  // Content collections are rebuilt from scratch.
  await Promise.all([
    Class.deleteMany({}),
    Lecture.deleteMany({}),
    Testimonial.deleteMany({}),
    Article.deleteMany({}),
  ])
  const c = await Class.insertMany(classes)
  const l = await Lecture.insertMany(lectures)
  const t = await Testimonial.insertMany(testimonials)
  const a = await Article.insertMany(articles)

  // Reference data is upserted so re-running is safe.
  for (const subject of subjects) {
    await Subject.updateOne({ slug: subject.slug }, { $set: subject }, { upsert: true })
  }

  for (const service of services) {
    await Service.updateOne({ slug: service.slug }, { $set: service }, { upsert: true })
  }

  for (const setting of settings) {
    await Setting.updateOne({ key: setting.key }, { $set: setting }, { upsert: true })
  }

  const admin = await User.findOne({ email: ADMIN_EMAIL })
  if (admin) {
    admin.roles = ['admin', 'student']
    await admin.save()
  } else {
    await User.create({
      email: ADMIN_EMAIL,
      name: process.env.SEED_ADMIN_NAME || 'Academy Admin',
      roles: ['admin', 'student'],
      passwordHash: await hashPassword(ADMIN_PASSWORD),
      emailVerified: true,
    })
  }

  // Generate the next two weeks of booking slots for each service.
  const now = new Date()
  for (const service of await Service.find()) {
    const existing = await ServiceSlot.countDocuments({ serviceId: service._id })
    if (existing > 0) continue

    const slots = []
    for (let day = 1; day <= 14; day += 1) {
      const date = new Date(now.getTime() + day * 24 * 60 * 60 * 1000)
      // Only working days.
      if (date.getDay() === 0 || date.getDay() === 6) continue

      for (const hour of [10, 14]) {
        const startsAt = new Date(date)
        startsAt.setHours(hour, 0, 0, 0)
        const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60 * 1000)
        slots.push({
          serviceId: service._id,
          startsAt,
          endsAt,
          capacity: service.capacityPerSlot || 1,
          bookedCount: 0,
          status: 'open',
        })
      }
    }
    if (slots.length) await ServiceSlot.insertMany(slots)
  }

  console.log(`[seed] inserted ${c.length} classes, ${l.length} lectures, ${t.length} testimonials, ${a.length} articles`)
  console.log(`[seed] admin account: ${ADMIN_EMAIL}`)
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log('[seed] WARNING: using the default admin password. Set SEED_ADMIN_PASSWORD before deploying.')
  }
}

// The promise is exported so the seed can be awaited from a test or a script
// as well as being run directly from the command line.
const seeding = seed()

export default seeding

// Only close the connection when this file is the process entry point; when it
// is imported the caller decides when to disconnect.
const isEntryPoint = process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])

if (isEntryPoint) {
  seeding
    .then(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
    .catch(async (err) => {
      console.error('[seed] failed:', err.message)
      await mongoose.disconnect().catch(() => {})
      process.exit(1)
    })
}
