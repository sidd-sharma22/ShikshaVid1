import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiUser, HiMail, HiLockClosed, HiPhone, HiAcademicCap } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signup(form);
      toast.success(`Welcome, ${user.name}! Account created.`);
      if (user.role === 'teacher') navigate('/dashboard');
      else navigate('/tutors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 pt-24 sm:pt-28 pb-10">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl shadow-primary-500/30 mb-4">
            <HiAcademicCap className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-surface-900">Create Account</h1>
          <p className="text-surface-500 mt-1">Join ShikshaVid today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-surface-200/60 p-6 sm:p-8 border border-surface-100">
          {/* Role Toggle */}
          <div className="flex bg-surface-100 rounded-xl p-1 mb-6">
            {['student', 'teacher'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, role })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  form.role === role
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {role === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
              <div className="flex items-center rounded-xl border border-surface-200 bg-white px-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                <HiUser className="text-surface-400 text-lg shrink-0" />
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full py-3.5 pl-2 bg-transparent outline-none text-sm text-surface-800 placeholder:text-surface-400"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="flex items-center rounded-xl border border-surface-200 bg-white px-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                <HiMail className="text-surface-400 text-lg shrink-0" />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full py-3.5 pl-2 bg-transparent outline-none text-sm text-surface-800 placeholder:text-surface-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone</label>
              <div className="flex items-center rounded-xl border border-surface-200 bg-white px-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                <HiPhone className="text-surface-400 text-lg shrink-0" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full py-3.5 pl-2 bg-transparent outline-none text-sm text-surface-800 placeholder:text-surface-400"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <div className="flex items-center rounded-xl border border-surface-200 bg-white px-3 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                <HiLockClosed className="text-surface-400 text-lg shrink-0" />
                <input
                  type="password" required minLength={6}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full py-3.5 pl-2 bg-transparent outline-none text-sm text-surface-800 placeholder:text-surface-400"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
