const fs = require('fs').promises;
const path = require('path');
const { User } = require('../models');
const { Op } = require('sequelize');

async function fixProfilePictures() {
  try {
    // Create directories if they don't exist
    const uploadDirs = ['uploads/profiles', 'uploads/profile-pictures'];
    for (const dir of uploadDirs) {
      try {
        await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
    }

    // Get all users with profile pictures
    const users = await User.findAll({
      where: {
        profilePicture: {
          [Op.not]: null
        }
      }
    });

    for (const user of users) {
      if (!user.profilePicture) continue;

      // Get the old path and new path
      const oldPath = path.join(process.cwd(), user.profilePicture.replace(/^\//, ''));
      const fileName = path.basename(user.profilePicture);
      const newPath = path.join(process.cwd(), 'uploads', 'profiles', fileName);

      try {
        // Check if file exists in old location
        await fs.access(oldPath);
        
        // Move file to new location
        await fs.copyFile(oldPath, newPath);
        
        // Update database with new path
        const newProfilePicture = `/uploads/profiles/${fileName}`;
        await user.update({ profilePicture: newProfilePicture });
        
        console.log(`Fixed profile picture for user ${user.id}: ${newProfilePicture}`);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`Profile picture not found for user ${user.id}: ${oldPath}`);
        } else {
          console.error(`Error fixing profile picture for user ${user.id}:`, err);
        }
      }
    }

    console.log('Profile picture fix completed');
  } catch (error) {
    console.error('Error fixing profile pictures:', error);
  }
}

// Run the script if called directly
if (require.main === module) {
  fixProfilePictures()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = fixProfilePictures;
