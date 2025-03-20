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
  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  resumePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'shortlisted', 'rejected', 'hired'),
    defaultValue: 'pending'
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['jobId']
    },
    {
      fields: ['applicantId']
    },
    {
      fields: ['status']
    }
  ]
});

// Define associations
Application.associate = (models) => {
  Application.belongsTo(models.Job, {
    foreignKey: 'jobId',
    as: 'job'
  });
  
  Application.belongsTo(models.User, {
    foreignKey: 'applicantId',
    as: 'applicant'
  });
  
  Application.hasMany(models.Interview, {
    foreignKey: 'applicationId',
    as: 'interviews'
  });
  
  Application.hasMany(models.Note, {
    foreignKey: 'applicationId',
    as: 'notes'
  });
};

module.exports = Application; 