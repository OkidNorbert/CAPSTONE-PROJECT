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
  headline: {
    type: DataTypes.STRING,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  experience: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  educationHistory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      jobTypes: [],
      locations: [],
      industries: [],
      salaryExpectation: null,
      isOpenToRemote: true
    }
  },
  socialLinks: {
    type: DataTypes.JSON,
    defaultValue: {
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: ''
    }
  },
  // Employer specific fields
  companyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companySize: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyFounded: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyWebsite: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  companyLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyLogo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyMission: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  companyCulture: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  companyBenefits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  companySocialMedia: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('companySocialMedia');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('companySocialMedia', JSON.stringify(value));
    }
  },
  notificationPreferences: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('notificationPreferences');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('notificationPreferences', JSON.stringify(value));
    }
  },
  privacySettings: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('privacySettings');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('privacySettings', JSON.stringify(value));
    }
  },
  applicationSettings: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('applicationSettings');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('applicationSettings', JSON.stringify(value));
    }
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