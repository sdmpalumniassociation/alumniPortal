import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import UserHomepage from './pages/UserHomepage';
import Profile from './pages/Profile';
import Faculties from './pages/Faculties';
import AlumniList from './pages/AlumniList';
import AlumniInfo from './pages/AlumniInfo';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-homepage" element={<UserHomepage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/alumni-list" element={<AlumniList />} />
            <Route path="/alumni-info/:id" element={<AlumniInfo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
