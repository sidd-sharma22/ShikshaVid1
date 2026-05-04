import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { HiUsers, HiCalendar, HiStar, HiCurrencyRupee, HiTrendingUp, HiCheck, HiBadgeCheck, HiBan, HiTrash } from 'react-icons/hi';
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
      <div className="ds-container py-[var(--space-6)]">
        <div className="space-y-[var(--space-8)]">
          <h1 className="text-2xl font-bold text-surface-900">Admin <span className="gradient-text">Panel</span></h1>

          {/* Tabs */}
          <div className="sticky top-[calc(var(--app-nav-height)+var(--space-2))] z-20 border-b border-surface-200/90 bg-surface-50/90 py-[var(--space-2)] backdrop-blur-sm sm:top-[calc(var(--app-nav-height)+var(--space-3))]">
            <div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3 lg:grid-cols-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-lg border-b-2 px-[var(--space-3)] py-[var(--space-3)] text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-transparent text-surface-500 hover:bg-white hover:text-surface-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && dashboard && (
            <div className="space-y-[var(--space-8)] animate-fade-in-up">
              <div className="grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: HiUsers, label: 'Students', value: dashboard.users.totalStudents, color: 'text-primary-500', bg: 'bg-primary-50', tint: 'from-primary-50/40 to-white' },
                  { icon: HiUsers, label: 'Teachers', value: dashboard.users.totalTeachers, color: 'text-emerald-500', bg: 'bg-emerald-50', tint: 'from-emerald-50/40 to-white' },
                  { icon: HiCalendar, label: 'Bookings', value: dashboard.bookings.total, color: 'text-amber-500', bg: 'bg-amber-50', tint: 'from-amber-50/40 to-white' },
                  { icon: HiCurrencyRupee, label: 'Revenue', value: `₹${dashboard.revenue.total}`, color: 'text-pink-500', bg: 'bg-pink-50', tint: 'from-pink-50/40 to-white' },
                  { icon: HiTrendingUp, label: 'Total Leads', value: dashboard.leads.total, color: 'text-violet-500', bg: 'bg-violet-50', tint: 'from-violet-50/40 to-white' },
                  { icon: HiStar, label: 'Reviews', value: dashboard.reviews, color: 'text-yellow-500', bg: 'bg-yellow-50', tint: 'from-yellow-50/35 to-white' },
                  { icon: HiCalendar, label: 'Pending', value: dashboard.bookings.pending, color: 'text-orange-500', bg: 'bg-orange-50', tint: 'from-orange-50/40 to-white' },
                  { icon: HiUsers, label: 'Active Teachers', value: dashboard.users.activeTeachers, color: 'text-teal-500', bg: 'bg-teal-50', tint: 'from-teal-50/40 to-white' },
                ].map((s, i) => (
                  <div key={i} className={`min-h-[12rem] rounded-2xl border border-surface-200 bg-gradient-to-br p-6 shadow-sm transition-shadow hover:shadow-md ${s.tint}`}>
                    <div className="flex h-full flex-col items-center justify-center gap-[var(--space-3)] text-center">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.bg}`}>
                        <s.icon className={`text-2xl ${s.color}`} />
                      </div>
                      <p className="text-4xl font-extrabold leading-none text-surface-900">{s.value}</p>
                      <p className="text-sm font-medium tracking-wide text-surface-500/75">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Teachers */}
              <section className="space-y-[var(--space-4)]">
                <h2 className="text-xl font-extrabold tracking-tight text-surface-900">Top Teachers</h2>
                <div className="divide-y divide-surface-200 border-y border-surface-200">
                  {dashboard.topTeachers?.map((t, i) => (
                    <div key={i} className="flex items-center justify-between gap-[var(--space-4)] py-[var(--space-4)]">
                      <div className="flex items-center gap-[var(--space-3)]">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 text-sm font-bold text-white">{i + 1}</span>
                        <span className="text-base font-medium text-surface-800">{t.userId?.name || 'Teacher'}</span>
                      </div>
                      <span className="flex items-center gap-1 text-base"><HiStar className="text-base text-yellow-400" /> {t.rating?.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Teachers Tab */}
          {activeTab === 'teachers' && (
            <section className="space-y-[var(--space-4)] animate-fade-in-up">
              <h2 className="text-xl font-bold text-surface-900">Teachers</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[68rem] text-base">
                  <thead className="border-y border-surface-200 bg-surface-50/70 text-surface-500">
                    <tr>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Name</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Subjects</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Exp</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Fees</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Rating</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Leads</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Status</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map(t => (
                      <tr key={t._id} className="border-b border-surface-200/80 hover:bg-surface-50/70">
                        <td className="px-[var(--space-5)] py-[var(--space-4)] font-medium text-surface-800">{t.userId?.name}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)] text-surface-600">{t.subjects?.slice(0, 2).join(', ')}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">{t.experience}y</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">₹{t.fees}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]"><span className="flex items-center gap-1"><HiStar className="text-base text-yellow-400" />{t.rating?.toFixed(1)}</span></td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">{t.totalLeads}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">
                          <div className="flex flex-wrap gap-2">
                            {t.isApproved && <span className="rounded bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Approved</span>}
                            {!t.isApproved && <span className="rounded bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">Pending</span>}
                            {t.isVerified && <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">Verified</span>}
                            {t.isSuspended && <span className="rounded bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Suspended</span>}
                          </div>
                        </td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">
                          <div className="flex items-center gap-2">
                            {!t.isApproved && <button onClick={() => handleTeacherAction(t._id, 'approve')} className="rounded-lg bg-green-100 p-2 text-base text-green-600 hover:bg-green-200" title="Approve"><HiCheck /></button>}
                            {!t.isVerified && t.isApproved && <button onClick={() => handleTeacherAction(t._id, 'verify')} className="rounded-lg bg-blue-100 p-2 text-base text-blue-600 hover:bg-blue-200" title="Verify"><HiBadgeCheck /></button>}
                            {!t.isSuspended ? <button onClick={() => handleTeacherAction(t._id, 'suspend')} className="rounded-lg bg-orange-100 p-2 text-base text-orange-600 hover:bg-orange-200" title="Suspend"><HiBan /></button> : <button onClick={() => handleTeacherAction(t._id, 'unsuspend')} className="rounded-lg bg-green-100 p-2 text-base text-green-600" title="Unsuspend"><HiCheck /></button>}
                            <button onClick={() => handleTeacherAction(t._id, 'delete')} className="rounded-lg bg-red-100 p-2 text-base text-red-600 hover:bg-red-200" title="Delete"><HiTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <section className="space-y-[var(--space-4)] animate-fade-in-up">
              <h2 className="text-xl font-bold text-surface-900">Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[62rem] text-base">
                  <thead className="border-y border-surface-200 bg-surface-50/70 text-surface-500">
                    <tr>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Student</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Teacher</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Date</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Time</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Subject</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id} className="border-b border-surface-200/80 hover:bg-surface-50/70">
                        <td className="px-[var(--space-5)] py-[var(--space-4)] font-medium">{b.studentName || b.studentId?.name}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">{b.teacherId?.userId?.name}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">{new Date(b.date).toLocaleDateString('en-IN')}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">{b.time}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">{b.subject}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]"><span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : b.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <section className="space-y-[var(--space-4)] animate-fade-in-up">
              <h2 className="text-xl font-bold text-surface-900">Reviews</h2>
              <div className="divide-y divide-surface-200 border-y border-surface-200">
                {reviews.map(r => (
                  <div key={r._id} className="flex items-start justify-between gap-[var(--space-4)] py-[var(--space-4)]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-surface-800">{r.studentId?.name}</span>
                        <span className="text-xs text-surface-400">→</span>
                        <span className="text-base text-surface-600">{r.teacherId?.userId?.name}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1">{[...Array(5)].map((_, j) => <HiStar key={j} className={`text-base ${j < r.rating ? 'text-yellow-400' : 'text-surface-300'}`} />)}</div>
                      <p className="mt-2 text-base text-surface-600">{r.comment}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!r.isApproved && <button onClick={async () => { await adminAPI.approveReview(r._id); fetchReviews(); toast.success('Approved'); }} className="rounded-lg bg-green-100 p-2 text-base text-green-600"><HiCheck /></button>}
                      <button onClick={async () => { await adminAPI.deleteReview(r._id); fetchReviews(); toast.success('Deleted'); }} className="rounded-lg bg-red-100 p-2 text-base text-red-600"><HiTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && revenue && (
            <section className="space-y-[var(--space-5)] animate-fade-in-up">
              <h2 className="text-xl font-bold text-surface-900">Revenue</h2>
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-[var(--space-6)] py-[var(--space-6)] text-white">
                <p className="text-sm text-white/70">Total Platform Revenue</p>
                <p className="mt-1 text-4xl font-bold">₹{revenue.totalRevenue?.toLocaleString()}</p>
                <p className="mt-1 text-sm text-white/60">Based on 3% commission model</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[54rem] text-base">
                  <thead className="border-y border-surface-200 bg-surface-50/70">
                    <tr>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold text-surface-500">Teacher</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold text-surface-500">Students</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold text-surface-500">Fees</th>
                      <th className="px-[var(--space-5)] py-[var(--space-3)] text-left font-semibold text-surface-500">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenue.revenueData?.map((r, i) => (
                      <tr key={i} className="border-b border-surface-200/80">
                        <td className="px-[var(--space-5)] py-[var(--space-4)] font-medium">{r.teacherName}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">{r.enrolledStudents}</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)]">₹{r.fees}/mo</td>
                        <td className="px-[var(--space-5)] py-[var(--space-4)] font-semibold text-primary-600">₹{r.commission}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <section className="space-y-[var(--space-4)] animate-fade-in-up">
              <h2 className="text-xl font-bold text-surface-900">Contacts</h2>
              <div className="divide-y divide-surface-200 border-y border-surface-200">
                {contacts.map(c => (
                  <div key={c._id} className="space-y-[var(--space-2)] py-[var(--space-4)]">
                    <div className="flex items-center justify-between gap-[var(--space-4)]">
                      <div>
                        <span className="text-base font-medium text-surface-800">{c.name}</span>
                        <span className="ml-2 text-sm text-surface-400">{c.email}</span>
                      </div>
                      <span className={`rounded px-2.5 py-1 text-xs font-medium ${c.status === 'new' ? 'bg-blue-100 text-blue-700' : c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                    </div>
                    <p className="text-base text-surface-600">{c.message}</p>
                    <p className="text-sm text-surface-400">{new Date(c.createdAt).toLocaleString('en-IN')}</p>
                    {c.status === 'new' && (
                      <button onClick={async () => { await adminAPI.updateContact(c._id, { status: 'resolved' }); fetchContacts(); toast.success('Marked resolved'); }} className="text-sm font-medium text-primary-600">Mark Resolved</button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
