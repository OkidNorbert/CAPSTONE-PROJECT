const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { sequelize, User } = require('../src/models');

const createAdminUser = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@jobseek.com' }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@jobseek.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isEmailVerified: true
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@jobseek.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
    if (error.name === 'SequelizeConnectionError') {
      console.error('Could not connect to database. Please check your connection settings and make sure the database is running.');
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createAdminUser();