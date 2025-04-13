const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Topic = require('../models/Topic');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: { path: 'course', select: 'name image' }
    });

    res.status(200).json({
      success: true,
      count: user.bookmarks.length,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Bookmark a topic
// @route   PUT /api/users/bookmarks/:id
// @access  Private
router.put('/bookmarks/:id', protect, async (req, res) => {
  try {
    // Check if topic exists
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }

    // Check if topic is already bookmarked
    const user = await User.findById(req.user.id);
    const isBookmarked = user.bookmarks.includes(req.params.id);

    if (isBookmarked) {
      // Remove bookmark
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { bookmarks: req.params.id } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Bookmark removed',
        data: updatedUser.bookmarks
      });
    }

    // Add bookmark
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { bookmarks: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Topic bookmarked',
      data: updatedUser.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get user liked topics
// @route   GET /api/users/likes
// @access  Private
router.get('/likes', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'likes',
      populate: { path: 'course', select: 'name image' }
    });

    res.status(200).json({
      success: true,
      count: user.likes.length,
      data: user.likes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;