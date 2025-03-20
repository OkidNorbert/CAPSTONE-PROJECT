import React from 'react';
import { Routes, Route } from 'react-router-dom';
import JobSearch from '../components/jobseeker/Jobs/JobSearch';
import JobDetail from '../components/jobseeker/Jobs/JobDetail';
import Applications from '../components/jobseeker/Applications/Applications';
import Profile from '../pages/jobseeker/Profile';
import ProfileResumes from '../pages/jobseeker/ProfileResumes';
import JobseekerLayout from '../layouts/JobseekerLayout';

const JobseekerRoutes = () => {
  return (
    <Routes>
      <Route element={<JobseekerLayout />}>
        <Route path="/" element={<JobSearch />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/resumes" element={<ProfileResumes />} />
      </Route>
    </Routes>
  );
};

export default JobseekerRoutes;
