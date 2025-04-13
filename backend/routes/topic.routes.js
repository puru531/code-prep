const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find().populate('course', 'name image').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('course', 'name image');

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }

    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Create new topic
// @route   POST /api/topics
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Check if course exists
    const course = await Course.findById(req.body.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const topic = await Topic.create(req.body);

    res.status(201).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }

    topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }

    // Remove topic from user bookmarks and likes
    await User.updateMany(
      { bookmarks: req.params.id },
      { $pull: { bookmarks: req.params.id } }
    );

    await User.updateMany(
      { likes: req.params.id },
      { $pull: { likes: req.params.id } }
    );

    // Delete the topic
    await topic.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Like a topic
// @route   PUT /api/topics/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }

    // Check if user has already liked this topic
    const user = await User.findById(req.user.id);
    const alreadyLiked = user.likes.includes(req.params.id);

    if (alreadyLiked) {
      // Unlike the topic
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { likes: req.params.id } },
        { new: true }
      );

      topic.likes -= 1;
      await topic.save();

      return res.status(200).json({
        success: true,
        message: 'Topic unliked',
        data: topic
      });
    }

    // Like the topic
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { likes: req.params.id } },
      { new: true }
    );

    topic.likes += 1;
    await topic.save();

    res.status(200).json({
      success: true,
      message: 'Topic liked',
      data: topic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;