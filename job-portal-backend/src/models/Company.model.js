const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  logo: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    validate: [validator.isURL, 'Please provide a valid URL']
  },
  description: {
    type: String,
    required: [true, 'Company description is required'],
    trim: true,
    minlength: [100, 'Description must be at least 100 characters']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true
  },
  founded: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  headquarters: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  locations: [{
    type: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  }],
  specialties: [{
    type: String,
    trim: true
  }],
  culture: {
    type: String,
    trim: true
  },
  benefits: [{
    title: String,
    description: String,
    icon: String
  }],
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocument: {
    type: String
  },
  activeJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from company name before saving
companySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  }
  this.updatedAt = Date.now();
  next();
});

// Update average rating when a review is added
companySchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = total / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
};

// Add a review
companySchema.methods.addReview = async function(userId, rating, title, review) {
  this.reviews.push({
    user: userId,
    rating,
    title,
    review
  });
  
  this.updateRating();
  await this.save();
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
