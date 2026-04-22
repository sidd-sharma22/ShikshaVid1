import { Link } from 'react-router-dom';
import { HiAcademicCap, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-surface-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                <HiAcademicCap className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold">ShikshaVid</span>
            </div>
            <p className="text-surface-200/60 text-sm leading-relaxed">
              India's hyperlocal platform to discover the best-fit tutors near you. Quality education made accessible.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-200/40 mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: '/tutors', label: 'Find Tutors' },
                { to: '/map', label: 'Map View' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/signup', label: 'Register' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block text-sm text-surface-200/70 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* For Teachers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-200/40 mb-4">For Teachers</h4>
            <div className="space-y-2">
              {[
                { to: '/signup', label: 'Register as Teacher' },
                { to: '/dashboard', label: 'Teacher Dashboard' },
              ].map(link => (
                <Link key={link.to} to={link.to} className="block text-sm text-surface-200/70 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-200/40 mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-surface-200/70">
                <HiMail className="text-primary-400" />
                <span>support@shikshavid.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-200/70">
                <HiPhone className="text-primary-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-200/70">
                <HiLocationMarker className="text-primary-400" />
                <span>Jaipur, Rajasthan</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {[FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-sm text-surface-200/40">
            © {new Date().getFullYear()} ShikshaVid. All rights reserved. Made with ❤️ for Bharat.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
