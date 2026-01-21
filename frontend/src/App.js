import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages Authentification
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';

// Pages Dashboard & Gestion
import Dashboard from './pages/Dashboard/Dashboard';
import Vehicles from './pages/Vehicles/Vehicles';
import Sessions from './pages/Sessions/Sessions';
import SessionDetail from './pages/Sessions/SessionDetail';
import RealTime from './pages/RealTime/RealTime';
import Reports from './pages/Reports/Reports';
import TrackingMap from './pages/Maps/TrackingMap';
import ChatBot from './pages/ChatBot/ChatBot';

// Composants Navigation
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Context & Utils
import axios from 'axios';
import Cookies from 'js-cookie';

import './App.css';

// Private Route - Protège les routes authentifiées
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route - Redirige vers dashboard si déjà connecté
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'utilisateur au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        // Configurer header par défaut pour axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Render Loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
        
        {/* Routes Publiques (sans authentification) */}
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Routes Protégées (avec authentification) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/vehicles"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <Vehicles />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/sessions"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <Sessions />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/sessions/:id"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <SessionDetail />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/realtime"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <RealTime />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <Reports />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/map"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <TrackingMap />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/chatbot"
            element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="flex-grow-1">
                    <Navbar user={user} />
                    <main className="main-content">
                      <ChatBot />
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </Router>
    );
  }

  export default App;