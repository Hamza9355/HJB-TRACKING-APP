import React, { useEffect, useRef, useState } from 'react';
import { Button, Badge } from 'react-bootstrap';

/**
 * Google Maps gratuite - Utilise l'API Leaflet + Mapbox
 * L'alternative gratuite: Leaflet + OpenStreetMap ou Mapbox (gratuit jusqu'à 50k requêtes/mois)
 */
const GoogleMapsFreeComponent = ({ latitude, longitude, vehicleId, status, destination }) => {
  const mapRef = useRef(null);
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);

  // Ouvrir Google Maps dans un iframe gratuit
  const openGoogleMapsEmbed = () => {
    window.open(
      `https://maps.google.com/?q=${latitude},${longitude}&z=17`,
      'GoogleMaps',
      'width=900,height=600'
    );
  };

  return (
    <div className="maps-integration">
      <style>{`
        .maps-card {
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 15px;
          margin: 10px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .maps-card-header {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .maps-button-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .maps-button-group button {
          flex: 1;
          min-width: 120px;
          padding: 10px 15px;
          border-radius: 8px;
          border: none;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .maps-button-group button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .maps-info {
          background: rgba(255,255,255,0.1);
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
          font-size: 14px;
        }

        .maps-footer {
          margin-top: 10px;
          font-size: 12px;
          opacity: 0.8;
        }
      `}</style>

      <div className="maps-card">
        <div className="maps-card-header">
          🗺️ Navigation & Cartes
          <Badge bg={status === 'en_cours' ? 'success' : 'info'}>{status}</Badge>
        </div>

        <div className="maps-info">
          <strong>📍 Position:</strong> {latitude.toFixed(4)}, {longitude.toFixed(4)}<br/>
          <strong>🚚 Véhicule:</strong> {vehicleId}<br/>
          <strong>📌 Destination:</strong> {destination || 'Non définie'}
        </div>

        <div className="maps-button-group">
          {/* Google Maps Button */}
          <button
            style={{
              backgroundColor: '#EA4335',
              color: 'white',
            }}
            onClick={openGoogleMapsEmbed}
            title="Ouvrir dans Google Maps"
          >
            🔴 Google Maps
          </button>

          {/* Waze Navigation */}
          <button
            style={{
              backgroundColor: '#6FCE5A',
              color: 'white',
            }}
            onClick={() => {
              window.open(
                `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
                'Waze',
                'width=800,height=600'
              );
            }}
            title="Naviguer avec Waze"
          >
            🟢 Waze
          </button>

          {/* Apple Maps (pour iOS) */}
          <button
            style={{
              backgroundColor: '#A2AAAD',
              color: 'white',
            }}
            onClick={() => {
              window.open(
                `maps://maps.apple.com/?q=${latitude},${longitude}`,
                '_blank'
              );
            }}
            title="Ouvrir dans Apple Maps"
          >
            🟡 Apple Maps
          </button>

          {/* Copier Coordonnées */}
          <button
            style={{
              backgroundColor: '#4285F4',
              color: 'white',
            }}
            onClick={() => {
              navigator.clipboard.writeText(`${latitude},${longitude}`);
              alert('Coordonnées copiées!');
            }}
            title="Copier coordonnées GPS"
          >
            📋 Copier GPS
          </button>
        </div>

        <div className="maps-footer">
          ⭐ Gratuit: Google Maps, Waze, et Apple Maps intégrés · Pas de clé API requise!
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsFreeComponent;
