import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Register from './components/Register';
import Profile from './pages/Profile';
import Faculties from './pages/Faculties';
import AlumniList from './pages/AlumniList';
import AlumniInfo from './pages/AlumniInfo';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/user-homepage"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/faculties"
                            element={
                                <PrivateRoute>
                                    <Faculties />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/alumni-list"
                            element={
                                <PrivateRoute>
                                    <AlumniList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/alumni-info/:id"
                            element={
                                <PrivateRoute>
                                    <AlumniInfo />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
