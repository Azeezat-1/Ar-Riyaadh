// ============================================================
// AR RIYAADH ACADEMY (UMM ABDILLAH AR-RIYADH ACADEMY), CONTENT
// ------------------------------------------------------------
// Central place for all display content. Umm Abdillah Ar-Riyaadh
// can update classes, lectures, testimonials and articles here
// without touching component code. In Phase 3 these will be
// served from the backend API.
// ------------------------------------------------------------
// PLACEHOLDER INFO: replace every `t.me/your-...` Class link and
// the `#` social links with the academy's real links.
// ============================================================

export const WHATSAPP_NUMBER = '2348106882041'
export const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`
export const waLink = (message = '') =>
  message ? `${WA_BASE}?text=${encodeURIComponent(message)}` : WA_BASE

// Telegram join path for classes. Replace `link` on each class with
// the academy's real Telegram group/channel link when available.
export const TELEGRAM = {
  base: 'https://t.me/',
  join: 'https://t.me/ArRiyadhAcademy', // TODO: real academy Telegram channel
  note: 'Links are placeholders until the academy supplies its Telegram join links.',
}

export const site = {
  name: 'Ar-Riyaadh Academy',
  fullName: 'Umm Abdillah Ar-Riyaadh Academy',
  motto: 'Rooted Learning, Lasting Impact.',
  tagline: 'A female-focused academy for structured Islamic and Arabic learning.',
  founder: 'Umm Abdillah Ar-Riyaadh',
  founderRole: 'Muallima & Student of Knowledge',
  email: 'contact@alriyadhacademy.example',
  phone: '+234 81 0688 2041',
  socials: {
    telegram: TELEGRAM.join, // TODO: real Telegram link
    whatsapp: WA_BASE,
    instagram: '#', // TODO: real Instagram link
    youtube: '#', // TODO: real YouTube link
  },
}

// Development imagery. Replace these URLs with the academy's real
// photography later, components automatically fall back to an
// elegant placeholder if an image cannot load.
export const images = {
  heroBackground: '/images/knowledge-light.jpeg',
  study: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1100&q=80',
  library: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=80',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80',
  about: '/images/about-umm-abdillah.jpg',
  arabicProgram: '/images/arabic-90days.jpeg',
  hadithImage: '/images/journey-to-hadith.jpeg',
};

export const learnArabic = {
  eyebrow: 'Arabic',
  title: 'Speak Arabic in 90 days',
  lede: 'A structured Arabic-speaking programme for Muslim sisters, steady, practical and tailored to our learners.',
  points: [
    'Speak simple Arabic sentences with confidence',
    'Introduce yourself and others in Arabic',
    'Understand everyday vocabulary and phrases used in class',
  ],
  ctaText: 'Join an Arabic class',
  ctaTo: '/classes',
};

export const aboutIntro = {
  eyebrow: 'About Umm Abdillah Ar-Riyaadh',
  title: 'A teacher devoted to authentic knowledge',
  lede: 'From her student days to guiding others today, she teaches the Qur\u02bcān, fluent Arabic, Tafseer, Hadith and prophetic Hijaamah therapy with sincerity.',
  paragraphs: [
    'Her dedication to seeking authentic knowledge of the Deen began years ago as a student, striving through struggle and ease for a sound understanding of Islam and its sciences.',
    'Today, as an accomplished teacher, she dedicates her life to guiding students in reading the Qur\u02bcān, mastering fluent Arabic speech, memorizing Hadith, understanding Tafseer and practising prophetic Hijaamah therapy.',
    'Every lesson at Ar-Riyaadh Academy reflects her patience, her care and her sincere desire to see each student grow.',
  ],
  badges: [
    { icon: 'shield-halved', title: 'Authentic Methodology' },
    { icon: 'user-check', title: 'Interactive Live & Self-Paced Classes' },
    { icon: 'spa', title: 'Holistic Sunnah Healing (Hijaamah)' },
  ],
  ctaText: 'Read Her Full Story',
};

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Classes', to: '/classes' },
  { label: 'Hijaamah', to: '/hijaamah' },
  { label: 'Lectures', to: '/lectures' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Contact', to: '/contact' },
];

export const subjects = [
  {
    id: 'quran',
    icon: 'book-quran',
    title: 'Qur\u02bcān',
    description:
      'Understanding, learning and engaging with the Book of Allah, learning to read, recite and connect with its meanings.',
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
      'Special sessions addressing practical and relevant topics for Muslim women, faith, family and everyday life.',
  },
];

// Each class points at a Telegram join link. Replace `TELEGRAM.join`
// (or the per-class `link`) with the academy's real Telegram links.
export const classes = [
  {
    id: 'quran-class',
    category: 'Qur\u02bcān',
    icon: 'book-quran',
    title: 'Qur\u02bcān Recitation & Tajweed',
    audience: 'Teenage girls \u2022 Adult women \u2022 Mothers',
    description:
      'Master correct pronunciation, fluency and the rules of Tajweed, building a strong, correct relationship with the Book of Allah.',
    focus: ['Tajwīd foundations', 'Fluency in recitation', 'Consistent daily reading'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM.join,
  },
  {
    id: 'arabic-class',
    category: 'Arabic Language',
    icon: 'language',
    title: 'Fluent Arabic Speaking Class',
    audience: 'Beginners \u2022 Continuing students',
    description:
      'A dedicated spoken Arabic course for practical conversation, helping you express yourself in Arabic with confidence.',
    focus: ['Practical conversation', 'Vocabulary building', 'Simple grammar foundations'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM.join,
  },
  {
    id: 'tafsir-class',
    category: 'Tafsir',
    icon: 'feather-pointed',
    title: 'Tafseer (Qur\u02bcānic Exegesis)',
    audience: 'Adult women \u2022 Mothers',
    description:
      'Deepen your understanding of the Qur\u02bcān, its meanings, context and reflection, at a measured and structured pace.',
    focus: ['S\u016bras explained clearly', 'Context and reflection', 'Q&A discussion'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM.join,
  },
  {
    id: 'hadith-class',
    category: 'Hadith',
    icon: 'scroll',
    title: 'Hadith Memorization',
    audience: 'Women with some prior learning',
    description:
      'Memorize and understand authentic Prophetic traditions with structured guidance, making the Sunnah meaningful and practical.',
    focus: ['The 100 Hadith programme', 'Memorisation with meaning', 'Connecting hadith to practice'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM.join,
  },
  {
    id: 'islamic-studies-class',
    category: 'Islamic Studies',
    icon: 'mosque',
    title: 'Islamic Studies & Purification',
    audience: 'Teenagers \u2022 Adult women \u2022 Mothers',
    description:
      'Practical Islamic education covering purification, worship, Muslim responsibilities and character, knowledge meant to be lived.',
    focus: ['Purification & worship', 'Muslim responsibilities', 'Character and daily conduct'],
    schedule: 'Live and self-paced options available.',
    link: TELEGRAM.join,
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
      'Lectures addressing purity and purification from an Islamic perspective, understanding the rulings that make worship correct and complete.',
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
      'Learning about responsibilities, character and conduct as Muslims, what Islam asks of us in our daily lives and relationships.',
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
      'Islamic perspectives on homeschooling and raising children with Islamic values, combining education, tarbiyah and family life.',
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
    name: "A'isha",
    category: 'Hadith Student',
    quote:
      'I learned the 100 Hadith under Umm Abdillah Ar-Riyaadh and I am grateful for everything I gained. She explained the meanings clearly and made memorisation meaningful. May Allah reward her.',
    placeholder: true,
  },
  {
    id: 't2',
    name: 'Umm Kaamil',
    category: 'Continuing Student',
    quote:
      'Since I came to know Umm Abdillah Ar-Riyaadh I have learned so much. Her patience and consistency kept me going when I found studying hard. Masha\u02bcAllah.',
    placeholder: true,
  },
  {
    id: 't3',
    name: 'Umm Aatikah',
    category: 'Islamic Studies Student',
    quote:
      'Studying under Umm Abdillah Ar-Riyaadh has helped me gain beneficial knowledge in a way I can actually use. The environment is calm, respectful and truly for women.',
    placeholder: true,
  },
];

export const homeschoolArticles = [
  {
    slug: 'homeschooling-from-an-islamic-perspective',
    title: 'Homeschooling from an Islamic Perspective',
    excerpt:
      'A personal introduction to homeschooling as a mother and teacher, why families choose it and the Islamic principles that guide it.',
    category: 'Perspectives',
    author: 'Umm Abdillah Ar-Riyaadh',
    publishedAt: 'Placeholder date',
    cover: '' /* TODO: cover image */,
  },
  {
    slug: 'education-and-tarbiyah',
    title: 'Education and Tarbiyah, Growing Together',
    excerpt:
      'Balancing academic learning with the moral and spiritual upbringing of children, and practical reflections from the journey.',
    category: 'Reflections',
    author: 'Umm Abdillah Ar-Riyaadh',
    publishedAt: 'Placeholder date',
    cover: '' /* TODO: cover image */,
  },
  {
    slug: 'balancing-teaching-and-motherhood',
    title: 'Learning Together: Balancing Teaching and Motherhood',
    excerpt:
      'Some honest reflections on the balance between teaching students and raising children, and the lessons learnt along the way.',
    category: 'Reflections',
    author: 'Umm Abdillah Ar-Riyaadh',
    publishedAt: 'Placeholder date',
    cover: '' /* TODO: cover image */,
  },
];

export const values = [
  {
    icon: 'book-open',
    title: 'Beneficial Knowledge',
    description:
      'Learning that is sound in source, clear in meaning and practical in daily life, knowledge that moves the heart and improves the practice.',
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
      'We learn meanings before actions, so that worship and conduct are built on understanding, not blind imitation.',
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
      'Every student is supported to keep going, even when the journey is difficult or life gets busy.',
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
      'Years of studying Islamic knowledge and Arabic, growing step by step through the Qur\u02bcān, hadith, and the language of the religion.',
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
    title: 'Ar-Riyaadh Academy',
    description:
      'Creating a learning environment where female students can continue their own journey, a place for women and girls to seek beneficial Islamic and Arabic knowledge.',
  },
];

// ------------------------------------------------------------
// BOOKS WRITTEN BY UMM ABDILLAH AR-RIYAADAH
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
// HIJAMAH (cupping therapy), Umm Abdillah Ar-Riyaadh practises and
// teaches hijaamah using needles and hijaamah cups.
// ------------------------------------------------------------
export const hijama = {
  image: '/images/hijama-cupping.jpg',
  detailImage: '/images/hijaamah-cupping-detail.png',
  title: 'Hijaamah',
  tagline: 'Sunnah cupping therapy, practised and taught with care',
  intro:
    'Umm Abdillah Ar-Riyaadh practises prophetic Hijaamah (cupping) therapy for sisters, offering holistic wellness through gentle detoxification, improved circulation and therapeutic relief, performed carefully and hygienically.',
  services: [
    {
      icon: 'droplet',
      title: 'Cupping (Hijaamah) Sessions',
      description:
        'Sunnah cupping therapy for sisters, performed carefully and hygienically using cupping cups.',
    },
    {
      icon: 'hand-holding-heart',
      title: 'Holistic Wellness Relief',
      description:
        'Gentle detoxification and therapeutic relief, helping ease tension and support natural healing.',
    },
    {
      icon: 'graduation-cap',
      title: 'Training Students',
      description:
        'Students are trained in cupping, the knowledge, the methods, the instruments and the discipline they require.',
    },
    {
      icon: 'shield-halved',
      title: 'Done With Care',
      description:
        'Every session is conducted with attention to safety, hygiene and privacy, in a calm and trustworthy environment.',
    },
  ],
  howItWorks: [
    'Book an appointment with the academy for a cupping session.',
    'A sisters-only session, conducted in a clean and private setting.',
    'Practical training is also available for sisters who wish to learn.',
  ],
  note:
    'Hijaamah is a Sunnah practice encouraged by the Messenger of Allah, peace be upon him. Sessions are arranged directly with the academy for privacy.',
  ctaText: 'Book a Hijaamah Session',
  bookLink: '/contact',
};