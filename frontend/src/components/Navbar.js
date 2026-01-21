import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'react-bootstrap-icons';
import './Navbar.css';

const NavBar = ({ toggleSidebar, user }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications - à remplacer par des vraies données
  const [notifications] = useState([
    { id: 1, message: 'Session complétée: Casablanca → Rabat', timestamp: '5 min' },
    { id: 2, message: 'Alerte: Ceinture non attachée', timestamp: '15 min' },
    { id: 3, message: 'Route en retard de 10 minutes', timestamp: '1 heure' },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar-modern sticky-top shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/dashboard" className="fw-bold">
          <span className="brand-logo">🎯</span>
          HJB Tracking
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="position-relative">
              <Nav.Link 
                href="#" 
                className="position-relative"
                onClick={(e) => {
                  e.preventDefault();
                  setShowNotifications(!showNotifications);
                }}
              >
                <Bell size={20} />
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </Badge>
              </Nav.Link>
              
              {/* Notifications Panel */}
              {showNotifications && (
                <div className="notifications-panel">
                  <div className="notifications-header">
                    <h6 className="mb-0">🔔 Notifications</h6>
                    <button 
                      className="btn-close btn-sm"
                      onClick={() => setShowNotifications(false)}
                    ></button>
                  </div>
                  <div className="notifications-body">
                    {notifications.length === 0 ? (
                      <p className="text-muted text-center py-3">Aucune notification</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="notification-item">
                          <p className="mb-1">{notif.message}</p>
                          <small className="text-muted">{notif.timestamp}</small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Chatbot */}
            <Nav.Link href="/chatbot" className="chatbot-link">
              🤖 AI Assistant
            </Nav.Link>

            {/* Profile Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                className="user-dropdown"
              >
                👤
                {user && <span className="ms-2">{user.firstName}</span>}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/profile">
                  👤 Mon Profil
                </Dropdown.Item>
                <Dropdown.Item href="/settings">
                  ⚙️ Paramètres
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  🚪 Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
