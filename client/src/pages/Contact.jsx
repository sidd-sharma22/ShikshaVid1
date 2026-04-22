import { useState } from 'react';
import { contactAPI } from '../utils/api';
import { HiMail, HiUser, HiChat, HiPhone, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success('Message sent successfully!');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface-50 pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-surface-900">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-surface-500 mt-2">Have a question? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100">
              <h3 className="text-lg font-bold text-surface-800 mb-4">Get in Touch</h3>
              <div className="space-y-4">
                {[
                  { icon: HiMail, label: 'Email', value: 'support@shikshavid.com' },
                  { icon: HiPhone, label: 'Phone', value: '+91 98765 43210' },
                  { icon: HiLocationMarker, label: 'Address', value: 'Jaipur, Rajasthan, India' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                      <item.icon className="text-primary-500" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-400">{item.label}</p>
                      <p className="text-sm font-medium text-surface-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Are you a Teacher?</h3>
              <p className="text-white/80 text-sm">Join ShikshaVid and reach thousands of students in your city. Register today!</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100">
            {sent ? (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-surface-800">Message Sent!</h3>
                <p className="text-surface-500 mt-2">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 px-5 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-surface-700 block mb-1.5">Name</label>
                  <div className="relative"><HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" /><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" placeholder="Your name" /></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 block mb-1.5">Email</label>
                  <div className="relative"><HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" /><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" placeholder="you@example.com" /></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700 block mb-1.5">Message</label>
                  <div className="relative"><HiChat className="absolute left-3.5 top-4 text-surface-400" /><textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm resize-none" rows={5} placeholder="Your message..." /></div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
