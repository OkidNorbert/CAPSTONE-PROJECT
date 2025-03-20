const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('jobseeker', 'employer', 'admin'),
    defaultValue: 'jobseeker'
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  resetPasswordToken: {
    type: DataTypes.STRING
  },
  resetPasswordExpires: {
    type: DataTypes.DATE
  },
  // Job seeker specific fields
  resume: {
    type: DataTypes.STRING
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Employer specific fields
  companyName: {
    type: DataTypes.STRING
  },
  companyLogo: {
    type: DataTypes.STRING
  },
  companyWebsite: {
    type: DataTypes.STRING
  },
  companyLocation: {
    type: DataTypes.STRING
  },
  companyDescription: {
    type: DataTypes.TEXT
  },
  industry: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.toPublicJSON = function() {
  const values = this.get();
  delete values.password;
  delete values.resetPasswordToken;
  delete values.resetPasswordExpires;
  return values;
};

module.exports = User; 