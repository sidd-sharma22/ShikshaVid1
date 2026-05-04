import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { HiUsers, HiCalendar, HiStar, HiCurrencyRupee, HiTrendingUp, HiCheck, HiX, HiBadgeCheck, HiBan, HiTrash, HiEye } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);
  useEffect(() => {
    if (activeTab === 'teachers') fetchTeachers();
    else if (activeTab === 'bookings') fetchBookings();
    else if (activeTab === 'reviews') fetchReviews();
    else if (activeTab === 'contacts') fetchContacts();
    else if (activeTab === 'revenue') fetchRevenue();
  }, [activeTab]);

  const fetchDashboard = async () => {
    try { const { data } = await adminAPI.getDashboard(); setDashboard(data.dashboard); }
    catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };
  const fetchTeachers = async () => { try { const { data } = await adminAPI.getTeachers({}); setTeachers(data.teachers || []); } catch {} };
  const fetchBookings = async () => { try { const { data } = await adminAPI.getBookings({}); setBookings(data.bookings || []); } catch {} };
  const fetchReviews = async () => { try { const { data } = await adminAPI.getReviews(); setReviews(data.reviews || []); } catch {} };
  const fetchContacts = async () => { try { const { data } = await adminAPI.getContacts({}); setContacts(data.contacts || []); } catch {} };
  const fetchRevenue = async () => { try { const { data } = await adminAPI.getRevenue(); setRevenue(data); } catch {} };

  const handleTeacherAction = async (id, action) => {
    try {
      if (action === 'approve') await adminAPI.approveTeacher(id);
      else if (action === 'reject') await adminAPI.rejectTeacher(id);
      else if (action === 'verify') await adminAPI.verifyTeacher(id);
      else if (action === 'suspend') await adminAPI.suspendTeacher(id);
      else if (action === 'unsuspend') await adminAPI.unsuspendTeacher(id);
      else if (action === 'delete') { await adminAPI.deleteTeacher(id); }
      toast.success(`Teacher ${action}ed`);
      fetchTeachers();
    } catch { toast.error('Action failed'); }
  };

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'teachers', label: '👨‍🏫 Teachers' },
    { id: 'bookings', label: '📅 Bookings' },
    { id: 'reviews', label: '⭐ Reviews' },
    { id: 'revenue', label: '💰 Revenue' },
    { id: 'contacts', label: '📬 Contacts' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-28"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="ds-page">
      <div className="ds-container py-6">
        <h1 className="mb-6 text-2xl font-bold text-surface-900">Admin <span className="gradient-text">Panel</span></h1>

        {/* Tabs */}
        <div className="sticky top-[calc(var(--app-nav-height)+var(--space-2))] z-20 mb-6 flex gap-[var(--space-2)] overflow-x-auto rounded-xl border border-surface-200 bg-white/95 p-[var(--space-2)] shadow-sm backdrop-blur sm:top-[calc(var(--app-nav-height)+var(--space-3))]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-lg border-b-2 px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                  : 'border-transparent text-surface-500 hover:bg-surface-50 hover:text-surface-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboard && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: HiUsers, label: 'Students', value: dashboard.users.totalStudents, color: 'text-primary-500', bg: 'bg-primary-50' },
                { icon: HiUsers, label: 'Teachers', value: dashboard.users.totalTeachers, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { icon: HiCalendar, label: 'Bookings', value: dashboard.bookings.total, color: 'text-amber-500', bg: 'bg-amber-50' },
                { icon: HiCurrencyRupee, label: 'Revenue', value: `₹${dashboard.revenue.total}`, color: 'text-pink-500', bg: 'bg-pink-50' },
                { icon: HiTrendingUp, label: 'Total Leads', value: dashboard.leads.total, color: 'text-violet-500', bg: 'bg-violet-50' },
                { icon: HiStar, label: 'Reviews', value: dashboard.reviews, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                { icon: HiCalendar, label: 'Pending', value: dashboard.bookings.pending, color: 'text-orange-500', bg: 'bg-orange-50' },
                { icon: HiUsers, label: 'Active Teachers', value: dashboard.users.activeTeachers, color: 'text-teal-500', bg: 'bg-teal-50' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col items-start gap-[var(--space-3)]">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
                      <s.icon className={`text-xl ${s.color}`} />
                    </div>
                    <p className="text-3xl font-extrabold leading-none text-surface-900">{s.value}</p>
                    <p className="text-xs font-medium tracking-wide text-surface-500/75">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Teachers */}
            <div className="rounded-2xl border border-surface-200 bg-white p-7 shadow-sm">
              <h3 className="mb-5 text-xl font-extrabold tracking-tight text-surface-900">🏆 Top Teachers</h3>
              <div className="space-y-3">
                {dashboard.topTeachers?.map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-surface-100 bg-surface-50 p-4 transition-shadow hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-bold">{i + 1}</span>
                      <span className="font-medium text-surface-800 text-sm">{t.userId?.name || 'Teacher'}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm"><HiStar className="text-yellow-400" /> {t.rating?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 text-surface-500">
                  <tr><th className="text-left px-4 py-3 font-medium">Name</th><th className="text-left px-4 py-3 font-medium">Subjects</th><th className="text-left px-4 py-3 font-medium">Exp</th><th className="text-left px-4 py-3 font-medium">Fees</th><th className="text-left px-4 py-3 font-medium">Rating</th><th className="text-left px-4 py-3 font-medium">Leads</th><th className="text-left px-4 py-3 font-medium">Status</th><th className="text-left px-4 py-3 font-medium">Actions</th></tr>
                </thead>
                <tbody>
                  {teachers.map(t => (
                    <tr key={t._id} className="border-t border-surface-100 hover:bg-surface-50">
                      <td className="px-4 py-3 font-medium text-surface-800">{t.userId?.name}</td>
                      <td className="px-4 py-3 text-surface-600">{t.subjects?.slice(0,2).join(', ')}</td>
                      <td className="px-4 py-3">{t.experience}y</td>
                      <td className="px-4 py-3">₹{t.fees}</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-1"><HiStar className="text-yellow-400" />{t.rating?.toFixed(1)}</span></td>
                      <td className="px-4 py-3">{t.totalLeads}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {t.isApproved && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Approved</span>}
                          {!t.isApproved && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Pending</span>}
                          {t.isVerified && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Verified</span>}
                          {t.isSuspended && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Suspended</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {!t.isApproved && <button onClick={() => handleTeacherAction(t._id, 'approve')} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Approve"><HiCheck /></button>}
                          {!t.isVerified && t.isApproved && <button onClick={() => handleTeacherAction(t._id, 'verify')} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Verify"><HiBadgeCheck /></button>}
                          {!t.isSuspended ? <button onClick={() => handleTeacherAction(t._id, 'suspend')} className="p-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200" title="Suspend"><HiBan /></button> : <button onClick={() => handleTeacherAction(t._id, 'unsuspend')} className="p-1.5 bg-green-100 text-green-600 rounded-lg" title="Unsuspend"><HiCheck /></button>}
                          <button onClick={() => handleTeacherAction(t._id, 'delete')} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Delete"><HiTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 text-surface-500"><tr><th className="text-left px-4 py-3 font-medium">Student</th><th className="text-left px-4 py-3 font-medium">Teacher</th><th className="text-left px-4 py-3 font-medium">Date</th><th className="text-left px-4 py-3 font-medium">Time</th><th className="text-left px-4 py-3 font-medium">Subject</th><th className="text-left px-4 py-3 font-medium">Status</th></tr></thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} className="border-t border-surface-100 hover:bg-surface-50">
                      <td className="px-4 py-3 font-medium">{b.studentName || b.studentId?.name}</td>
                      <td className="px-4 py-3">{b.teacherId?.userId?.name}</td>
                      <td className="px-4 py-3">{new Date(b.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">{b.time}</td>
                      <td className="px-4 py-3">{b.subject}</td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : b.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-3 animate-fade-in-up">
            {reviews.map(r => (
              <div key={r._id} className="bg-white rounded-xl p-4 shadow-sm border border-surface-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-surface-800 text-sm">{r.studentId?.name}</span>
                    <span className="text-xs text-surface-400">→</span>
                    <span className="text-sm text-surface-600">{r.teacherId?.userId?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">{[...Array(5)].map((_,j) => <HiStar key={j} className={`text-sm ${j < r.rating ? 'text-yellow-400' : 'text-surface-300'}`} />)}</div>
                  <p className="text-sm text-surface-600 mt-2">{r.comment}</p>
                </div>
                <div className="flex gap-1">
                  {!r.isApproved && <button onClick={async () => { await adminAPI.approveReview(r._id); fetchReviews(); toast.success('Approved'); }} className="p-1.5 bg-green-100 text-green-600 rounded-lg"><HiCheck /></button>}
                  <button onClick={async () => { await adminAPI.deleteReview(r._id); fetchReviews(); toast.success('Deleted'); }} className="p-1.5 bg-red-100 text-red-600 rounded-lg"><HiTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && revenue && (
          <div className="animate-fade-in-up">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white mb-6">
              <p className="text-white/70 text-sm">Total Platform Revenue</p>
              <p className="text-4xl font-bold mt-1">₹{revenue.totalRevenue?.toLocaleString()}</p>
              <p className="text-white/60 text-sm mt-1">Based on 3% commission model</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-50"><tr><th className="text-left px-4 py-3 font-medium text-surface-500">Teacher</th><th className="text-left px-4 py-3 font-medium text-surface-500">Students</th><th className="text-left px-4 py-3 font-medium text-surface-500">Fees</th><th className="text-left px-4 py-3 font-medium text-surface-500">Commission</th></tr></thead>
                <tbody>
                  {revenue.revenueData?.map((r, i) => (
                    <tr key={i} className="border-t border-surface-100"><td className="px-4 py-3 font-medium">{r.teacherName}</td><td className="px-4 py-3">{r.enrolledStudents}</td><td className="px-4 py-3">₹{r.fees}/mo</td><td className="px-4 py-3 font-semibold text-primary-600">₹{r.commission}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-3 animate-fade-in-up">
            {contacts.map(c => (
              <div key={c._id} className="bg-white rounded-xl p-4 shadow-sm border border-surface-100">
                <div className="flex items-center justify-between">
                  <div><span className="font-medium text-surface-800 text-sm">{c.name}</span><span className="text-xs text-surface-400 ml-2">{c.email}</span></div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.status === 'new' ? 'bg-blue-100 text-blue-700' : c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                </div>
                <p className="text-sm text-surface-600 mt-2">{c.message}</p>
                <p className="text-xs text-surface-400 mt-2">{new Date(c.createdAt).toLocaleString('en-IN')}</p>
                {c.status === 'new' && (
                  <button onClick={async () => { await adminAPI.updateContact(c._id, { status: 'resolved' }); fetchContacts(); toast.success('Marked resolved'); }} className="mt-2 text-xs text-primary-600 font-medium">Mark Resolved</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
