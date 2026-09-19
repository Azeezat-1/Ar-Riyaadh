// ============================================================
// AL RIYADH ACADEMY — CONTENT DATA
// ------------------------------------------------------------
// Central place for all display content. Umu Abdullah can
// update classes, lectures, testimonials and articles here
// without touching component code. In Phase 3 these will be
// served from the backend API.
// ------------------------------------------------------------
// Replace all PLACEHOLDER contact details with real ones.
// ============================================================

export const site = {
  name: 'Ar-Riyadh Academy',
  tagline: 'A place for women and girls to seek beneficial Islamic and Arabic knowledge.',
  founder: 'Umu Abdullah Riyadh',
  founderRole: 'Muallima & Teacher',
  email: 'contact@alriyadhacademy.example',
  phone: '+000 000 000 0000',
  socials: {
    telegram: '#', // TODO: real Telegram link
    whatsapp: '#', // TODO: real WhatsApp link
    instagram: '#', // TODO: real Instagram link
    youtube: '#', // TODO: real YouTube link
  },
}

// Development imagery. Replace these URLs with the academy's real
// photography later — components automatically fall back to an
// elegant placeholder if an image cannot load.
export const images = {
  heroPrimary: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
  heroSecondary: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',
  study: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1100&q=80',
  library: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=80',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
  about: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
  arabicProgram: '/images/arabic-90days.jpeg',
  tafsirCircle: '/images/tafsir-circle.svg',
};

export const learnArabic = {
  eyebrow: 'Arabic',
  title: 'Speak Arabic in 90 days',
  lede: 'A structured Arabic-speaking programme for Muslim sisters — steady, practical and tailored to our learners.',
  points: [
    'Speak simple Arabic sentences with confidence',
    'Introduce yourself and others in Arabic',
    'Understand everyday vocabulary and phrases used in class',
  ],
  ctaText: 'Join an Arabic class',
  ctaTo: '/classes',
};

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Classes', to: '/classes' },
  { label: 'Lectures', to: '/lectures' },
  { label: 'Homeschooling', to: '/homeschooling' },
  { label: 'Hijaamah', to: '/hijaamah' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact', to: '/contact' },
];

export const subjects = [
  {
    id: 'quran',
    icon: 'book-quran',
    title: 'Qur\u02bcān',
    description:
      'Understanding, learning and engaging with the Book of Allah — learning to read, recite and connect with its meanings.',
  },
  {
    id: 'hadith',
    icon: 'scroll',
    title: 'Hadith',
    description:
      'Learning authentic Prophetic teachings and how to study the guidance of the Messenger of Allah, peace be upon him.',
  },
  {
    id: 'tafsir',
    icon: 'feather-pointed',
    title: 'Tafsir',
    description:
      'Studying the meanings and explanations of Qur\u02bcānic verses in a clear, structured and beneficial way.',
  },
  {
    id: 'arabic',
    icon: 'language',
    title: 'Arabic Language',
    description:
      'Learning Lughat al-\u02bbArabiyyah and developing Arabic language skills to understand the Qur\u02bcān and the religion.',
  },
  {
    id: 'islamic-education',
    icon: 'mosque',
    title: 'Islamic Education',
    description:
      'Building understanding of Islamic responsibilities, worship, purification and character as a Muslimah.',
  },
  {
    id: 'lectures',
    icon: 'microphone-lines',
    title: 'Lectures',
    description:
      'Special sessions addressing practical and relevant topics for Muslim women — faith, family and everyday life.',
  },
];

export const classes = [
  {
    id: 'quran-class',
    category: 'Qur\u02bcān',
    icon: 'book-quran',
    title: 'Qur\u02bcān Reading',
    audience: 'Teenage girls \u2022 Adult women \u2022 Mothers',
    description:
      'Build a strong, correct relationship with the Book of Allah — from accurate recitation to consistent engagement with the Qur\u02bcān.',
    focus: ['Tajwīd foundations', 'Fluency in recitation', 'Consistent daily reading'],
    schedule: 'Schedule placeholder — contact to confirm times.',
    telegramLink: '#',
  },
  {
    id: 'hadith-class',
    category: 'Hadith',
    icon: 'scroll',
    title: 'Hadith Studies',
    audience: 'Women with some prior learning',
    description:
      'Study authentic Prophetic narrations with accurate meaning, memorisation and practical benefit — a structured journey through selected hadith.',
    focus: ['The 100 Hadith programme', 'Memorisation with meaning', 'Connecting hadith to practice'],
    schedule: 'Schedule placeholder — contact to confirm times.',
    telegramLink: '#',
  },
  {
    id: 'tafsir-class',
    category: 'Tafsir',
    icon: 'feather-pointed',
    title: 'Tafsir Sessions',
    audience: 'Adult women \u2022 Mothers',
    description:
      'Step through the meanings of the Qur\u02bcān at a measured pace, understanding context and reflection together.',
    focus: ['S\u016bras explained clearly', 'Context and reflection', 'Q&A discussion'],
    schedule: 'Schedule placeholder — contact to confirm times.',
    telegramLink: '#',
  },
  {
    id: 'arabic-class',
    category: 'Arabic Language',
    icon: 'language',
    title: 'Arabic (Lughah) Classes',
    audience: 'Beginners \u2022 Continuing students',
    description:
      'Learn Lughat al-\u02bbArabiyyah step by step — building the vocabulary and understanding you need to engage with Arabic texts.',
    focus: ['Reading and understanding', 'Vocabulary building', 'Simple grammar foundations'],
    schedule: 'Schedule placeholder — contact to confirm times.',
    telegramLink: '#',
  },
  {
    id: 'islamic-studies-class',
    category: 'Islamic Studies',
    icon: 'mosque',
    title: 'Islamic Studies & Purification',
    audience: 'Teenagers \u2022 Adult women \u2022 Mothers',
    description:
      'Practical Islamic education covering purification, worship, Muslim responsibilities and character — knowledge meant to be lived.',
    focus: ['Purification & worship', 'Muslim responsibilities', 'Character and daily conduct'],
    schedule: 'Schedule placeholder — contact to confirm times.',
    telegramLink: '#',
  },
];

export const classCategories = [
  { label: 'All', value: 'all' },
  { label: 'Qur\u02bcān', value: 'Qur\u02bcān' },
  { label: 'Hadith', value: 'Hadith' },
  { label: 'Tafsir', value: 'Tafsir' },
  { label: 'Arabic Language', value: 'Arabic Language' },
  { label: 'Islamic Studies', value: 'Islamic Studies' },
];

export const lectures = [
  {
    id: 'purification',
    topic: 'Purification',
    title: 'Purification in Worship',
    excerpt:
      'Lectures addressing purity and purification from an Islamic perspective — understanding the rulings that make worship correct and complete.',
    tags: ['Purification', 'Fiqh', 'Worship'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Sisters / Muslimahs',
    status: 'Ongoing',
    accessLink: '#',
  },
  {
    id: 'responsibilities',
    topic: 'Our Responsibilities as Muslims',
    title: 'Our Responsibilities as Muslims',
    excerpt:
      'Learning about responsibilities, character and conduct as Muslims — what Islam asks of us in our daily lives and relationships.',
    tags: ['Responsibilities', 'Character', 'Conduct'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Sisters / Muslimahs',
    status: 'Ongoing',
    accessLink: '#',
  },
  {
    id: 'homeschooling-lecture',
    topic: 'Homeschooling',
    title: 'Homeschooling from an Islamic Perspective',
    excerpt:
      'Islamic perspectives on homeschooling and raising children with Islamic values — combining education, tarbiyah and family life.',
    tags: ['Homeschooling', 'Tarbiyah', 'Family'],
    schedule: 'Friday / Sunday sessions',
    audience: 'Mothers / Muslimahs',
    status: 'Upcoming',
    accessLink: '#',
  },
];

export const testimonials = [
  {
    id: 't1',
    name: 'Student — Hadith Class',
    category: 'Hadith Student',
    quote:
      'I learned the 100 Hadith under Umu Abdullah and I am grateful for everything I gained. She explained the meanings clearly and made memorisation meaningful. May Allah reward her.',
    placeholder: true,
  },
  {
    id: 't2',
    name: 'Long-term Student',
    category: 'Continuing Student',
    quote:
      'Since I came to know Umu Abdullah I have learned so much. Her patience and consistency kept me going when I found studying hard. Masha\u02bcAllah.',
    placeholder: true,
  },
  {
    id: 't3',
    name: 'Student of Umu Abdullah',
    category: 'Islamic Studies Student',
    quote:
      'Studying under Umu Abdullah has helped me gain beneficial knowledge in a way I can actually use. The environment is calm, respectful and truly for women.',
    placeholder: true,
  },
];

export const homeschoolArticles = [
  {
    slug: 'homeschooling-from-an-islamic-perspective',
    title: 'Homeschooling from an Islamic Perspective',
    excerpt:
      'A personal introduction to homeschooling as a mother and teacher — why families choose it and the Islamic principles that guide it.',
    category: 'Perspectives',
    author: 'Umu Abdullah Riyadh',
    publishedAt: 'Placeholder date',
    cover: '' /* TODO: cover image */,
  },
  {
    slug: 'education-and-tarbiyah',
    title: 'Education and Tarbiyah — Growing Together',
    excerpt:
      'Balancing academic learning with the moral and spiritual upbringing of children, and practical reflections from the journey.',
    category: 'Reflections',
    author: 'Umu Abdullah Riyadh',
    publishedAt: 'Placeholder date',
    cover: '' /* TODO: cover image */,
  },
  {
    slug: 'balancing-teaching-and-motherhood',
    title: 'Learning Together: Balancing Teaching and Motherhood',
    excerpt:
      'Some honest reflections on the balance between teaching students and raising children, and the lessons learnt along the way.',
    category: 'Reflections',
    author: 'Umu Abdullah Riyadh',
    publishedAt: 'Placeholder date',
    cover: '' /* TODO: cover image */,
  },
];

export const values = [
  {
    icon: 'book-open',
    title: 'Beneficial Knowledge',
    description:
      'Learning that is sound in source, clear in meaning and practical in daily life — knowledge that moves the heart and improves the practice.',
  },
  {
    icon: 'arrow-trend-up',
    title: 'Consistent Learning',
    description:
      'Small steps taken consistently. We encourage steady, patient progress over haste, whatever stage of life a student is at.',
  },
  {
    icon: 'scale-balanced',
    title: 'Understanding Before Practice',
    description:
      'We learn meanings before actions — so that worship and conduct are built on understanding, not blind imitation.',
  },
  {
    icon: 'people-group',
    title: 'Female-Focused Environment',
    description:
      'A calm, respectful learning space designed specifically for women and girls across different stages of life.',
  },
  {
    icon: 'play-circle',
    title: 'Arabic Education',
    description:
      'Building real Arabic language skills so students can engage with the Qur\u02bcān and Islamic texts directly.',
  },
  {
    icon: 'person-chalkboard',
    title: 'Encouragement & Perseverance',
    description:
      'Every student is supported to keep going — even when the journey is difficult or life gets busy.',
  },
];

export const timeline = [
  {
    phase: 'Beginning',
    title: 'Beginning the Journey',
    description:
      'The beginning of her journey as a student of knowledge, seeking to learn the religion is a heartfelt and humble start. She studied at Madrasa Sunnah wal Jama\u02bbah, Iwo, Osun State.',
  },
  {
    phase: 'Learning',
    title: 'Years of Learning',
    description:
      'Years of studying Islamic knowledge and Arabic — growing step by step through the Qur\u02bcān, hadith, and the language of the religion.',
  },
  {
    phase: 'Perseverance',
    title: 'Perseverance',
    description:
      'Continuing despite challenges and difficulties, holding firmly to the path of seeking knowledge even when the going was not easy.',
  },
  {
    phase: 'Teaching',
    title: 'Beginning to Teach',
    description:
      'Starting to share the beneficial knowledge she had gained with other women and girls, teaching what she had learnt and loved.',
  },
  {
    phase: 'Academy',
    title: 'Ar-Riyadh Academy',
    description:
      'Creating a learning environment where female students can continue their own journey — a place for women and girls to seek beneficial Islamic and Arabic knowledge.',
  },
];

// ------------------------------------------------------------
// BOOKS WRITTEN BY UMU ABDULLAH RIYADH
// Taken from her Facebook page (facebook.com/lateefat.o.yusuff).
// Add each book she has written here. Example fields:
//   { title, description, cover, category, link }
// Leave `cover` empty until real book images are available.
// ------------------------------------------------------------
export const books = [
  // {
  //   title: 'Sample Book Title',
  //   description: 'A short description of the book.',
  //   category: 'Islamic Studies',
  //   cover: '',
  //   link: '#',
  // },
];

// ------------------------------------------------------------
// HIJAMAH (cupping therapy) — Umu Abdullah Riyadh practises and
// teaches hijaamah using needles and hijaamah cups.
// ------------------------------------------------------------
export const hijama = {
  title: 'Hijaamah',
  tagline: 'Acupuncture & cupping therapy, practised and taught with care',
  intro:
    'Umu Abdullah Riyadh practises acupuncture and cupping (hijaamah) for sisters and trains students in these methods — using acupuncture needles and cupping cups, with care and the discipline the practice requires.',
  services: [
    {
      icon: 'droplet',
      title: 'Cupping (Hijaamah) Sessions',
      description:
        'Cupping therapy for sisters, performed carefully and hygienically using cupping cups.',
    },
    {
      icon: 'syringe',
      title: 'Acupuncture',
      description:
        'Acupuncture using fine, sterile needles, applied correctly and with complete care for each sister.',
    },
    {
      icon: 'graduation-cap',
      title: 'Training Students',
      description:
        'Students are trained in both acupuncture and cupping — the knowledge, the methods, the instruments and the discipline they require.',
    },
    {
      icon: 'shield-halved',
      title: 'Done With Care',
      description:
        'Every session is conducted with attention to safety, hygiene and the privacy of the sister — in a calm and trustworthy environment.',
    },
  ],
  howItWorks: [
    'Book an appointment with the academy — cupping or acupuncture.',
    'A sister-only session, conducted in a clean and private setting.',
    'Practical training is also available for sisters who wish to learn.',
  ],
  note:
    'Hijaamah is a practice encouraged in the Sunnah. This page will be updated with verified details and appointment information.',
  ctaText: 'Enquire About Hijaamah',
};