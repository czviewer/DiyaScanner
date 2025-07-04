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
  const ref = firebase.database().ref(`branchLocations/${branch}/${subdivision}`);
  const snapshot = await ref.once('value');
  if (!snapshot.exists()) throw new Error("Branch location not found");

  const data = snapshot.val();
  return {
    lat: data.latitude,   // ✅ use your keys
    lon: data.longitude   // ✅ use your keys
  };
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
  return { valid: distance <= 1000, distance };
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
