const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const notificationService = require('../services/notification.service');

// Get user notifications with pagination and filters
router.get('/', protect, async (req, res) => {
  try {
    const result = await notificationService.getUserNotifications(req.user.id, req.query);
    if (!result) {
      return res.status(500).json({ message: 'Error fetching notifications' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/read-all', protect, async (req, res) => {
  try {
    const success = await notificationService.markAllAsRead(req.user.id);
    if (!success) {
      return res.status(500).json({ message: 'Error marking notifications as read' });
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const success = await notificationService.deleteNotification(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 