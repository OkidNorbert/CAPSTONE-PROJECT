import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/globals.css';
import PrivateRoute from './components/shared/PrivateRoute';
import Footer from './components/shared/Layout/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your components
import Navbar from './components/shared/Layout/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/jobseeker/Profile';
import CompanyProfileDisplay from './components/employer/Profile/CompanyProfileDisplay';
import JobSearchPage from './pages/JobSearch';
import JobList from './components/employer/Jobs/JobList';
import UserReport from './components/admin/Reports/UserReport';
import ApplicationDetails from './components/employer/Applications/ApplicationDetails';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminSettings from './components/admin/Settings/AdminSettings';
import JobDetailPage from './pages/JobDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import AdminDashboard from './components/admin/Dashboard/AdminDashboard';
import UserManagement from './components/admin/Dashboard/UserManagement';
import JobManagement from './components/admin/Dashboard/JobManagement';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-grow w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="w-full h-full">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    
                    {/* Job Seeker Routes */}
                    <Route 
                      path="/profile" 
                      element={
                        <PrivateRoute role="jobseeker">
                          <Profile />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/jobs/search" 
                      element={
                        <PrivateRoute role="jobseeker">
                          <JobSearchPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/jobs/:id" 
                      element={
                        <PrivateRoute role="jobseeker">
                          <JobDetailPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/applications" 
                      element={
                        <PrivateRoute role="jobseeker">
                          <MyApplicationsPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/applications/:id" 
                      element={
                        <PrivateRoute role="jobseeker">
                          <ApplicationDetailPage />
                        </PrivateRoute>
                      } 
                    />

                    {/* Employer Routes */}
                    <Route 
                      path="/company/profile" 
                      element={
                        <PrivateRoute role="employer">
                          <CompanyProfileDisplay />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/company/jobs" 
                      element={
                        <PrivateRoute role="employer">
                          <JobList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/employer/applications/:id" 
                      element={
                        <PrivateRoute role="employer">
                          <ApplicationDetails />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/company/dashboard" 
                      element={
                        <PrivateRoute role="employer">
                          <CompanyDashboard />
                        </PrivateRoute>
                      } 
                    />

                    {/* Admin Routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <PrivateRoute role="admin">
                          <AdminDashboard />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/admin/reports" 
                      element={
                        <PrivateRoute role="admin">
                          <UserReport />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/admin/settings" 
                      element={
                        <PrivateRoute role="admin">
                          <AdminSettings />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/admin/users" 
                      element={
                        <PrivateRoute role="admin">
                          <UserManagement />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/admin/jobs" 
                      element={
                        <PrivateRoute role="admin">
                          <JobManagement />
                        </PrivateRoute>
                      } 
                    />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </div>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
