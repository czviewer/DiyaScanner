// utils.js
async function getPublicIP() {
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  return data.ip;
}

// Hardcoded branch location example (Chennai Anna Nagar)
async function isWithinBranchLocation(branch, sub, userLat, userLon) {
  const branches = {
    "Chennai": {
      "Anna Nagar": { lat: 13.0878, lon: 80.2121 }
    },
    "Bangalore": {
      "Koramangala": { lat: 12.9352, lon: 77.6245 }
    }
  };

  if (!branches[branch] || !branches[branch][sub]) {
    return { valid: false, distance: Infinity };
  }

  const b = branches[branch][sub];
  const R = 6371e3;
  const dLat = (userLat - b.lat) * Math.PI / 180;
  const dLon = (userLon - b.lon) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(b.lat * Math.PI/180) * Math.cos(userLat * Math.PI/180) *
            Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;

  return { valid: d <= 100, distance: d }; // valid within 100m
}

async function logFailure(empId, decoded, distance, ip, device, reason) {
  const ref = firebase.database().ref("qrFailures").push();
  await ref.set({
    empId,
    branch: decoded.branch,
    subdivision: decoded.subdivision,
    type: decoded.type,
    distance,
    ip,
    device,
    reason,
    timestamp: new Date().toISOString()
  });
}
