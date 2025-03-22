const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'submitted',
      'reviewing',
      'shortlisted',
      'interview_scheduled',
      'interviewed',
      'offered',
      'rejected',
      'withdrawn'
    ),
    defaultValue: 'submitted'
  },
  resumePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  interviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  interviewNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  offerDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  withdrawalReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {
      viewed: false,
      viewedAt: null,
      responseTime: null,
      communicationHistory: []
    }
  }
});

// Hooks
Application.beforeUpdate((instance) => {
  instance.lastUpdated = new Date();
});

module.exports = Application;
