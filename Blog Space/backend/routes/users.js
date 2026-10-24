const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/auth');

// GET public user profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET published articles by author
router.get('/:username/articles', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const articles = await Article.find({ author: user._id, status: 'published' })
      .populate('author', 'name username avatarUrl')
      .sort({ createdAt: -1 });

    return res.json({ success: true, articles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update own profile
router.patch('/me', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET own bookmarks
router.get('/me/bookmarks', authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate({
        path: 'article',
        populate: { path: 'author', select: 'name username avatarUrl' }
      })
      .sort({ createdAt: -1 });

    const articles = bookmarks.map(b => b.article).filter(Boolean);
    return res.json({ success: true, articles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET dashboard statistics
router.get('/me/stats', authMiddleware, async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user.id });
    const publishedCount = articles.filter(a => a.status === 'published').length;
    const draftCount = articles.filter(a => a.status === 'draft').length;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalLikes = articles.reduce((sum, a) => sum + (a.likesCount || 0), 0);

    return res.json({
      success: true,
      stats: {
        publishedCount,
        draftCount,
        totalViews,
        totalLikes
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
