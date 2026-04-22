/**
 * Calculate Best-Fit Score for a teacher based on multiple factors.
 * 
 * Weights:
 *  - Experience: 30% (high weight)
 *  - Rating: 30% (high weight)  
 *  - Distance: 20% (medium weight)
 *  - Fees: 20% (medium weight)
 *
 * All scores are normalized to 0-100 range.
 */

const calculateBestFitScore = (teacher, userLat, userLng) => {
  const weights = {
    experience: 0.30,
    rating: 0.30,
    distance: 0.20,
    fees: 0.20
  };

  // 1. Experience Score (0-100)
  // Cap at 20 years for normalization
  const expScore = Math.min((teacher.experience / 20) * 100, 100);

  // 2. Rating Score (0-100)
  const ratingScore = (teacher.rating / 5) * 100;

  // 3. Distance Score (0-100) — closer is better
  const distance = calculateDistance(
    userLat, userLng,
    teacher.location.coordinates[1], // lat
    teacher.location.coordinates[0]  // lng
  );
  // Max useful distance = 30km, anything beyond scores 0
  const distanceScore = Math.max(0, (1 - distance / 30) * 100);

  // 4. Fees Score (0-100) — lower fees score higher
  // Normalize against max 10000 INR/month
  const feesScore = Math.max(0, (1 - teacher.fees / 10000) * 100);

  // Calculate weighted total
  const totalScore = (
    weights.experience * expScore +
    weights.rating * ratingScore +
    weights.distance * distanceScore +
    weights.fees * feesScore
  );

  // Generate recommendation reason
  const reasons = [];
  if (expScore >= 70) reasons.push(`${teacher.experience}+ years experience`);
  if (ratingScore >= 80) reasons.push(`${teacher.rating}★ rated by students`);
  if (distance <= 5) reasons.push(`Only ${distance.toFixed(1)} km away`);
  else if (distance <= 10) reasons.push(`${distance.toFixed(1)} km from you`);
  if (teacher.fees <= 3000) reasons.push('Affordable fees');
  if (teacher.isVerified) reasons.push('Verified teacher');

  return {
    score: Math.round(totalScore * 10) / 10,
    distance: Math.round(distance * 10) / 10,
    reasons: reasons.length > 0 ? reasons : ['Good match for your search'],
    breakdown: {
      experience: Math.round(expScore),
      rating: Math.round(ratingScore),
      distance: Math.round(distanceScore),
      fees: Math.round(feesScore)
    }
  };
};

/**
 * Haversine formula: calculate distance between two coordinates in km
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

module.exports = { calculateBestFitScore, calculateDistance };
