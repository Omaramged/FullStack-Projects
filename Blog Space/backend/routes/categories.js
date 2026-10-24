const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Article = require('../models/Article');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const articles = await Article.find({ category: category.name, status: 'published' })
      .populate('author', 'name username avatarUrl')
      .sort({ createdAt: -1 });

    return res.json({ success: true, category, articles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
