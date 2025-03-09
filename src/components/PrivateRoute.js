import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        // Redirect them to the login page
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute; 