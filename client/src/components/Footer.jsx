import { Link } from 'react-router-dom';
import { HiAcademicCap, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-surface-900 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center shadow-lg">
                <HiAcademicCap className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold">ShikshaVid</span>
            </div>
            <p className="mt-4 text-sm text-surface-200/70 leading-relaxed max-w-xs">
              India&apos;s hyperlocal platform to discover trusted offline tutors near you with better matching.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-200/50 mb-4">Explore</h4>
            <div className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/tutors', label: 'Find Tutors' },
                { to: '/map', label: 'Map View' },
                { to: '/contact', label: 'Contact Us' },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="block text-sm text-surface-200/75 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-200/50 mb-4">For Teachers</h4>
            <div className="space-y-2.5">
              {[
                { to: '/signup', label: 'Register as Teacher' },
                { to: '/dashboard', label: 'Teacher Dashboard' },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="block text-sm text-surface-200/75 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-200/50 mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-surface-200/75">
              <div className="flex items-center gap-2.5">
                <HiMail className="text-primary-300" />
                <span>support@shikshavid.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiPhone className="text-primary-300" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HiLocationMarker className="text-primary-300" />
                <span>Jaipur, Rajasthan</span>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {[
                { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"
                >
                  <item.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-sm text-surface-200/45">
            © {new Date().getFullYear()} ShikshaVid. All rights reserved. Made for better tutor discovery.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
