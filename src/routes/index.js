// Page Components
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Faculties from '../pages/Faculties';
import AlumniList from '../pages/AlumniList';
import AlumniInfo from '../pages/AlumniInfo';

// Auth Components
import Login from '../components/Login';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import Register from '../components/Register';

export const publicRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password/:token", element: <ResetPassword /> },
    { path: "/register", element: <Register /> },
];

export const protectedRoutes = [
    { path: "/user-homepage", element: <Dashboard /> },
    { path: "/profile", element: <Profile /> },
    { path: "/faculties", element: <Faculties /> },
    { path: "/alumni-list", element: <AlumniList /> },
    { path: "/alumni-info/:id", element: <AlumniInfo /> },
]; 