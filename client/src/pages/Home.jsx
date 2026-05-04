import { Link } from 'react-router-dom';
import {
  HiMap,
  HiShieldCheck,
  HiCurrencyRupee,
  HiStar,
  HiUserGroup,
  HiLightBulb
} from 'react-icons/hi';

const Home = () => {
  const highlights = [
    { label: 'Verified Tutors', value: '500+', icon: HiShieldCheck },
    { label: 'Happy Students', value: '10K+', icon: HiUserGroup },
    { label: 'Avg Rating', value: '4.8', icon: HiStar },
  ];

  const features = [
    {
      icon: HiLightBulb,
      title: 'Smart Matching',
      desc: 'AI-powered recommendations based on subject fit, distance, rating, experience and fees.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: HiMap,
      title: 'Live Map View',
      desc: 'Visualize tutors around your area and compare nearby options instantly.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: HiShieldCheck,
      title: 'Verified Teachers',
      desc: 'Profiles are screened for quality and credentials before being promoted.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: HiCurrencyRupee,
      title: 'Transparent Fees',
      desc: 'Know monthly pricing up front and choose options that match your budget.',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const steps = [
    {
      title: 'Share Your Area',
      desc: 'Use location access or manually set your neighborhood to start smart discovery.'
    },
    {
      title: 'Compare Best-Fit Tutors',
      desc: 'Apply filters for subject, distance, rating and fees to shortlist your top picks.'
    },
    {
      title: 'Book a Demo Session',
      desc: 'Request a demo class, connect directly, and confidently choose your tutor.'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <section className="relative overflow-hidden bg-surface-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(129,140,248,0.35),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(236,72,153,0.3),transparent_35%),linear-gradient(160deg,#0f172a_0%,#1e1b4b_48%,#312e81_100%)]" />
        <div className="relative ds-container py-[calc(var(--space-10)+var(--space-4))] sm:py-[calc(var(--space-10)+var(--space-8))]">
          <div className="grid grid-cols-1 items-center gap-[calc(var(--space-10)+var(--space-4))] lg:grid-cols-2">
            <div className="space-y-[var(--space-5)]">
              <h1 className="ds-heading-xl !text-[clamp(2.75rem,2rem+2.2vw,4.25rem)] !font-black !text-white">
                Find Your
                <span className="block bg-gradient-to-r from-primary-200 via-white to-accent-300 bg-clip-text text-transparent">
                  Best-Fit Tutor
                </span>
                Nearby
              </h1>
              <p className="max-w-xl text-sm text-white/75 sm:text-base">
                Discover top-rated offline tutors with smart matching, transparent pricing, and neighborhood-first results.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-[var(--space-6)] sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="flex flex-col items-center justify-center gap-[var(--space-2)] px-[var(--space-2)] py-[var(--space-4)] text-center">
                  <item.icon className="text-[1.625rem] text-primary-200" />
                  <p className="text-3xl font-extrabold leading-none text-white">{item.value}</p>
                  <p className="text-sm text-white/75">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="ds-container">
          <div className="text-center mb-10">
            <h2 className="ds-heading-lg">
              Why Choose <span className="gradient-text">ShikshaVid</span>?
            </h2>
            <p className="mt-3 text-surface-500">A complete platform for discovery, trust and conversion.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="ds-card h-full p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-lg`}>
                  <feature.icon className="text-xl" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-surface-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-surface-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-y border-surface-100">
        <div className="ds-container">
          <div className="text-center mb-10">
            <h2 className="ds-heading-lg">How It Works</h2>
            <p className="mt-3 text-surface-500">Three simple steps to find the right tutor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={step.title} className="ds-card h-full bg-surface-50 p-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white font-bold text-sm flex items-center justify-center">
                  {`0${idx + 1}`}
                </div>
                <h3 className="mt-4 text-xl font-bold text-surface-900">{step.title}</h3>
                <p className="mt-2 text-sm text-surface-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="ds-container max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-center px-6 sm:px-10 py-12 shadow-2xl shadow-primary-500/25">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Find Your Perfect Tutor?</h2>
            <p className="mt-4 text-base sm:text-lg text-white/85">
              Start with smart discovery and book your first demo class in minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/tutors"
                className="ds-btn px-8 py-3.5 !bg-white !text-primary-600 shadow-xl hover:!bg-primary-50"
              >
                Find Tutors Now
              </Link>
              <Link
                to="/signup"
                className="ds-btn px-8 py-3.5 !bg-white/10 !border-white/30 !text-white hover:!bg-white/20"
              >
                Register as Teacher
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
