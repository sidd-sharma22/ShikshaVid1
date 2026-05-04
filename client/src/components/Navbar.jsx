import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiUser, HiLogout, HiAcademicCap } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdminArea = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/tutors', label: 'Find Tutors' },
    { path: '/map', label: 'Map View' },
    { path: '/contact', label: 'Contact' },
  ];

  const desktopLinks = isAdminArea ? [{ path: '/', label: 'Back to Home' }] : navLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-200/70 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="ds-container">
        <div className="flex h-[var(--app-nav-height)] items-center justify-between gap-[var(--space-4)] px-[var(--space-2)] sm:px-[var(--space-3)]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <HiAcademicCap className="text-base" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-surface-900">ShikshaVid</span>
          </Link>

          <div className="hidden items-center gap-[var(--space-6)] lg:flex">
            {/* Desktop Nav */}
            <div className="flex items-center gap-[var(--space-4)]">
              {desktopLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-lg px-3 py-2 text-sm font-medium leading-5 transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-[var(--space-4)] border-l border-surface-200 pl-[var(--space-4)]">
              {user ? (
                <div className="flex items-center gap-[var(--space-4)]">
                  {user.role === 'admin' && !isAdminArea && (
                    <Link to="/admin" className="rounded-lg px-2 py-1 text-sm font-medium text-primary-700 hover:bg-primary-50">
                      Admin Panel
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/my-bookings" className="rounded-lg px-2 py-1 text-sm font-medium text-primary-700 hover:bg-primary-50">
                      My Bookings
                    </Link>
                  )}
                  {user.role === 'teacher' && (
                    <Link to="/dashboard" className="rounded-lg px-2 py-1 text-sm font-medium text-primary-700 hover:bg-primary-50">
                      Dashboard
                    </Link>
                  )}
                  <div className="flex max-w-44 items-center gap-[var(--space-2)] rounded-full bg-primary-50 px-3 py-1.5">
                    <HiUser className="text-primary-600" />
                    <span className="truncate text-sm font-medium text-primary-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-danger-500"
                    title="Logout"
                  >
                    <HiLogout className="text-lg" />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900">
                    Login
                  </Link>
                  <Link to="/signup" className="ds-btn ds-btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-surface-200 bg-white/95 backdrop-blur-xl animate-fade-in-up">
          <div className="space-y-2 px-4 py-4">
            {(isAdminArea ? [{ path: '/', label: 'Back to Home' }] : navLinks).map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-surface-200 pt-3">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50">
                      Admin Panel
                    </Link>
                  )}
                  {user.role === 'teacher' && (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50">
                      My Bookings
                    </Link>
                  )}
                  <div className="rounded-lg px-3 py-2 text-sm text-surface-500">
                    Logged in as <span className="font-semibold text-primary-600">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger-500 hover:bg-red-50">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 pt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="ds-btn ds-btn-outline flex-1">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="ds-btn ds-btn-primary flex-1">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
