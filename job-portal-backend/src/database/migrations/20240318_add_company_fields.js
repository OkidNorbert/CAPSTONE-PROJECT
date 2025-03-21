const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'companySize', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'companyFounded', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'companyMission', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'companyCulture', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'companyBenefits', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'companySocialMedia', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'notificationPreferences', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'privacySettings', {
      type: DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'applicationSettings', {
      type: DataTypes.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'companySize');
    await queryInterface.removeColumn('Users', 'companyFounded');
    await queryInterface.removeColumn('Users', 'companyMission');
    await queryInterface.removeColumn('Users', 'companyCulture');
    await queryInterface.removeColumn('Users', 'companyBenefits');
    await queryInterface.removeColumn('Users', 'companySocialMedia');
    await queryInterface.removeColumn('Users', 'notificationPreferences');
    await queryInterface.removeColumn('Users', 'privacySettings');
    await queryInterface.removeColumn('Users', 'applicationSettings');
  }
}; 