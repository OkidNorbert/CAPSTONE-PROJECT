const { sequelize } = require('../config/database');
const User = require('./user.model');
const Job = require('./job.model');
const Application = require('./application.model');
const Experience = require('./experience.model');
const Education = require('./education.model');
const Notification = require('./notification.model');
const Interview = require('./interview.model');
const Note = require('./note.model');

// Define associations
User.hasMany(Job, {
  foreignKey: 'companyId',
  as: 'jobs'
});

User.hasMany(Application, {
  foreignKey: 'applicantId',
  as: 'applications'
});

User.hasMany(Experience, {
  foreignKey: 'userId',
  as: 'experiences'
});

User.hasMany(Education, {
  foreignKey: 'userId',
  as: 'education'
});

User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications'
});

User.hasMany(Note, {
  foreignKey: 'userId',
  as: 'notes'
});

Job.belongsTo(User, {
  foreignKey: 'companyId',
  as: 'company'
});

Job.hasMany(Application, {
  foreignKey: 'jobId',
  as: 'applications'
});

Application.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job'
});

Application.belongsTo(User, {
  foreignKey: 'applicantId',
  as: 'applicant'
});

Application.hasMany(Interview, {
  foreignKey: 'applicationId',
  as: 'interviews'
});

Application.hasMany(Note, {
  foreignKey: 'applicationId',
  as: 'notes'
});

Experience.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Education.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Interview.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application'
});

Note.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application'
});

Note.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

module.exports = {
  sequelize,
  User,
  Job,
  Application,
  Experience,
  Education,
  Notification,
  Interview,
  Note
}; 