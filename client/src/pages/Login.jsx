import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiAcademicCap } from 'react-icons/hi';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const showDemoCredentials =
    import.meta.env.DEV || import.meta.env.VITE_SHOW_DEMO_CREDENTIALS === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/dashboard');
      else navigate('/tutors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ds-page-center">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl shadow-primary-500/30 mb-4">
            <HiAcademicCap className="text-white text-3xl" />
          </div>
          <h1 className="ds-heading-lg">Login</h1>
          <p className="ds-text-muted mt-1">Sign in to continue learning</p>
        </div>

        <div className="ds-card p-6 sm:p-8 shadow-xl shadow-surface-200/60">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="ds-label">Email</label>
              <div className="ds-input-shell">
                <HiMail className="text-surface-400 text-lg shrink-0" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="ds-input-field"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="ds-label">Password</label>
              <div className="ds-input-shell">
                <HiLockClosed className="text-surface-400 text-lg shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="ds-input-field pr-2"
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  onClick={() => setShowPass(!showPass)}
                  className="shrink-0 !border-0 !bg-transparent !px-2 !py-1 !text-surface-400 hover:!bg-surface-100 hover:!text-surface-600"
                >
                  {showPass ? <HiEyeOff /> : <HiEye />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">Sign Up</Link>
            </p>
          </div>

          {/* Quick login hints */}
          {showDemoCredentials && (
            <div className="mt-6 p-3 bg-surface-50 rounded-xl">
              <p className="text-xs font-medium text-surface-500 mb-2">Quick Login (Demo):</p>
              <div className="space-y-1 text-xs text-surface-400">
                <p>Admin: admin@shikshavid.com / Admin@123</p>
                <p>Student: rahul@test.com / Test@123</p>
                <p>Teacher: rajesh@test.com / Test@123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
