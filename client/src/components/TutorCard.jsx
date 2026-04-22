import { HiStar, HiLocationMarker, HiBadgeCheck, HiLightningBolt } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const TutorCard = ({ teacher }) => {
  const user = teacher.userId || {};
  const score = teacher.bestFitScore || 0;
  const reasons = teacher.whyRecommended || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-100 card-hover overflow-hidden animate-fade-in-up">
      {/* Score Badge */}
      {score > 0 && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiLightningBolt className="text-yellow-300" />
            <span className="text-white text-sm font-semibold">Best Fit: {score}%</span>
          </div>
          {teacher.isVerified && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
              <HiBadgeCheck className="text-white text-sm" />
              <span className="text-white text-xs font-medium">Verified</span>
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-primary-600">
              {(user.name || 'T')[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-surface-800 truncate">{user.name || 'Teacher'}</h3>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <HiStar className="text-yellow-400" />
                <span className="text-sm font-semibold text-surface-700">{teacher.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-xs text-surface-400">({teacher.totalReviews || 0})</span>
              </div>
              {teacher.distance !== undefined && (
                <div className="flex items-center gap-1 text-xs text-surface-500">
                  <HiLocationMarker className="text-primary-400" />
                  <span>{teacher.distance} km</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {(teacher.subjects || []).slice(0, 3).map((sub, i) => (
            <span key={i} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
              {sub}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 p-3 bg-surface-50 rounded-xl">
          <div className="text-center">
            <p className="text-lg font-bold text-surface-800">{teacher.experience}y</p>
            <p className="text-xs text-surface-400">Experience</p>
          </div>
          <div className="text-center border-x border-surface-200">
            <p className="text-lg font-bold text-success-500">₹{teacher.fees}</p>
            <p className="text-xs text-surface-400">/month</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-600">{teacher.teachingMode || 'offline'}</p>
            <p className="text-xs text-surface-400">Mode</p>
          </div>
        </div>

        {/* Why Recommended */}
        {reasons.length > 0 && (
          <div className="mt-3 p-3 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
            <p className="text-xs font-semibold text-primary-700 mb-1">💡 Why Recommended</p>
            <p className="text-xs text-surface-600">{reasons.join(' • ')}</p>
          </div>
        )}

        {/* Action */}
        <Link
          to={`/tutor/${teacher._id}`}
          className="mt-4 block w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-500/20 hover:shadow-primary-500/40 transition-all"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default TutorCard;
