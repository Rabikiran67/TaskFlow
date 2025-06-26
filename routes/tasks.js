const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   POST /api/tasks
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/tasks
router.get('/', auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};
    if (req.query.completed) { match.completed = req.query.completed === 'true'; }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    await req.user.populate({ path: 'tasks', match, options: { sort } });
    res.json(req.user.tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) { return res.status(404).json({ message: 'Task not found' }); }
    Object.keys(req.body).forEach((key) => (task[key] = req.body[key]));
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) { return res.status(404).json({ message: 'Task not found' }); }
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;