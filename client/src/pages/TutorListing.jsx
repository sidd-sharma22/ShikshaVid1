import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { teacherAPI } from '../utils/api';
import TutorCard from '../components/TutorCard';
import { HiSearch, HiAdjustments } from 'react-icons/hi';

const TutorListing = () => {
  const [searchParams] = useSearchParams();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 26.9124, lng: 75.7873 });
  const [filters, setFilters] = useState({
    subject: searchParams.get('subject') || '',
    maxDistance: 30, minExp: '', maxFees: '', minRating: '', sort: 'bestfit'
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  useEffect(() => { fetchTeachers(); }, [userLocation, filters.sort]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = { lat: userLocation.lat, lng: userLocation.lng, maxDistance: filters.maxDistance,
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.minExp && { minExp: filters.minExp }),
        ...(filters.maxFees && { maxFees: filters.maxFees }),
        ...(filters.minRating && { minRating: filters.minRating }),
        sort: filters.sort };
      const { data } = await teacherAPI.search(params);
      setTeachers(data.teachers || []);
    } catch { setTeachers([]); }
    finally { setLoading(false); }
  };

  const sortOptions = [
    { value: 'bestfit', label: 'Best Fit' }, { value: 'distance', label: 'Nearest' },
    { value: 'rating', label: 'Top Rated' }, { value: 'fees', label: 'Lowest Fees' },
    { value: 'experience', label: 'Most Exp.' },
  ];

  return (
    <div className="ds-page">
      <div className="ds-container py-6">
        <div className="mb-6">
          <h1 className="ds-heading-lg">Find <span className="gradient-text">Best-Fit Tutors</span></h1>
          <p className="ds-text-muted mt-1">Smart recommendations based on your needs</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchTeachers(); }} className="ds-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="ds-input-shell flex-1">
              <HiSearch className="text-surface-400" />
              <input type="text" value={filters.subject} onChange={e => setFilters({...filters, subject: e.target.value})} placeholder="Search by subject..." className="ds-input-field" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowFilters(!showFilters)} className={`ds-btn ds-btn-outline ${showFilters ? '!border-primary-400 !bg-primary-50 !text-primary-600' : '!text-surface-600'}`}><HiAdjustments /> Filters</button>
              <button type="submit" className="ds-btn ds-btn-primary">Search</button>
            </div>
          </div>
          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-surface-100 animate-fade-in-up">
              <div><label className="text-xs font-medium text-surface-500 mb-1 block">Max Distance</label><input type="range" min="1" max="50" value={filters.maxDistance} onChange={e => setFilters({...filters, maxDistance: e.target.value})} className="w-full accent-primary-500" /><span className="text-xs text-surface-400">{filters.maxDistance} km</span></div>
              <div><label className="text-xs font-medium text-surface-500 mb-1 block">Min Experience</label><select value={filters.minExp} onChange={e => setFilters({...filters, minExp: e.target.value})} className="w-full py-2 px-3 rounded-lg border border-surface-200 text-sm outline-none"><option value="">Any</option><option value="2">2+ yrs</option><option value="5">5+ yrs</option><option value="10">10+ yrs</option></select></div>
              <div><label className="text-xs font-medium text-surface-500 mb-1 block">Max Fees</label><select value={filters.maxFees} onChange={e => setFilters({...filters, maxFees: e.target.value})} className="w-full py-2 px-3 rounded-lg border border-surface-200 text-sm outline-none"><option value="">Any</option><option value="1500">≤₹1,500</option><option value="2500">≤₹2,500</option><option value="5000">≤₹5,000</option></select></div>
              <div><label className="text-xs font-medium text-surface-500 mb-1 block">Min Rating</label><select value={filters.minRating} onChange={e => setFilters({...filters, minRating: e.target.value})} className="w-full py-2 px-3 rounded-lg border border-surface-200 text-sm outline-none"><option value="">Any</option><option value="3">3+★</option><option value="4">4+★</option><option value="4.5">4.5+★</option></select></div>
            </div>
          )}
        </form>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-sm text-surface-500">{loading ? 'Searching...' : `${teachers.length} tutors found`}</p>
          <div className="ds-card flex gap-1 p-1">
            {sortOptions.map(opt => (
              <button key={opt.value} onClick={() => setFilters({...filters, sort: opt.value})} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.sort === opt.value ? 'bg-primary-50 text-primary-600' : 'text-surface-500'}`}>{opt.label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (<div key={i} className="ds-card p-5 space-y-4"><div className="flex gap-4"><div className="w-14 h-14 rounded-2xl shimmer" /><div className="flex-1 space-y-2"><div className="h-4 w-32 rounded shimmer" /><div className="h-3 w-20 rounded shimmer" /></div></div><div className="h-20 rounded-xl shimmer" /><div className="h-10 rounded-xl shimmer" /></div>))}
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20"><div className="text-6xl mb-4">🔍</div><h3 className="text-xl font-bold text-surface-800">No tutors found</h3><p className="text-surface-500 mt-2">Try adjusting your filters</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((t, i) => (<div key={t._id} style={{animationDelay: `${i*0.05}s`}}><TutorCard teacher={t} /></div>))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorListing;
