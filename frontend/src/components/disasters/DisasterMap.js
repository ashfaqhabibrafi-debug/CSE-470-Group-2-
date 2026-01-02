import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import { getDisasters } from '../../services/disasterApi';
import './DisasterMap.css';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125, // Bangladesh default
};

const libraries = ['places'];

const DisasterMap = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetchDisasters();
    
    // Get user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Use default if geolocation fails
        }
      );
    }
  }, []);

  const fetchDisasters = async () => {
    try {
      setLoading(true);
      // Fetch only active/verified disasters
      const response = await getDisasters({ status: 'active' });
      const activeDisasters = (response.data || []).filter(
        d => d.status === 'active' || d.status === 'verified'
      );
      setDisasters(activeDisasters);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading(false);
    }
  };

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const getMarkerColor = (severity) => {
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

  const getDisasterIcon = (severity) => {
    const color = getMarkerColor(severity);
    return {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 'circle',
      scale: 8,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 2,
    };
  };

  if (loading) {
    return (
      <div className="disaster-map-container">
        <div className="loading">Loading map...</div>
      </div>
    );
  }

  // Use Google Maps API key from environment or use default
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  // If no API key, show a message
  if (!apiKey) {
    return (
      <div className="disaster-map-container">
        <div className="map-header">
          <h1>Disaster Map</h1>
          <p>View reported disasters on an interactive map</p>
        </div>
        <div className="no-api-key">
          <p>⚠️ Google Maps API key not configured.</p>
          <p>Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file to enable the map.</p>
          <p>For now, you can view disasters in the list view.</p>
          <Link to="/disasters" className="btn-primary">View Disaster List</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="disaster-map-container">
      <div className="map-header">
        <h1>Disaster Map</h1>
        <p>View reported disasters on an interactive map</p>
        <div className="map-controls">
          <button onClick={fetchDisasters} className="btn-refresh">
            🔄 Refresh
          </button>
          <Link to="/disasters" className="btn-list-view">
            📋 List View
          </Link>
        </div>
      </div>

      <div className="map-wrapper">
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={7}
            onLoad={onMapLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {disasters.map((disaster) => {
              if (!disaster.location?.coordinates || disaster.location.coordinates.length < 2) {
                return null;
              }

              const [lng, lat] = disaster.location.coordinates;
              const position = { lat, lng };

              return (
                <Marker
                  key={disaster._id}
                  position={position}
                  icon={getDisasterIcon(disaster.severity)}
                  onClick={() => setSelectedDisaster(disaster)}
                />
              );
            })}

            {selectedDisaster && selectedDisaster.location?.coordinates && (
              <InfoWindow
                position={{
                  lat: selectedDisaster.location.coordinates[1],
                  lng: selectedDisaster.location.coordinates[0],
                }}
                onCloseClick={() => setSelectedDisaster(null)}
              >
                <div className="info-window">
                  <h3>{selectedDisaster.title}</h3>
                  <p className="disaster-type">{selectedDisaster.type}</p>
                  <p className="disaster-severity">
                    Severity: <span style={{ color: getMarkerColor(selectedDisaster.severity) }}>
                      {selectedDisaster.severity}
                    </span>
                  </p>
                  <p className="disaster-description">
                    {selectedDisaster.description.length > 100
                      ? `${selectedDisaster.description.substring(0, 100)}...`
                      : selectedDisaster.description}
                  </p>
                  {selectedDisaster.location?.address && (
                    <p className="disaster-location">📍 {selectedDisaster.location.address}</p>
                  )}
                  <Link
                    to={`/disasters/${selectedDisaster._id}`}
                    className="btn-view-details"
                    onClick={() => setSelectedDisaster(null)}
                  >
                    View Details →
                  </Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="map-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-marker" style={{ backgroundColor: '#d32f2f' }}></span>
            <span>Critical</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker" style={{ backgroundColor: '#f57c00' }}></span>
            <span>High</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker" style={{ backgroundColor: '#fbc02d' }}></span>
            <span>Medium</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker" style={{ backgroundColor: '#388e3c' }}></span>
            <span>Low</span>
          </div>
        </div>
      </div>

      <div className="map-stats">
        <p>
          Showing <strong>{disasters.length}</strong> active disaster{disasters.length !== 1 ? 's' : ''} on the map
        </p>
      </div>
    </div>
  );
};

export default DisasterMap;

