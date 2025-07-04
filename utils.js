// ✅ utils.js - Used by QR+GPS attendance app

// Firebase should already be initialized via firebase.js
const db = firebase.database();

/**
 * Calculate the distance between two coordinates in meters.
 * Haversine formula.
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in meters
}

/**
 * Fetch branch coordinates from Firebase (or fallback hardcoded)
 */
async function getBranchCoordinates(branch, subdivision) {
  try {
    const snapshot = await db.ref(`branchLocations/${branch}/${subdivision}`).once('value');
    const data = snapshot.val();
    if (data && data.lat && data.lon) return { lat: data.lat, lon: data.lon };
  } catch (e) {
    console.warn("⚠️ Branch coordinates fetch failed, using fallback", e);
  }

  // 🔁 Fallback coordinates if Firebase fails
  return { lat: 13.0827, lon: 80.2707 }; // Chennai default fallback
}

/**
 * Log GPS failures separately for admin review
 */
async function logFailure(empId, payload, distance, ip, device, reason) {
  const failureRef = db.ref(`gpsFailures/${empId}`).push();
  await failureRef.set({
    ...payload,
    distance,
    ip,
    device,
    reason,
    timestamp: new Date().toISOString()
  });
}

/**
 * Check if the user is within 100m radius of their branch
 */
async function isWithinBranchLocation(branch, subdivision, lat, lon) {
  const branchCoords = await getBranchCoordinates(branch, subdivision);
  const distance = getDistance(lat, lon, branchCoords.lat, branchCoords.lon);
  return { valid: distance <= 100, distance };
}

/**
 * Utility to get IP address (async)
 */
async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (err) {
    return 'N/A';
  }
}
