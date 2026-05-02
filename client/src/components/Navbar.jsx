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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-200/70 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/40 transition-shadow">
              <HiAcademicCap className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">ShikshaVid</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {desktopLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                   isActive(link.path)
                     ? 'bg-primary-50 text-primary-700'
                     : 'text-surface-700 hover:bg-surface-100 hover:text-primary-600'
                 }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                 {user.role === 'admin' && !isAdminArea && (
                   <Link to="/admin" className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
                     Admin Panel
                   </Link>
                 )}
                {user.role === 'student' && (
                  <Link to="/my-bookings" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    My Bookings
                  </Link>
                )}
                {user.role === 'teacher' && (
                  <Link to="/dashboard" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 max-w-[180px]">
                  <HiUser className="text-primary-600" />
                  <span className="text-sm font-medium text-primary-700 truncate">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-surface-500 hover:text-danger-500 hover:bg-red-50 transition-all"
                  title="Logout"
                >
                  <HiLogout className="text-lg" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100"
          >
            {mobileOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-surface-200 bg-white/95 backdrop-blur-xl animate-fade-in-up">
          <div className="px-4 py-3 space-y-1">
             {(isAdminArea ? [{ path: '/', label: 'Back to Home' }] : navLinks).map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-700 hover:bg-surface-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-surface-200 pt-3 mt-3">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-accent-600">
                      Admin Panel
                    </Link>
                  )}
                  {user.role === 'teacher' && (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-primary-600">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-primary-600">
                      My Bookings
                    </Link>
                  )}
                  <div className="px-4 py-2 text-sm text-surface-500">
                    Logged in as <span className="font-semibold text-primary-600">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-danger-500 hover:bg-red-50">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 px-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center text-sm font-medium rounded-xl border border-primary-200 text-primary-600">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
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
