const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');

function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') + '-' + Date.now();
}

// GET all published articles
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, sort } = req.query;
    let query = { status: 'published' };

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'views') sortOption = { views: -1 };
    if (sort === 'likes') sortOption = { likesCount: -1 };

    const articles = await Article.find(query)
      .populate('author', 'name username avatarUrl')
      .sort(sortOption);

    return res.json({ success: true, count: articles.length, articles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET featured articles (top by views or likes)
router.get('/featured', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('author', 'name username avatarUrl')
      .sort({ views: -1, createdAt: -1 })
      .limit(3);

    return res.json({ success: true, articles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET user's own articles (drafts + published)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, articles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET single article by slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'name username bio avatarUrl');

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    article.views += 1;
    await article.save();

    return res.json({ success: true, article });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST create article
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, coverImageUrl, category, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const slug = createSlug(title);
    const readingTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    const article = new Article({
      title,
      slug,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content,
      coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      author: req.user.id,
      category: category || 'Technology',
      tags: tags || [],
      status: status || 'published',
      readingTime
    });

    await article.save();
    return res.status(201).json({ success: true, article });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update article
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this article' });
    }

    const { title, excerpt, content, coverImageUrl, category, tags, status } = req.body;
    if (title) article.title = title;
    if (excerpt) article.excerpt = excerpt;
    if (content) {
      article.content = content;
      article.readingTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
    }
    if (coverImageUrl) article.coverImageUrl = coverImageUrl;
    if (category) article.category = category;
    if (tags) article.tags = tags;
    if (status) article.status = status;

    await article.save();
    return res.json({ success: true, article });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE article
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
    }

    await Article.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ article: req.params.id });
    await Like.deleteMany({ article: req.params.id });
    await Bookmark.deleteMany({ article: req.params.id });

    return res.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET comments for an article
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.id })
      .populate('author', 'name username avatarUrl')
      .sort({ createdAt: -1 });

    return res.json({ success: true, comments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST comment
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Comment content is required' });

    const comment = new Comment({
      article: req.params.id,
      author: req.user.id,
      content
    });

    await comment.save();
    await comment.populate('author', 'name username avatarUrl');

    return res.status(201).json({ success: true, comment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT like an article
router.put('/:id/like', authMiddleware, async (req, res) => {
  try {
    const existing = await Like.findOne({ article: req.params.id, user: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already liked' });
    }

    await Like.create({ article: req.params.id, user: req.user.id });
    const count = await Like.countDocuments({ article: req.params.id });
    await Article.findByIdAndUpdate(req.params.id, { likesCount: count });

    return res.json({ success: true, liked: true, likesCount: count });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE unlike an article
router.delete('/:id/like', authMiddleware, async (req, res) => {
  try {
    await Like.findOneAndDelete({ article: req.params.id, user: req.user.id });
    const count = await Like.countDocuments({ article: req.params.id });
    await Article.findByIdAndUpdate(req.params.id, { likesCount: count });

    return res.json({ success: true, liked: false, likesCount: count });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET user like status for article
router.get('/:id/like-status', authMiddleware, async (req, res) => {
  try {
    const like = await Like.findOne({ article: req.params.id, user: req.user.id });
    const isBookmarked = await Bookmark.findOne({ article: req.params.id, user: req.user.id });
    return res.json({
      success: true,
      liked: !!like,
      bookmarked: !!isBookmarked
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT bookmark an article
router.put('/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    const existing = await Bookmark.findOne({ article: req.params.id, user: req.user.id });
    if (!existing) {
      await Bookmark.create({ article: req.params.id, user: req.user.id });
    }
    return res.json({ success: true, bookmarked: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE bookmark
router.delete('/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ article: req.params.id, user: req.user.id });
    return res.json({ success: true, bookmarked: false });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
