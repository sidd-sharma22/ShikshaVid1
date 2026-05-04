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
    } catch {
      toast.error('Failed to send message');
    } finally { setLoading(false); }
  };

  return (
    <div className="ds-page">
      <div className="ds-container max-w-5xl py-8">
        <div className="text-center mb-10">
          <h1 className="ds-heading-lg">Contact <span className="gradient-text">Us</span></h1>
          <p className="ds-text-muted mt-2">Have a question? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="ds-card p-6">
              <h3 className="ds-heading-md mb-4">Get in Touch</h3>
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
            <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Are you a Teacher?</h3>
              <p className="text-white/80 text-sm">Join ShikshaVid and reach thousands of students in your city. Register today!</p>
            </div>
          </div>

          {/* Form */}
          <div className="ds-card p-6">
            {sent ? (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-surface-800">Message Sent!</h3>
                <p className="text-surface-500 mt-2">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 ds-btn ds-btn-outline">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="ds-label">Name</label>
                  <div className="ds-input-shell">
                    <HiUser className="text-surface-400 text-lg shrink-0" />
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="ds-input-field" placeholder="Your name" />
                  </div>
                </div>
                <div>
                  <label className="ds-label">Email</label>
                  <div className="ds-input-shell">
                    <HiMail className="text-surface-400 text-lg shrink-0" />
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="ds-input-field" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="ds-label">Message</label>
                  <div className="rounded-xl border border-surface-200 bg-white px-3 pt-3 transition-all focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
                    <div className="flex items-start gap-2">
                      <HiChat className="text-surface-400 text-lg mt-1 shrink-0" />
                      <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="ds-input-field resize-none px-0 pt-0" rows={5} placeholder="Your message..." />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full ds-btn ds-btn-primary py-3">
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
