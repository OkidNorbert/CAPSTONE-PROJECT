const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { sequelize } = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler.middleware');
const { createUploadDirectories } = require('./src/config/init');
const path = require('path');

// Load env vars
dotenv.config();

// Create upload directories
createUploadDirectories();

// Route files
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const jobRoutes = require('./src/routes/job.routes');
const applicationRoutes = require('./src/routes/application.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const employerRoutes = require('./src/routes/employer.routes');
const jobseekerRoutes = require('./src/routes/jobseeker.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/jobseeker', jobseekerRoutes);

// Error handler
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database with alter option to add new columns
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err.message);
  // Close server & exit process
  process.exit(1);
});

module.exports = app; 