import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import { HiCalendar, HiClock, HiAcademicCap, HiCheckCircle, HiXCircle, HiExclamationCircle } from 'react-icons/hi';

const statusConfig = {
  pending: { icon: HiExclamationCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pending' },
  confirmed: { icon: HiCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Confirmed' },
  completed: { icon: HiCheckCircle, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Completed' },
  cancelled: { icon: HiXCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled' },
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await bookingAPI.getMyBookings();
        setBookings(data.bookings || []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await bookingAPI.updateStatus(id, 'cancelled');
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch {}
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 sm:pt-28">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-24 sm:pt-28 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-surface-500 mt-1">Track all your demo class bookings</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-surface-100 mb-6 overflow-x-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all capitalize ${
                filter === f ? 'bg-primary-50 text-primary-600' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              {f === 'all' ? `All (${bookings.length})` : `${f} (${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-100">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-surface-800">No bookings found</h3>
            <p className="text-surface-500 mt-2">
              {filter === 'all' ? "You haven't booked any demo classes yet." : `No ${filter} bookings.`}
            </p>
            <Link
              to="/tutors"
              className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-md"
            >
              Find Tutors
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking, i) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const teacherData = booking.teacherId;
              const teacherUser = teacherData?.userId;

              return (
                <div
                  key={booking._id}
                  className={`bg-white rounded-2xl border ${status.border} overflow-hidden animate-fade-in-up card-hover`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Teacher Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-primary-600">
                            {(teacherUser?.name || 'T')[0].toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-surface-800">
                              {teacherUser?.name || 'Teacher'}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              <StatusIcon className="text-sm" />
                              {status.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-surface-500">
                            <span className="flex items-center gap-1.5">
                              <HiCalendar className="text-primary-400" />
                              {new Date(booking.date).toLocaleDateString('en-IN', {
                                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <HiClock className="text-primary-400" />
                              {booking.time}
                            </span>
                            {booking.subject && (
                              <span className="flex items-center gap-1.5">
                                <HiAcademicCap className="text-primary-400" />
                                {booking.subject}
                              </span>
                            )}
                          </div>

                          {booking.notes && (
                            <p className="text-xs text-surface-400 mt-2 italic">"{booking.notes}"</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {teacherData?._id && (
                          <Link
                            to={`/tutor/${teacherData._id}`}
                            className="px-4 py-2 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 text-center transition-all"
                          >
                            View Tutor
                          </Link>
                        )}
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="px-4 py-2 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar with booking date */}
                  <div className="px-5 py-2 bg-surface-50 border-t border-surface-100">
                    <p className="text-xs text-surface-400">
                      Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
