import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { teacherAPI, bookingAPI } from '../utils/api';
import { HiCalendar, HiUsers, HiStar, HiClock, HiCheck, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    subjects: '', experience: '', fees: '', bio: '',
    qualifications: '', demoVideoUrl: '', teachingMode: 'offline',
    languages: '', lat: '26.9124', lng: '75.7873', address: '', city: 'Jaipur'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pRes, bRes] = await Promise.all([
        teacherAPI.getMyProfile().catch(() => null),
        bookingAPI.getTeacherBookings().catch(() => ({ data: { bookings: [] } }))
      ]);
      if (pRes?.data?.teacher) {
        setProfile(pRes.data.teacher);
        const t = pRes.data.teacher;
        setProfileForm({
          subjects: t.subjects?.join(', ') || '', experience: t.experience || '',
          fees: t.fees || '', bio: t.bio || '',
          qualifications: t.qualifications?.join(', ') || '',
          demoVideoUrl: t.demoVideoUrl || '', teachingMode: t.teachingMode || 'offline',
          languages: t.languages?.join(', ') || '',
          lat: t.location?.coordinates?.[1] || '26.9124',
          lng: t.location?.coordinates?.[0] || '75.7873',
          address: t.location?.address || '', city: t.location?.city || 'Jaipur'
        });
      } else { setShowProfileForm(true); }
      setBookings(bRes?.data?.bookings || []);
    } catch {} finally { setLoading(false); }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        subjects: profileForm.subjects.split(',').map(s => s.trim()).filter(Boolean),
        experience: parseInt(profileForm.experience),
        fees: parseInt(profileForm.fees),
        bio: profileForm.bio,
        qualifications: profileForm.qualifications.split(',').map(s => s.trim()).filter(Boolean),
        demoVideoUrl: profileForm.demoVideoUrl,
        teachingMode: profileForm.teachingMode,
        languages: profileForm.languages.split(',').map(s => s.trim()).filter(Boolean),
        location: {
          type: 'Point',
          coordinates: [parseFloat(profileForm.lng), parseFloat(profileForm.lat)],
          address: profileForm.address, city: profileForm.city
        }
      };
      if (profile) {
        await teacherAPI.updateProfile(payload);
        toast.success('Profile updated!');
      } else {
        await teacherAPI.createProfile(payload);
        toast.success('Profile created!');
      }
      fetchData();
      setShowProfileForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, status);
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;

  const stats = [
    { icon: HiStar, label: 'Rating', value: profile?.rating?.toFixed(1) || '0', color: 'text-yellow-500' },
    { icon: HiUsers, label: 'Total Leads', value: profile?.totalLeads || 0, color: 'text-primary-500' },
    { icon: HiCalendar, label: 'Bookings', value: profile?.demoBookings || 0, color: 'text-emerald-500' },
    { icon: HiClock, label: 'Enrolled', value: profile?.enrolledStudents || 0, color: 'text-accent-500' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Teacher Dashboard</h1>
            <p className="text-surface-500">Welcome, {user?.name}</p>
          </div>
          <button onClick={() => setShowProfileForm(!showProfileForm)} className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50">
            {profile ? 'Edit Profile' : 'Create Profile'}
          </button>
        </div>

        {!profile && !showProfileForm && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-yellow-800 font-medium">⚠️ Please create your teacher profile to start receiving bookings.</p>
            <button onClick={() => setShowProfileForm(true)} className="mt-3 px-5 py-2 bg-yellow-500 text-white rounded-xl text-sm font-semibold">Create Profile</button>
          </div>
        )}

        {showProfileForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100 mb-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-surface-800 mb-4">{profile ? 'Edit' : 'Create'} Profile</h3>
            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Subjects (comma separated)</label><input required value={profileForm.subjects} onChange={e => setProfileForm({...profileForm, subjects: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" placeholder="Mathematics, Physics" /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Experience (years)</label><input type="number" required value={profileForm.experience} onChange={e => setProfileForm({...profileForm, experience: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Monthly Fees (₹)</label><input type="number" required value={profileForm.fees} onChange={e => setProfileForm({...profileForm, fees: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Teaching Mode</label><select value={profileForm.teachingMode} onChange={e => setProfileForm({...profileForm, teachingMode: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none"><option value="offline">Offline</option><option value="online">Online</option><option value="both">Both</option></select></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Address</label><input value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" placeholder="Your area" /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">City</label><input value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Latitude</label><input value={profileForm.lat} onChange={e => setProfileForm({...profileForm, lat: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Longitude</label><input value={profileForm.lng} onChange={e => setProfileForm({...profileForm, lng: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" /></div>
              <div className="md:col-span-2"><label className="text-xs font-medium text-surface-500 block mb-1">Bio</label><textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none resize-none" rows={3} /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Qualifications (comma separated)</label><input value={profileForm.qualifications} onChange={e => setProfileForm({...profileForm, qualifications: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" /></div>
              <div><label className="text-xs font-medium text-surface-500 block mb-1">Languages</label><input value={profileForm.languages} onChange={e => setProfileForm({...profileForm, languages: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" placeholder="Hindi, English" /></div>
              <div className="md:col-span-2"><label className="text-xs font-medium text-surface-500 block mb-1">Demo Video URL</label><input value={profileForm.demoVideoUrl} onChange={e => setProfileForm({...profileForm, demoVideoUrl: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" placeholder="YouTube link" /></div>
              <div className="md:col-span-2 flex gap-3"><button type="button" onClick={() => setShowProfileForm(false)} className="px-5 py-2.5 border border-surface-200 rounded-xl text-sm font-medium text-surface-600">Cancel</button><button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-md">Save Profile</button></div>
            </form>
          </div>
        )}

        {/* Stats */}
        {profile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100">
                <s.icon className={`text-2xl ${s.color} mb-2`} />
                <p className="text-2xl font-bold text-surface-800">{s.value}</p>
                <p className="text-xs text-surface-400">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-100">
          <div className="px-6 py-4 border-b border-surface-100">
            <h3 className="text-lg font-bold text-surface-800">Demo Class Bookings</h3>
          </div>
          <div className="p-6">
            {bookings.length === 0 ? (
              <p className="text-center text-surface-400 py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b._id} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-surface-800 text-sm">{b.studentName || b.studentId?.name}</p>
                      <p className="text-xs text-surface-500">{b.subject} • {new Date(b.date).toLocaleDateString('en-IN')} at {b.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => updateBookingStatus(b._id, 'confirmed')} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><HiCheck /></button>
                          <button onClick={() => updateBookingStatus(b._id, 'cancelled')} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><HiX /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
