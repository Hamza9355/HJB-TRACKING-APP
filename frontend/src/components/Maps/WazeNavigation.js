import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

/**
 * Composant Waze Navigation
 * Navigation gratuite avec Waze - Pas de clé API requise
 */
const WazeNavigation = ({ latitude, longitude, vehicleId, driverName }) => {
  const openWaze = () => {
    const wazeURL = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    window.open(wazeURL, '_blank');
  };

  const shareWazeLink = () => {
    const wazeLink = `https://waze.com/ul?ll=${latitude},${longitude}`;
    const message = `🚕 Suivez-moi sur Waze: ${wazeLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Navigation ${vehicleId}`,
        text: message,
        url: wazeLink
      }).catch(err => console.log('Erreur partage:', err));
    } else {
      // Fallback: copier dans le presse-papiers
      navigator.clipboard.writeText(wazeLink);
      alert('Lien Waze copié!');
    }
  };

  const getWazeShareLink = () => {
    return `https://waze.com/ul?ll=${latitude},${longitude}`;
  };

  return (
    <Card className="waze-card mb-3" style={{ border: '2px solid #6FCE5A', borderRadius: '10px' }}>
      <Card.Header style={{ background: 'linear-gradient(135deg, #6FCE5A 0%, #5AB63E 100%)', color: 'white' }}>
        <Card.Title className="mb-0">
          🚗 Navigation Waze
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col xs={12}>
            <p className="mb-2">
              <strong>📍 Position GPS:</strong><br/>
              <code>{latitude.toFixed(4)}, {longitude.toFixed(4)}</code>
            </p>
            <p className="mb-2">
              <strong>🚚 Véhicule:</strong> {vehicleId}<br/>
              <strong>👤 Chauffeur:</strong> {driverName}
            </p>
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={6} className="mb-2">
            <Button
              variant="success"
              className="w-100"
              onClick={openWaze}
              style={{ background: '#6FCE5A', border: 'none' }}
            >
              🚗 Naviguer maintenant
            </Button>
          </Col>
          <Col xs={12} sm={6} className="mb-2">
            <Button
              variant="outline-success"
              className="w-100"
              onClick={shareWazeLink}
            >
              📤 Partager
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs={12}>
            <h6>Liens directs Waze:</h6>
            <small className="d-block mb-2">
              <strong>Navigation:</strong><br/>
              <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                https://waze.com/ul?ll={latitude},{longitude}&navigate=yes
              </code>
            </small>
            <small className="d-block">
              <strong>Vue simple:</strong><br/>
              <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                https://waze.com/ul?ll={latitude},{longitude}
              </code>
            </small>
          </Col>
        </Row>

        <div className="mt-3 p-2" style={{ background: '#f0f9f7', borderRadius: '5px', fontSize: '12px' }}>
          ✅ <strong>Avantage Waze:</strong> Trafic en temps réel, alertes dangers, partage direct
        </div>
      </Card.Body>
    </Card>
  );
};

export default WazeNavigation;
