const express = require('express');
const Sweet = require('../models/Sweet');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Create a sweet (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || price == null || quantity == null) return res.status(400).json({ message: 'Missing fields' });
    const existing = await Sweet.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Sweet already exists' });
    const sweet = await Sweet.create({ name, category, price, quantity });
    res.status(201).json(sweet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all sweets
router.get('/', verifyToken, async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search sweets by query params
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    const sweets = await Sweet.find(filter);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update sweet
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete sweet (admin only)
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const removed = await Sweet.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Purchase sweet (decrease quantity)
router.post('/:id/purchase', verifyToken, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    if (sweet.quantity <= 0) return res.status(400).json({ message: 'Out of stock' });
    sweet.quantity -= 1;
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Restock sweet (admin only)
router.post('/:id/restock', verifyToken, adminOnly, async (req, res) => {
  try {
    const { amount } = req.body;
    const inc = Number(amount) || 0;
    if (inc <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Not found' });
    sweet.quantity += inc;
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
