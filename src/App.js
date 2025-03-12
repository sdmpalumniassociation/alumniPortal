import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Route Protection
import PrivateRoute from './components/PrivateRoute';

// Routes Configuration
import { publicRoutes, protectedRoutes } from './routes';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        {publicRoutes.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}

                        {/* Protected Routes */}
                        {protectedRoutes.map(({ path, element }) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <PrivateRoute>
                                        {element}
                                    </PrivateRoute>
                                }
                            />
                        ))}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
