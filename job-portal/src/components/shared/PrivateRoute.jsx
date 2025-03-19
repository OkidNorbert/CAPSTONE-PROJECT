import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (role && currentUser.role !== role) {
    // Redirect to appropriate dashboard based on user's role
    if (currentUser.role === 'jobseeker') {
      return <Navigate to="/jobs/search" />;
    } else if (currentUser.role === 'employer') {
      return <Navigate to="/company/jobs" />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/reports" />;
    }
  }

  return children;
};

export default PrivateRoute; 