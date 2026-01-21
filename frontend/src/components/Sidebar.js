import React from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Truck,
  Activity,
  FileText,
  MapFill,
} from 'react-bootstrap-icons';
import './Sidebar.css';

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
    },
    {
      text: 'Véhicules',
      path: '/vehicles',
      icon: <Truck size={20} />,
    },
    {
      text: 'Sessions',
      path: '/sessions',
      icon: '📦',
    },
    {
      text: 'Temps Réel',
      path: '/realtime',
      icon: <Activity size={20} />,
    },
    {
      text: 'Carte',
      path: '/map',
      icon: <MapFill size={20} />,
    },
    {
      text: 'Rapports',
      path: '/reports',
      icon: <FileText size={20} />,
    },
    {
      text: 'AI Chat',
      path: '/chatbot',
      icon: '🤖',
    },
  ];

  const secondaryItems = [
    {
      text: 'Paramètres',
      path: '/settings',
      icon: '⚙️',
    },
    {
      text: 'Support',
      path: '/support',
      icon: '🆘',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <Nav className="flex-column">
          <div className="nav-section mb-4">
            <h6 className="nav-section-title px-3 py-2 text-muted">MENU</h6>
            {menuItems.map((item) => (
              <Nav.Link
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {open && <span className="nav-text">{item.text}</span>}
              </Nav.Link>
            ))}
          </div>

          <hr className="my-3" />

          <div className="nav-section">
            <h6 className="nav-section-title px-3 py-2 text-muted">AUTRES</h6>
            {secondaryItems.map((item) => (
              <Nav.Link
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {open && <span className="nav-text">{item.text}</span>}
              </Nav.Link>
            ))}
          </div>
        </Nav>
      </div>

      {open && (
        <div className="sidebar-footer p-3 text-center border-top">
          <small className="text-muted">HJB Tracking System v2.0</small>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
