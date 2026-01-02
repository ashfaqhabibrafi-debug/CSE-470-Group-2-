import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getDisaster } from '../../services/disasterApi';
import './DisasterDetail.css';

const DisasterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDisaster();
  }, [id]);

  const fetchDisaster = async () => {
    try {
      setLoading(true);
      const response = await getDisaster(id);
      setDisaster(response.data);
    } catch (err) {
      setError('Failed to load disaster details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#d32f2f';
      case 'high':
        return '#f57c00';
      case 'medium':
        return '#fbc02d';
      case 'low':
        return '#388e3c';
      default:
        return '#666';
    }
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  
  const getMapCenter = useMemo(() => {
    if (!disaster?.location?.coordinates || disaster.location.coordinates.length < 2) {
      return { lat: 23.8103, lng: 90.4125 }; // Default to Bangladesh
    }
    const [lng, lat] = disaster.location.coordinates;
    return { lat, lng };
  }, [disaster]);

  if (loading) {
    return (
      <div className="disaster-detail-container">
        <div className="loading">Loading disaster details...</div>
      </div>
    );
  }

  if (error || !disaster) {
    return (
      <div className="disaster-detail-container">
        <div className="error-state">
          <p>{error || 'Disaster not found'}</p>
          <Link to="/disasters" className="btn-back">← Back to Disasters</Link>
        </div>
      </div>
    );
  }

  const hasValidCoordinates = disaster?.location?.coordinates && 
    disaster.location.coordinates.length === 2;

  return (
    <div className="disaster-detail-container">
      <div className="detail-header">
        <Link to="/disasters" className="btn-back">← Back to Disasters</Link>
        <h1>{disaster.title}</h1>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-section">
            <h2>Description</h2>
            <p>{disaster.description}</p>
          </div>

          {disaster.photos && disaster.photos.length > 0 && (
            <div className="detail-section">
              <h2>Photos</h2>
              <div className="photos-grid">
                {disaster.photos.map((photo, index) => {
                  const isUrl = photo && (photo.startsWith('http') || photo.startsWith('/') || photo.startsWith('data:'));
                  
                  return (
                    <div key={index} className="photo-item">
                      {isUrl ? (
                        <img 
                          src={photo} 
                          alt={`Disaster photo ${index + 1}`}
                          className="disaster-photo"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="photo-placeholder">
                          <div className="placeholder-icon">📷</div>
                          <div className="placeholder-text">
                            <p className="placeholder-filename">{photo || 'Photo'}</p>
                            <small>Photo upload functionality coming soon</small>
                          </div>
                        </div>
                      )}
                      <div className="photo-filename" style={{ display: 'none' }}>
                        {photo}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {disaster.location && (
            <div className="detail-section">
              <h2>Location</h2>
              <div className="location-info">
                {disaster.location.address && (
                  <p><strong>Address:</strong> {disaster.location.address}</p>
                )}
                {disaster.location.city && (
                  <p><strong>City:</strong> {disaster.location.city}</p>
                )}
                {disaster.location.state && (
                  <p><strong>State:</strong> {disaster.location.state}</p>
                )}
                {disaster.location.country && (
                  <p><strong>Country:</strong> {disaster.location.country}</p>
                )}
                <p>
                  <strong>Coordinates:</strong>{' '}
                  {disaster.location.coordinates && disaster.location.coordinates.length === 2
                    ? `${disaster.location.coordinates[1].toFixed(6)}, ${disaster.location.coordinates[0].toFixed(6)}`
                    : disaster.location.latitude && disaster.location.longitude
                    ? `${disaster.location.latitude.toFixed(6)}, ${disaster.location.longitude.toFixed(6)}`
                    : 'N/A'}
                </p>
              </div>
              
              {hasValidCoordinates && apiKey && (
                <div className="location-map">
                  <LoadScript googleMapsApiKey={apiKey}>
                    <GoogleMap
                      mapContainerStyle={{
                        width: '100%',
                        height: '400px',
                        borderRadius: '8px',
                      }}
                      center={getMapCenter}
                      zoom={14}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: true,
                        fullscreenControl: true,
                      }}
                    >
                      <Marker
                        position={getMapCenter}
                        title={disaster.title}
                      />
                    </GoogleMap>
                  </LoadScript>
                </div>
              )}
              
              {hasValidCoordinates && !apiKey && (
                <div className="map-placeholder">
                  <p>📍 Map view requires Google Maps API key</p>
                  <p className="map-placeholder-small">
                    Set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file to enable map view
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="info-card">
            <h3>Details</h3>
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value capitalize">{disaster.type}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Severity:</span>
              <span
                className="info-value"
                style={{ color: getSeverityColor(disaster.severity) }}
              >
                {disaster.severity.toUpperCase()}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">{disaster.status.toUpperCase()}</span>
            </div>
            {disaster.affectedCount > 0 && (
              <div className="info-item">
                <span className="info-label">Affected:</span>
                <span className="info-value">{disaster.affectedCount} people</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Reported:</span>
              <span className="info-value">
                {new Date(disaster.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {disaster.reportedBy && (
            <div className="info-card">
              <h3>Reported By</h3>
              <p>{disaster.reportedBy.name}</p>
              <p className="text-muted">{disaster.reportedBy.email}</p>
            </div>
          )}

          <Link to="/help-requests/create" className="btn-help">
            Request Help for This Disaster →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisasterDetail;

