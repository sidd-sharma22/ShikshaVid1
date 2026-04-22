import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiSearch, HiLocationMarker, HiAcademicCap, HiStar, HiMap, HiShieldCheck, HiCurrencyRupee, HiUserGroup } from 'react-icons/hi';

const Home = () => {
  const [searchSubject, setSearchSubject] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/tutors${searchSubject ? `?subject=${searchSubject}` : ''}`);
  };

  const features = [
    { icon: HiSearch, title: 'Smart Matching', desc: 'AI-powered best-fit scoring based on experience, ratings, distance & fees', color: 'from-primary-500 to-primary-600' },
    { icon: HiMap, title: 'Live Map View', desc: 'Find tutors near you on an interactive map with real-time distance', color: 'from-emerald-500 to-teal-600' },
    { icon: HiShieldCheck, title: 'Verified Teachers', desc: 'Every teacher is verified for credentials and teaching quality', color: 'from-amber-500 to-orange-600' },
    { icon: HiCurrencyRupee, title: 'Transparent Fees', desc: 'Compare fees easily. No hidden charges. Value for money guaranteed', color: 'from-pink-500 to-rose-600' },
  ];

  const popularSubjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology', 'Computer Science', 'Hindi', 'Social Studies'];

  const stats = [
    { value: '500+', label: 'Verified Tutors' },
    { value: '10K+', label: 'Happy Students' },
    { value: '50+', label: 'Cities' },
    { value: '4.8', label: 'Avg Rating' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-primary-500 pulse-dot" />
              Trusted by 10,000+ students across India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-900 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Find the{' '}
              <span className="gradient-text">Best-Fit Tutor</span>
              <br />Near You
            </h1>

            <p className="mt-6 text-lg text-surface-500 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover top-rated offline tutors in your city. Smart recommendations based on your needs — not just listings.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 max-w-xl mx-auto p-2 bg-white rounded-2xl shadow-xl shadow-primary-500/10 border border-surface-100">
                <div className="flex items-center gap-2 flex-1 px-4">
                  <HiSearch className="text-surface-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search by subject (e.g., Mathematics)"
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                    className="flex-1 py-3 text-sm outline-none bg-transparent text-surface-800 placeholder:text-surface-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all flex items-center gap-2"
                >
                  <HiLocationMarker />
                  Find Tutors
                </button>
              </div>
            </form>

            {/* Popular subjects */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <span className="text-xs text-surface-400">Popular:</span>
              {popularSubjects.slice(0, 5).map(sub => (
                <Link
                  key={sub}
                  to={`/tutors?subject=${sub}`}
                  className="px-3 py-1 bg-white rounded-full text-xs font-medium text-surface-600 border border-surface-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
                >
                  {sub}
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/60 rounded-2xl border border-white/50 backdrop-blur animate-fade-in-up" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <p className="text-2xl sm:text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-xs text-surface-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-900">Why Choose <span className="gradient-text">ShikshaVid</span>?</h2>
            <p className="mt-3 text-surface-500">More than a directory — we find your perfect teacher match</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-surface-50 border border-surface-100 card-hover">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-bold text-surface-800">{f.title}</h3>
                <p className="mt-2 text-sm text-surface-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-surface-900 to-surface-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-surface-200/60">Three simple steps to find your ideal tutor</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Share Your Location', desc: 'Allow GPS or enter your area. We find tutors within your preferred distance.' },
              { step: '02', title: 'Browse Best-Fit Tutors', desc: 'See tutors ranked by our smart scoring algorithm. Filter by subject, fees, rating.' },
              { step: '03', title: 'Book a Demo Class', desc: 'Select a time slot, book a free demo class, and start learning!' },
            ].map((item, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                <span className="text-5xl font-black text-white/10 absolute top-4 right-4">{item.step}</span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Find Your Perfect Tutor?</h2>
          <p className="mt-4 text-lg text-white/80">Join thousands of students discovering quality education in their neighborhood</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tutors" className="px-8 py-3.5 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 shadow-xl transition-all">
              Find Tutors Now
            </Link>
            <Link to="/signup" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
              Register as Teacher
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
