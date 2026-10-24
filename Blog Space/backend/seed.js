const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Article = require('./models/Article');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogspace';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Article.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await User.create({
      name: 'Elena Vance',
      username: 'elena',
      email: 'elena@example.com',
      password: passwordHash,
      bio: 'Design lead & writer exploring interface aesthetics and modern web design.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Marcus Chen',
      username: 'marcus',
      email: 'marcus@example.com',
      password: passwordHash,
      bio: 'Software engineer building web systems and distributed backend services.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'user'
    });

    const categories = await Category.insertMany([
      { name: 'Technology', slug: 'technology', description: 'Insights on the modern tech landscape' },
      { name: 'Design', slug: 'design', description: 'Crafting thoughtful digital interfaces' },
      { name: 'Engineering', slug: 'engineering', description: 'Practical software development principles' },
      { name: 'Productivity', slug: 'productivity', description: 'Habits and workflows for deep work' },
      { name: 'Culture', slug: 'culture', description: 'Thoughts on digital society and creativity' }
    ]);

    await Article.insertMany([
      {
        title: 'The Art of Editorial Web Interfaces',
        slug: 'the-art-of-editorial-web-interfaces',
        excerpt: 'Why modern digital publications are turning back to classical typography and thoughtful pacing.',
        content: `Editorial design isn't just about pretty fonts—it's about creating an atmosphere where words take center stage. When we read long-form essays online, excessive animations and visual clutter get in the way.

### Typographic Rhythm
A good reading experience relies on rhythm:
1. Generous margins and line heights.
2. High-contrast, legible serif or neutral sans-serif typography.
3. Natural breaks with quotes and subtle dividers.

By keeping layouts grounded and clean, we allow readers to immerse themselves in ideas rather than UI distractions.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
        author: user1._id,
        category: 'Design',
        tags: ['Design', 'Typography', 'UI'],
        status: 'published',
        readingTime: 4,
        views: 240,
        likesCount: 18
      },
      {
        title: 'Building Predictable Full-Stack Systems with Next.js & Express',
        slug: 'building-predictable-full-stack-systems',
        excerpt: 'Exploring how keeping frontend and backend decoupled leads to clearer boundaries and simpler mental models.',
        content: `Many full-stack setups suffer from overcomplicating things too soon. Keeping an Express backend decoupled from your Next.js application gives you distinct boundaries and straightforward REST endpoints.

### Key Benefits
- **Clear separation of concerns:** Backend owns data models, rules, and DB transactions.
- **Simpler debugging:** Frontend bugs stay in the browser, API issues stay in Express logs.
- **Zero lock-in:** You can swap the client or server without rewriting everything.

Simplicity is the real prerequisite for reliability.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        author: user2._id,
        category: 'Engineering',
        tags: ['Nextjs', 'Express', 'Nodejs'],
        status: 'published',
        readingTime: 5,
        views: 412,
        likesCount: 34
      },
      {
        title: 'Designing for Deep Focus in an Age of Notification Fatigue',
        slug: 'designing-for-deep-focus',
        excerpt: 'How we can build software tools that respect human attention rather than constantly demanding it.',
        content: `Digital tools should empower our thinking, not fragment it. As builders, we often optimize for engagement metrics when we should be designing for calmness.

### Calm Design Principles
- Notify only when strictly necessary.
- Reduce visual urgency (drop aggressive red badges).
- Allow users to finish their sessions in peace.

When tools respect cognitive load, users feel energized rather than drained.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
        author: user1._id,
        category: 'Productivity',
        tags: ['Productivity', 'Mindset', 'Focus'],
        status: 'published',
        readingTime: 3,
        views: 185,
        likesCount: 12
      },
      {
        title: 'Mastering MongoDB Indexes for Everyday Queries',
        slug: 'mastering-mongodb-indexes',
        excerpt: 'A practical guide to compound indexes, sorting strategies, and avoiding unintentional collection scans.',
        content: `Indexes in MongoDB are simple once you understand the ESR rule: Equality, Sort, Range.

### Understanding ESR
- **Equality:** Put exact match fields first (like status or authorId).
- **Sort:** Put sorting criteria next.
- **Range:** Put range operators (like date ranges or comparisons) last.

Even for smaller applications, a single compound index can turn a sluggish 500ms query into a 4ms lightning-fast fetch.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
        author: user2._id,
        category: 'Technology',
        tags: ['MongoDB', 'Database', 'Backend'],
        status: 'published',
        readingTime: 6,
        views: 310,
        likesCount: 29
      }
    ]);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
