import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { teacherAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import { HiStar, HiLocationMarker } from 'react-icons/hi';

const mapContainerStyle = { width: '100%', height: 'calc(100vh - var(--app-nav-height))' };
const defaultCenter = { lat: 26.9124, lng: 75.7873 }; // Jaipur

const MapView = () => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(defaultCenter);

  // Support both Vite and Next-style public env names.
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_KEY ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    '';
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const fetchMarkers = useCallback(async () => {
    try {
      const { data } = await teacherAPI.getMapMarkers({ lat: center.lat, lng: center.lng, radius: 30 });
      setMarkers(data.markers || []);
    } catch {
      setMarkers([]);
    }
  }, [center.lat, center.lng]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  const buildIcon = useCallback((svg, width, height) => {
    const icon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
    };
    if (window.google?.maps?.Size) {
      icon.scaledSize = new window.google.maps.Size(width, height);
    }
    return icon;
  }, []);

  // Fallback when no Google Maps API key
  if (!apiKey) {
    return (
      <div className="ds-page">
        <div className="ds-container py-6">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">📍 Map View</h1>
          <div className="ds-card p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-surface-800">Google Maps API Key Required</h3>
              <p className="text-surface-500 mt-2 max-w-md mx-auto">Add your Google Maps API key to <code className="bg-surface-100 px-2 py-0.5 rounded text-sm">VITE_GOOGLE_MAPS_KEY</code> in your client .env file to enable the interactive map.</p>
               <Link to="/tutors" className="inline-block mt-6 ds-btn ds-btn-primary">Browse Tutors Instead</Link>
            </div>
            {/* Show list view of markers */}
            {markers.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {markers.map(m => (
                  <Link key={m._id} to={`/tutor/${m._id}`} className="p-4 bg-surface-50 rounded-xl hover:bg-primary-50 transition-all flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center"><HiLocationMarker className="text-primary-500" /></div>
                    <div><p className="font-semibold text-surface-800 text-sm">{m.name}</p><p className="text-xs text-surface-500">{m.subjects?.join(', ')} • {m.distance} km</p></div>
                    <div className="ml-auto flex items-center gap-1"><HiStar className="text-yellow-400 text-sm" /><span className="text-sm font-medium">{m.rating?.toFixed(1)}</span></div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="ds-page">
        <div className="ds-container max-w-4xl py-6">
          <div className="ds-card p-6">
            <h2 className="text-lg font-bold text-danger-500">Unable to load Google Map</h2>
            <p className="text-sm text-surface-600 mt-2">
              Check that Google Maps JavaScript API is enabled, billing is active, and your key restrictions allow this domain.
            </p>
            <p className="text-xs text-surface-500 mt-2 break-all">
              {loadError.message}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center pt-24 sm:pt-28"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={13} center={center}
        options={{ styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }], disableDefaultUI: false, zoomControl: true }}>
        {/* User location marker */}
        <Marker
          position={center}
          icon={buildIcon(
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%234f46e5"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="12" fill="%234f46e5" opacity="0.3"/></svg>',
            24,
            24
          )}
        />

        {markers.map(m => (
          <Marker
            key={m._id}
            position={{ lat: m.lat, lng: m.lng }}
            onClick={() => setSelected(m)}
            icon={buildIcon(
              `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="${m.isVerified ? '%2310b981' : '%236366f1'}"/><circle cx="16" cy="14" r="6" fill="white"/></svg>`,
              32,
              40
            )}
          />
        ))}

        {selected && (
          <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
            <div className="p-2 min-w-48">
              <h3 className="font-bold text-surface-900">{selected.name}</h3>
              <p className="text-xs text-surface-500 mt-1">{selected.subjects?.join(', ')}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1"><HiStar className="text-yellow-400" /> {selected.rating?.toFixed(1)}</span>
                <span>{selected.distance} km away</span>
                <span>₹{selected.fees}/mo</span>
              </div>
              <Link to={`/tutor/${selected._id}`} className="block mt-3 text-center py-1.5 bg-primary-500 text-white text-xs font-semibold rounded-lg">View Profile</Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
