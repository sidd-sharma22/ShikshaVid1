import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { teacherAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import { HiStar, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const mapContainerStyle = { width: '100%', height: 'calc(100vh - 64px)' };
const defaultCenter = { lat: 26.9124, lng: 75.7873 }; // Jaipur

const MapView = () => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [mapRef, setMapRef] = useState(null);

  // For development without API key, show a fallback
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      const { data } = await teacherAPI.getMapMarkers({ lat: center.lat, lng: center.lng, radius: 30 });
      setMarkers(data.markers || []);
    } catch { setMarkers([]); }
  };

  const onMapLoad = useCallback((map) => { setMapRef(map); }, []);

  // Fallback when no Google Maps API key
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-surface-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-bold text-surface-900 mb-4">📍 Map View</h1>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-surface-800">Google Maps API Key Required</h3>
              <p className="text-surface-500 mt-2 max-w-md mx-auto">Add your Google Maps API key to <code className="bg-surface-100 px-2 py-0.5 rounded text-sm">VITE_GOOGLE_MAPS_KEY</code> in your client .env file to enable the interactive map.</p>
              <Link to="/tutors" className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl">Browse Tutors Instead</Link>
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

  if (loadError) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="text-red-500">Error loading maps</p></div>;
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="pt-16">
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={13} center={center} onLoad={onMapLoad}
        options={{ styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }], disableDefaultUI: false, zoomControl: true }}>
        {/* User location marker */}
        <Marker position={center} icon={{ url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%234f46e5"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="12" fill="%234f46e5" opacity="0.3"/></svg>'), scaledSize: { width: 24, height: 24 } }} />

        {markers.map(m => (
          <Marker key={m._id} position={{ lat: m.lat, lng: m.lng }} onClick={() => setSelected(m)}
            icon={{ url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="${m.isVerified ? '%2310b981' : '%236366f1'}"/><circle cx="16" cy="14" r="6" fill="white"/></svg>`), scaledSize: { width: 32, height: 40 } }} />
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
