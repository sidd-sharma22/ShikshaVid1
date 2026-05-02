import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { teacherAPI, reviewAPI, bookingAPI, leadAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { HiStar, HiLocationMarker, HiBadgeCheck, HiPhone, HiClock, HiCurrencyRupee, HiAcademicCap, HiCalendar } from 'react-icons/hi';
import { FaWhatsapp, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TutorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', subject: '', notes: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, rRes] = await Promise.all([
          teacherAPI.getById(id),
          reviewAPI.getByTeacher(id)
        ]);
        setTeacher(tRes.data.teacher);
        setReviews(rRes.data.reviews || []);
      } catch { toast.error('Failed to load profile'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to book');
    try {
      await bookingAPI.create({ teacherId: id, ...bookingForm });
      toast.success('Demo class booked! Check your email.');
      setShowBooking(false);
      setBookingForm({ date: '', time: '', subject: '', notes: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    try {
      const { data } = await reviewAPI.create({ teacherId: id, ...reviewForm });
      setReviews([data.review, ...reviews]);
      toast.success('Review submitted!');
      setShowReview(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Review failed'); }
  };

  const trackLead = async (type) => {
    if (!user) return;
    try { await leadAPI.track({ teacherId: id, type }); } catch {}
  };

  if (loading) return (
    <div className="min-h-screen pt-24 sm:pt-28 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (!teacher) return (
    <div className="min-h-screen pt-24 sm:pt-28 flex items-center justify-center">
      <p className="text-surface-500">Teacher not found</p>
    </div>
  );

  const tUser = teacher.userId || {};

  return (
    <div className="min-h-screen bg-surface-50 pt-24 sm:pt-28 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-32 sm:h-40" />
          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-white">
                <span className="text-3xl font-bold gradient-text">{(tUser.name || 'T')[0]}</span>
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-surface-900">{tUser.name}</h1>
                  {teacher.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                      <HiBadgeCheck /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-surface-500 flex-wrap">
                  <span className="flex items-center gap-1"><HiStar className="text-yellow-400" /> {teacher.rating?.toFixed(1)} ({teacher.totalReviews} reviews)</span>
                  <span className="flex items-center gap-1"><HiClock /> {teacher.experience} yrs exp</span>
                  <span className="flex items-center gap-1"><HiCurrencyRupee /> ₹{teacher.fees}/mo</span>
                  {teacher.location?.address && <span className="flex items-center gap-1"><HiLocationMarker className="text-primary-500" /> {teacher.location.address}</span>}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => setShowBooking(true)} className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center gap-2">
                <HiCalendar /> Book Demo Class
              </button>
              <a href={`https://wa.me/91${tUser.phone || ''}`} target="_blank" rel="noreferrer" onClick={() => trackLead('whatsapp')} className="px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-500/25 flex items-center gap-2">
                <FaWhatsapp /> WhatsApp
              </a>
              <a href={`tel:+91${tUser.phone || ''}`} onClick={() => trackLead('call')} className="px-5 py-2.5 border border-surface-200 text-surface-700 text-sm font-semibold rounded-xl hover:bg-surface-50 flex items-center gap-2">
                <HiPhone /> Call
              </a>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* About */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100 animate-fade-in-up">
            <h3 className="text-lg font-bold text-surface-800 mb-3">About</h3>
            <p className="text-sm text-surface-600 leading-relaxed">{teacher.bio || 'No bio provided.'}</p>
            <div className="mt-4 space-y-3">
              <div><span className="text-xs font-medium text-surface-400">Subjects</span>
                <div className="flex flex-wrap gap-1.5 mt-1">{teacher.subjects?.map((s,i) => <span key={i} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">{s}</span>)}</div>
              </div>
              {teacher.qualifications?.length > 0 && (
                <div><span className="text-xs font-medium text-surface-400">Qualifications</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">{teacher.qualifications.map((q,i) => <span key={i} className="px-2.5 py-1 bg-surface-100 text-surface-600 rounded-lg text-xs">{q}</span>)}</div>
                </div>
              )}
              {teacher.languages?.length > 0 && (
                <div><span className="text-xs font-medium text-surface-400">Languages</span>
                  <p className="text-sm text-surface-600 mt-1">{teacher.languages.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Demo Video */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100 animate-fade-in-up">
            <h3 className="text-lg font-bold text-surface-800 mb-3 flex items-center gap-2"><FaYoutube className="text-red-500" /> Demo Video</h3>
            {teacher.demoVideoUrl ? (
              <div className="aspect-video rounded-xl overflow-hidden bg-surface-100">
                <iframe src={teacher.demoVideoUrl.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title="Demo" />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-surface-100 flex items-center justify-center">
                <p className="text-surface-400 text-sm">No demo video available</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100 mt-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-surface-800">Reviews ({reviews.length})</h3>
            {user && user.role === 'student' && (
              <button onClick={() => setShowReview(!showReview)} className="text-sm font-medium text-primary-600 hover:text-primary-700">Write Review</button>
            )}
          </div>
          {showReview && (
            <form onSubmit={handleReview} className="mb-6 p-4 bg-surface-50 rounded-xl animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-surface-700">Rating:</span>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setReviewForm({...reviewForm, rating: n})} className={`text-xl ${n <= reviewForm.rating ? 'text-yellow-400' : 'text-surface-300'}`}>★</button>
                ))}
              </div>
              <textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} placeholder="Write your review..." required className="w-full p-3 rounded-xl border border-surface-200 text-sm outline-none focus:border-primary-400 resize-none" rows={3} />
              <button type="submit" className="mt-3 px-5 py-2 bg-primary-500 text-white text-sm font-semibold rounded-xl">Submit Review</button>
            </form>
          )}
          <div className="space-y-4">
            {reviews.length === 0 ? <p className="text-sm text-surface-400">No reviews yet.</p> : reviews.map((r, i) => (
              <div key={i} className="p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-700">{r.studentId?.name || 'Student'}</span>
                  <div className="flex items-center gap-1">{[...Array(5)].map((_,j) => <HiStar key={j} className={j < r.rating ? 'text-yellow-400' : 'text-surface-300'} />)}</div>
                </div>
                <p className="text-sm text-surface-600 mt-2">{r.comment}</p>
                <p className="text-xs text-surface-400 mt-2">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in-up">
              <h3 className="text-lg font-bold text-surface-800 mb-4">Book Demo Class</h3>
              <form onSubmit={handleBooking} className="space-y-4">
                <div><label className="text-sm font-medium text-surface-700 block mb-1">Date</label><input type="date" required value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none" /></div>
                <div><label className="text-sm font-medium text-surface-700 block mb-1">Time</label><select required value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none">
                  <option value="">Select time</option>{['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                </select></div>
                <div><label className="text-sm font-medium text-surface-700 block mb-1">Subject</label><select value={bookingForm.subject} onChange={e => setBookingForm({...bookingForm, subject: e.target.value})} className="w-full py-2.5 px-3 rounded-xl border border-surface-200 text-sm outline-none">
                  <option value="">Select subject</option>{teacher.subjects?.map(s => <option key={s} value={s}>{s}</option>)}
                </select></div>
                <textarea value={bookingForm.notes} onChange={e => setBookingForm({...bookingForm, notes: e.target.value})} placeholder="Any notes..." className="w-full p-3 rounded-xl border border-surface-200 text-sm outline-none resize-none" rows={2} />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowBooking(false)} className="flex-1 py-2.5 border border-surface-200 rounded-xl text-sm font-medium text-surface-600">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-md">Book Now</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorProfile;
