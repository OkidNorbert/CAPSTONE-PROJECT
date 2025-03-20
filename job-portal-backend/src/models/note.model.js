const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Applications',
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['applicationId']
    },
    {
      fields: ['userId']
    }
  ]
});

// Define associations
Note.associate = (models) => {
  Note.belongsTo(models.Application, {
    foreignKey: 'applicationId',
    as: 'application'
  });
  
  Note.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'author'
  });
};

module.exports = Note; 