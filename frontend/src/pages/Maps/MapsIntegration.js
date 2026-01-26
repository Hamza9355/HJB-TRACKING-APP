import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import GoogleMapsFreeComponent from '../../components/Maps/GoogleMapsFree';
import WazeNavigation from '../../components/Maps/WazeNavigation';
import './TrackingMap.css';

/**
 * Page complète avec Google Maps et Waze
 * Gratuit - Pas de clé API requise!
 */
const MapsIntegration = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/sessions`);
      setSessions(Array.isArray(response.data) ? response.data : []);
      if (response.data && response.data.length > 0) {
        setSelectedSession(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="mb-3">🗺️ Google Maps & Waze Integration</h1>
          <Alert variant="info">
            ✨ <strong>100% Gratuit!</strong> Google Maps, Waze, et Apple Maps intégrés sans clé API
          </Alert>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        {/* Sidebar - Sessions */}
        <Col md={3} className="mb-4">
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white">
              <Card.Title className="mb-0">📋 Sessions</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {sessions.length === 0 ? (
                  <div className="p-3 text-center text-muted">
                    <p>Aucune session disponible</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 border-bottom cursor-pointer ${
                        selectedSession?.id === session.id ? 'bg-light' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedSession(session)}
                    >
                      <p className="mb-1 fw-bold">🚚 {session.vehicleId}</p>
                      <small className="text-muted">
                        {session.driverName || 'N/A'}<br/>
                        {session.destination || 'N/A'}
                      </small>
                      <div className="mt-2">
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              session.status === 'en_cours'
                                ? '#10b981'
                                : session.status === 'complétée'
                                ? '#3b82f6'
                                : '#ef4444',
                          }}
                        >
                          {session.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content - Maps & Navigation */}
        <Col md={9}>
          {selectedSession ? (
            <>
              {/* Session Info */}
              <Card className="mb-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Card.Body>
                  <h4>🚚 {selectedSession.vehicleId}</h4>
                  <p className="mb-1">👤 Chauffeur: {selectedSession.driverName}</p>
                  <p className="mb-1">📍 Destination: {selectedSession.destination}</p>
                  <p className="mb-0">
                    Statut:{' '}
                    <span
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {selectedSession.status}
                    </span>
                  </p>
                </Card.Body>
              </Card>

              {/* Google Maps Component */}
              <GoogleMapsFreeComponent
                latitude={selectedSession.location?.latitude || 33.9716}
                longitude={selectedSession.location?.longitude || -6.8498}
                vehicleId={selectedSession.vehicleId}
                status={selectedSession.status}
                destination={selectedSession.destination}
              />

              {/* Waze Component */}
              <WazeNavigation
                latitude={selectedSession.location?.latitude || 33.9716}
                longitude={selectedSession.location?.longitude || -6.8498}
                vehicleId={selectedSession.vehicleId}
                driverName={selectedSession.driverName}
              />

              {/* Additional Info */}
              <Card className="mt-3">
                <Card.Header className="bg-secondary text-white">
                  <Card.Title className="mb-0">📊 Détails Session</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Latitude:</strong><br/>
                        <code>{selectedSession.location?.latitude?.toFixed(6)}</code>
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Longitude:</strong><br/>
                        <code>{selectedSession.location?.longitude?.toFixed(6)}</code>
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Vitesse:</strong> {selectedSession.speed || 0} km/h
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Poids:</strong> {selectedSession.weightLoaded || 0} kg
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Précision GPS:</strong> {selectedSession.accuracy || 0}%
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Date:</strong> {new Date(selectedSession.createdAt).toLocaleDateString()}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          ) : (
            <Card>
              <Card.Body className="text-center text-muted">
                <p>Sélectionnez une session pour voir les détails</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MapsIntegration;
