const Job = require('../../models/job.model');
const User = require('../../models/user.model');
const Application = require('../../models/application.model');
const { paginateResults, getSortOptions } = require('../../utils/helpers');

// Search jobs with filters
exports.searchJobs = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      location,
      type,
      experience,
      salary,
      skills,
      remote,
      sortBy,
      sortOrder
    } = req.query;

    const { skip, limit: limitParsed } = paginateResults(page, limit);
    const sort = getSortOptions(sortBy, sortOrder);

    // Build filter
    const filter = { status: 'published' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (experience) filter['experience.min'] = { $lte: parseInt(experience) };
    if (salary) filter['salary.min'] = { $gte: parseInt(salary) };
    if (skills) filter.skills = { $in: skills.split(',') };
    if (remote) filter.remote = remote === 'true';

    const jobs = await Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitParsed)
      .populate('company', 'name logo location');

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      total,
      page: parseInt(page) || 1,
      pages: Math.ceil(total / limitParsed)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get job details
exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo description location')
      .populate('applications', 'status');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      applicant: req.user._id
    });

    // Check if job is saved by user
    const user = await User.findById(req.user._id);
    const isSaved = user.savedJobs.includes(job._id);

    res.json({
      job,
      hasApplied: !!existingApplication,
      isSaved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommended jobs
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { skills, location, experience } = user.profile;
    const limit = 10;

    // Build recommendation filter
    const filter = {
      status: 'published',
      $or: [
        { skills: { $in: skills } },
        { location: { $regex: location, $options: 'i' } },
        { 'experience.min': { $lte: experience } }
      ]
    };

    const jobs = await Job.find(filter)
      .limit(limit)
      .sort('-createdAt')
      .populate('company', 'name logo');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get saved jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.query;
    const { skip, limit: limitParsed } = paginateResults(page, limit);
    const sort = getSortOptions(sortBy, sortOrder);

    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedJobs',
        options: {
          sort,
          skip,
          limit: limitParsed
        },
        populate: {
          path: 'company',
          select: 'name logo'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const total = user.savedJobs.length;

    res.json({
      jobs: user.savedJobs,
      total,
      page: parseInt(page) || 1,
      pages: Math.ceil(total / limitParsed)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save job
exports.saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobId = req.params.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Add to saved jobs if not already saved
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({
      message: 'Job saved successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsave job
exports.unsaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobId = req.params.id;

    // Remove from saved jobs
    user.savedJobs = user.savedJobs.filter(
      id => id.toString() !== jobId
    );
    await user.save();

    res.json({
      message: 'Job removed from saved jobs'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
