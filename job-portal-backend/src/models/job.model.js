const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  experienceMin: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  experienceMax: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salaryCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  salaryPeriod: {
    type: DataTypes.ENUM('hourly', 'monthly', 'yearly'),
    defaultValue: 'yearly'
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  benefits: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'closed'),
    defaultValue: 'published'
  },
  remote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30); // Default expiry of 30 days
      return date;
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['companyId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['type']
    },
    {
      fields: ['location']
    }
  ]
});

// Define associations
Job.associate = (models) => {
  Job.belongsTo(models.User, {
    foreignKey: 'companyId',
    as: 'company'
  });
  Job.hasMany(models.Application, {
    foreignKey: 'jobId',
    as: 'applications'
  });
};

module.exports = Job; 