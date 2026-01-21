import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './TrackingMap.css';

// Custom marker icons based on status
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 16px;
      ">
        🚚
      </div>
    `,
    iconSize: [30, 30],
    className: 'leaflet-marker-custom'
  });
};

// Helper function to get status color
const getStatusColor = (status) => {
  return status === 'en_cours' ? '#ff6b6b' : '#51cf66';
};

const TrackingMap = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [showStats, setShowStats] = useState(true);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState([]);

  const defaultCenter = [33.9716, 6.8498]; // Morocco

  // Données d'exemple étendues
  const mockSessions = [
    {
      id: '1',
      vehicleId: 'TRUCK-001',
      driverName: 'Ahmed Ben Ali',
      status: 'en_cours',
      location: { latitude: 33.9716, longitude: -6.8498 },
      destination: 'Rabat',
      weightLoaded: 250,
      accuracy: 95,
      speed: 65,
      createdAt: new Date(),
      route: [[33.9716, -6.8498], [34.0209, -6.8416], [34.0524, -6.8391]]
    },
    {
      id: '2',
      vehicleId: 'TRUCK-002',
      driverName: 'Mohamed Hassan',
      status: 'complétée',
      location: { latitude: 34.0209, longitude: -6.8416 },
      destination: 'Tanger',
      weightLoaded: 180,
      accuracy: 92,
      speed: 0,
      createdAt: new Date(),
      route: [[34.0209, -6.8416]]
    },
    {
      id: '3',
      vehicleId: 'TRUCK-003',
      driverName: 'Fatima Alaoui',
      status: 'en_cours',
      location: { latitude: 33.8547, longitude: -7.5898 },
      destination: 'Essaouira',
      weightLoaded: 320,
      accuracy: 88,
      speed: 72,
      createdAt: new Date(),
      route: [[33.8547, -7.5898], [31.5087, -8.7639]]
    },
    {
      id: '4',
      vehicleId: 'TRUCK-004',
      driverName: 'Karim Benomar',
      status: 'en_cours',
      location: { latitude: 34.2676, longitude: -6.1381 },
      destination: 'Fez',
      weightLoaded: 210,
      accuracy: 96,
      speed: 58,
      createdAt: new Date(),
      route: [[34.2676, -6.1381], [34.0331, -5.0036]]
    },
    {
      id: '5',
      vehicleId: 'TRUCK-005',
      driverName: 'Samir Moussa',
      status: 'en_cours',
      location: { latitude: 33.5731, longitude: -7.5898 },
      destination: 'Marrakech',
      weightLoaded: 290,
      accuracy: 94,
      speed: 85,
      createdAt: new Date(),
      route: [[33.5731, -7.5898], [31.6295, -8.0154]]
    },
    {
      id: '6',
      vehicleId: 'TRUCK-006',
      driverName: 'Nadia Faridi',
      status: 'complétée',
      location: { latitude: 31.6295, longitude: -8.0154 },
      destination: 'Agadir',
      weightLoaded: 150,
      accuracy: 91,
      speed: 0,
      createdAt: new Date(),
      route: [[31.6295, -8.0154]]
    },
    {
      id: '7',
      vehicleId: 'TRUCK-007',
      driverName: 'Hassan Bennani',
      status: 'en_cours',
      location: { latitude: 34.3316, longitude: -7.5898 },
      destination: 'Oujda',
      weightLoaded: 280,
      accuracy: 93,
      speed: 92,
      createdAt: new Date(),
      route: [[34.3316, -7.5898], [34.6839, -1.9375]]
    },
    {
      id: '8',
      vehicleId: 'TRUCK-008',
      driverName: 'Amina Boutaleb',
      status: 'en_cours',
      location: { latitude: 35.7595, longitude: -5.8330 },
      destination: 'Tétouan',
      weightLoaded: 200,
      accuracy: 97,
      speed: 48,
      createdAt: new Date(),
      route: [[35.7595, -5.8330], [35.3001, -5.3675]]
    }
  ];

  // Fetch sessions
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sessions');
      const data = response.data;
      // S'assurer que c'est un tableau
      setSessions(Array.isArray(data) ? data : mockSessions);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
      // Utiliser les données d'exemple en cas d'erreur
      setSessions(mockSessions);
      setLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'en_cours':
        return '#10b981'; // Green
      case 'complétée':
        return '#3b82f6'; // Blue
      case 'annulée':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  // Handle session selection - generate mock route
  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    // Generate mock route points
    const lat = session.location?.latitude || 33.9716;
    const lng = session.location?.longitude || 6.8498;
    
    // Create waypoints for the route
    const mockRoute = [
      [33.5731, -7.5898], // Starting point
      [lat, lng],         // Ending point
      [lat + 0.1, lng + 0.1], // Additional waypoint
    ];
    setRoute(mockRoute);
  };

  // Open in external maps
  const openInGoogleMaps = (lat, lng) => {
    window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  };

  const openInWaze = (lat, lng) => {
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
  };

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
    <Container fluid className="tracking-map-container p-3">
      <Row className="mb-3">
        <Col md={8}>
          <h2 className="mb-3">📍 Suivi en Temps Réel</h2>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant={mapType === 'roadmap' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setMapType('roadmap')}
            className="me-2"
          >
            Route
          </Button>
          <Button
            variant={mapType === 'satellite' ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setMapType('satellite')}
            className="me-2"
          >
            Satellite
          </Button>
          <Button
            variant={showStats ? 'info' : 'outline-info'}
            size="sm"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? '👁️ Masquer' : '👁️ Afficher'}
          </Button>
        </Col>
      </Row>

      <Row className="h-100">
        <Col md={8} className="mb-3">
          <div className="leaflet-container-wrapper">
            <MapContainer
              center={defaultCenter}
              zoom={10}
              style={{ width: '100%', height: 'calc(100vh - 150px)', borderRadius: '10px' }}
            >
              {/* Tile Layer - OpenStreetMap */}
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Display all markers */}
              {sessions.map((session, index) => {
                const lat = session.location?.latitude || 33.9716;
                const lng = session.location?.longitude || 6.8498;
                const color = getStatusColor(session.status);

                return (
                  <React.Fragment key={index}>
                    {/* Radius Circle */}
                    <Circle
                      center={[lat, lng]}
                      radius={500}
                      pathOptions={{
                        fillColor: color,
                        fillOpacity: 0.1,
                        color: color,
                        opacity: 0.5,
                        weight: 1,
                      }}
                    />

                    {/* Marker */}
                    <Marker
                      position={[lat, lng]}
                      icon={createMarkerIcon(color)}
                      eventHandlers={{
                        click: () => handleSessionSelect(session),
                      }}
                    >
                      <Popup>
                        <div className="map-popup" style={{ minWidth: '250px' }}>
                          <h6 className="mb-2" style={{ color: '#1a237e', fontWeight: 'bold' }}>🚚 {session.vehicleId}</h6>
                          <hr className="my-2" />
                          <p className="mb-1">
                            <small><strong>Chauffeur:</strong> {session.driverName || 'N/A'}</small>
                          </p>
                          <p className="mb-1">
                            <small><strong>Destination:</strong> {session.destination || 'N/A'}</small>
                          </p>
                          <p className="mb-1">
                            <small><strong>Statut:</strong> <span style={{ color: getStatusColor(session.status), fontWeight: 'bold' }}>{session.status}</span></small>
                          </p>
                          <p className="mb-1">
                            <small><strong>Vitesse:</strong> {session.speed || 0} km/h</small>
                          </p>
                          <p className="mb-1">
                            <small><strong>Poids:</strong> {session.weightLoaded} kg</small>
                          </p>
                          <p className="mb-1">
                            <small><strong>Précision GPS:</strong> {session.accuracy}%</small>
                          </p>
                          <p className="mb-2">
                            <small><strong>Date:</strong> {new Date(session.createdAt).toLocaleDateString()}</small>
                          </p>
                          <div className="popup-buttons">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2"
                              onClick={() => openInGoogleMaps(lat, lng)}
                            >
                              🗺️ Maps
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => openInWaze(lat, lng)}
                            >
                              🗺️ Waze
                            </Button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                    
                    {/* Display route polyline for this vehicle */}
                    {session.route && session.route.length > 0 && (
                      <Polyline
                        positions={session.route}
                        pathOptions={{
                          color: getStatusColor(session.status),
                          opacity: session.status === 'en_cours' ? 0.8 : 0.4,
                          weight: 3,
                          dashArray: session.status === 'complétée' ? '5, 5' : undefined,
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Display route if session selected */}
              {selectedSession && route.length > 0 && (
                <Polyline
                  positions={route}
                  pathOptions={{
                    color: '#1a237e',
                    opacity: 0.7,
                    weight: 3,
                  }}
                />
              )}
            </MapContainer>
          </div>
        </Col>

        {/* Stats Sidebar */}
        {showStats && (
          <Col md={4}>
            <Card className="mb-3 stats-card">
              <Card.Header className="bg-gradient">
                <Card.Title className="mb-0">📊 Statistiques</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row className="text-center mb-3">
                  <Col xs={6}>
                    <div className="stat-box">
                      <h4 className="stat-number">{sessions.length}</h4>
                      <p className="stat-label">Sessions</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="stat-box">
                      <h4 className="stat-number">
                        {sessions.filter(s => s.status === 'en_cours').length}
                      </h4>
                      <p className="stat-label">En cours</p>
                    </div>
                  </Col>
                </Row>
                <Row className="text-center">
                  <Col xs={6}>
                    <div className="stat-box">
                      <h4 className="stat-number">
                        {sessions.reduce((sum, s) => sum + (s.weightLoaded || 0), 0)} kg
                      </h4>
                      <p className="stat-label">Poids Total</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="stat-box">
                      <h4 className="stat-number">
                        {Math.round(sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / (sessions.length || 1))}%
                      </h4>
                      <p className="stat-label">Précision Moy</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Sessions List */}
            <Card className="sessions-list">
              <Card.Header className="bg-gradient">
                <Card.Title className="mb-0">📋 Sessions Actives</Card.Title>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="sessions-scroll">
                  {sessions.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                      <p>Aucune session</p>
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`session-item ${selectedSession?.id === session.id ? 'active' : ''}`}
                        onClick={() => handleSessionSelect(session)}
                        style={{
                          borderLeftColor: getStatusColor(session.status),
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1 fw-bold">🚚 {session.vehicleId}</p>
                            <small className="text-muted">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: getStatusColor(session.status),
                            }}
                          >
                            {session.status}
                          </span>
                        </div>
                        <p className="mb-0 mt-2">
                          <small>
                            <strong>{session.weightLoaded} kg</strong> | Acc: {session.accuracy}%
                          </small>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default TrackingMap;
