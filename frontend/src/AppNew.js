import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages principales
import Dashboard from './pages/Dashboard/Dashboard';
import Vehicles from './pages/Vehicles/Vehicles';
import Sessions from './pages/Sessions/Sessions';
import SessionDetail from './pages/Sessions/SessionDetail';
import RealTime from './pages/RealTime/RealTime';
import Reports from './pages/Reports/Reports';
import ChatBot from './pages/ChatBot/ChatBot';

// Composants
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Contexte
import { SocketProvider } from './context/SocketContext';

import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <SocketProvider>
        <Toaster position="top-right" />

        {/* Routes sans authentification */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        {/* Routes avec authentification */}
        {token && (
          <div className="app-wrapper">
            <Navbar toggleSidebar={toggleSidebar} user={user} />
            <div className="app-body d-flex">
              <Sidebar open={sidebarOpen} />
              <main className={`app-main ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/sessions/:id" element={<SessionDetail />} />
                  <Route path="/realtime" element={<RealTime />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/chatbot" element={<ChatBot />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </div>
        )}

        {/* Redirection par défaut */}
        {!token && <Navigate to="/login" />}
      </SocketProvider>
    </Router>
  );
}

export default App;
