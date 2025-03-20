const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Create notification
const createNotification = async (userId, type, message, data = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      data
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get user notifications
const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return notifications;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

// Mark notification as read
const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId }
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.update({ read: true });
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (userId) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId, read: false } }
    );
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete notification
const deleteNotification = async (notificationId, userId) => {
  try {
    const result = await Notification.destroy({
      where: { id: notificationId, userId }
    });
    return result > 0;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Notification templates
const templates = {
  applicationStatus: (data) => ({
    title: `Application ${data.status}`,
    message: `Your application for ${data.jobTitle} has been ${data.status}`,
    link: `/applications/${data.applicationId}`
  }),
  
  newApplication: (data) => ({
    title: 'New Application Received',
    message: `${data.applicantName} applied for ${data.jobTitle}`,
    link: `/employer/applications/${data.applicationId}`
  }),
  
  interview: (data) => ({
    title: 'Interview Scheduled',
    message: `Interview scheduled for ${data.jobTitle} on ${new Date(data.scheduledAt).toLocaleString()}`,
    link: `/applications/${data.applicationId}`
  }),
  
  jobRecommendation: (data) => ({
    title: 'New Job Recommendation',
    message: `New job matching your profile: ${data.jobTitle} at ${data.company}`,
    link: `/jobs/${data.jobId}`
  })
};

// Create notification from template
const notifyUser = async (userId, template, data) => {
  try {
    const notificationData = templates[template](data);
    return await createNotification(userId, template, notificationData.title, notificationData);
  } catch (error) {
    console.error('Error creating notification from template:', error);
    return null;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  notifyUser
};
