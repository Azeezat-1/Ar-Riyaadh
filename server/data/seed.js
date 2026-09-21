// Seeds the database with the academy's current placeholder content.
// Run with: npm run seed  (requires MongoDB running + server/.env)
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import Class from '../src/models/Class.js'
import Lecture from '../src/models/Lecture.js'
import Testimonial from '../src/models/Testimonial.js'
import Article from '../src/models/HomeschoolingArticle.js'

const classes = [
  {
    title: 'Qur\u02bc\u0101n Reading',
    category: 'Qur\u02bc\u0101n',
    icon: 'book-quran',
    description:
      'Build a strong, correct relationship with the Book of Allah, from accurate recitation to consistent engagement with the Qur\u02bc\u0101n.',
    audience: 'Teenage girls \u2022 Adult women \u2022 Mothers',
    focus: ['Tajw\u012bd foundations', 'Fluency in recitation', 'Consistent daily reading'],
    schedule: 'Schedule placeholder, contact to confirm times.',
    telegramLink: '#',
  },
  {
    title: 'Hadith Studies',
    category: 'Hadith',
    icon: 'scroll',
    description:
      'Study authentic Prophetic narrations with accurate meaning, memorisation and practical benefit, a structured journey through selected hadith.',
    audience: 'Women with some prior learning',
    focus: ['The 100 Hadith programme', 'Memorisation with meaning', 'Connecting hadith to practice'],
    schedule: 'Schedule placeholder, contact to confirm times.',
    telegramLink: '#',
  },
  {
    title: 'Tafsir Sessions',
    category: 'Tafsir',
    icon: 'feather-pointed',
    description:
      'Step through the meanings of the Qur\u02bc\u0101n at a measured pace, understanding context and reflection together.',
    audience: 'Adult women \u2022 Mothers',
    focus: ['S\u016bras explained clearly', 'Context and reflection', 'Q&A discussion'],
    schedule: 'Schedule placeholder, contact to confirm times.',
    telegramLink: '#',
  },
  {
    title: 'Arabic (Lughah) Classes',
    category: 'Arabic Language',
    icon: 'language',
    description:
      'Learn Lughat al-\u02bbArabiyyah step by step, building the vocabulary and understanding you need to engage with Arabic texts.',
    audience: 'Beginners \u2022 Continuing students',
    focus: ['Reading and understanding', 'Vocabulary building', 'Simple grammar foundations'],
    schedule: 'Schedule placeholder, contact to confirm times.',
    telegramLink: '#',
  },
  {
    title: 'Islamic Studies & Purification',
    category: 'Islamic Studies',
    icon: 'mosque',
    description:
      'Practical Islamic education covering purification, worship, Muslim responsibilities and character, knowledge meant to be lived.',
    audience: 'Teenagers \u2022 Adult women \u2022 Mothers',
    focus: ['Purification & worship', 'Muslim responsibilities', 'Character and daily conduct'],
    schedule: 'Schedule placeholder, contact to confirm times.',
    telegramLink: '#',
  },
]

const lectures = [
  {
    title: 'Purification in Worship',
    topic: 'Purification',
    description:
      'Lectures addressing purity and purification from an Islamic perspective, understanding the rulings that make worship correct and complete.',
    tags: ['Purification', 'Fiqh', 'Worship'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Sisters / Muslimahs',
    status: 'Ongoing',
    accessLink: '#',
  },
  {
    title: 'Our Responsibilities as Muslims',
    topic: 'Our Responsibilities as Muslims',
    description:
      'Learning about responsibilities, character and conduct as Muslims, what Islam asks of us in our daily lives and relationships.',
    tags: ['Responsibilities', 'Character', 'Conduct'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Sisters / Muslimahs',
    status: 'Ongoing',
    accessLink: '#',
  },
  {
    title: 'Homeschooling from an Islamic Perspective',
    topic: 'Homeschooling',
    description:
      'Islamic perspectives on homeschooling and raising children with Islamic values, combining education, tarbiyah and family life.',
    tags: ['Homeschooling', 'Tarbiyah', 'Family'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Mothers / Muslimahs',
    status: 'Upcoming',
    accessLink: '#',
  },
]

const testimonials = [
  {
    name: 'Student, Hadith Class',
    category: 'Hadith Student',
    content:
      'I learned the 100 Hadith under Umu Abdullah and I am grateful for everything I gained. She explained the meanings clearly and made memorisation meaningful. May Allah reward her.',
    approved: true,
  },
  {
    name: 'Long-term Student',
    category: 'Continuing Student',
    content:
      'Since I came to know Umu Abdullah I have learned so much. Her patience and consistency kept me going when I found studying hard. Masha\u02bcAllah.',
    approved: true,
  },
  {
    name: 'Student of Umu Abdullah',
    category: 'Islamic Studies Student',
    content:
      'Studying under Umu Abdullah has helped me gain beneficial knowledge in a way I can actually use. The environment is calm, respectful and truly for women.',
    approved: true,
  },
]

const articles = [
  {
    title: 'Homeschooling from an Islamic Perspective',
    slug: 'homeschooling-from-an-islamic-perspective',
    excerpt:
      'A personal introduction to homeschooling as a mother and teacher, why families choose it and the Islamic principles that guide it.',
    content:
      'This article will be filled in with the full writing by Umu Abdullah Riyadh. It will share the perspective and experience promised in the introduction, practical, honest reflections on homeschooling from an Islamic viewpoint.',
    author: 'Umu Abdullah Riyadh',
    category: 'Perspectives',
    publishedAt: new Date(),
  },
  {
    title: 'Education and Tarbiyah, Growing Together',
    slug: 'education-and-tarbiyah',
    excerpt:
      'Balancing academic learning with the moral and spiritual upbringing of children, and practical reflections from the journey.',
    content:
      'This article will be filled in with the full writing by Umu Abdullah Riyadh.',
    author: 'Umu Abdullah Riyadh',
    category: 'Reflections',
    publishedAt: new Date(),
  },
  {
    title: 'Learning Together: Balancing Teaching and Motherhood',
    slug: 'balancing-teaching-and-motherhood',
    excerpt:
      'Some honest reflections on the balance between teaching students and raising children, and the lessons learnt along the way.',
    content:
      'This article will be filled in with the full writing by Umu Abdullah Riyadh.',
    author: 'Umu Abdullah Riyadh',
    category: 'Reflections',
    publishedAt: new Date(),
  },
]

async function seed() {
  await connectDB()
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
  console.log(`[seed] inserted ${c.length} classes, ${l.length} lectures, ${t.length} testimonials, ${a.length} articles`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('[seed] failed:', err.message)
  process.exit(1)
})
