import { db } from './firebase.js';

export async function handleQRScanAndValidate(payload, empId, statusEl) {
  if (!navigator.geolocation) {
    return statusEl.textContent = 'GPS not supported';
  }

  statusEl.textContent = 'Getting GPS...';
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude, longitude } = pos.coords;
    const dist = getDistanceFromBranch(latitude, longitude);
    const deviceInfo = navigator.userAgent;
    const ip = await fetch("https://api.ipify.org?format=json").then(r => r.json()).then(d => d.ip).catch(() => 'N/A');

    if (dist > 100) {
      await logFailure(empId, payload, dist, ip, deviceInfo, 'Too far from branch');
      return statusEl.textContent = '❌ Too far from branch location';
    }

    const now = new Date().toISOString();
    await db.ref(`attendance/${empId}/${now}`).set({
      ...payload,
      latitude,
      longitude,
      ip,
      deviceInfo,
      status: 'Success',
      timestamp: now
    });
    statusEl.textContent = '✅ Attendance marked';
  }, async err => {
    await logFailure(empId, payload, null, 'N/A', navigator.userAgent, err.message);
    statusEl.textContent = '❌ GPS failed: ' + err.message;
  });
}

function getDistanceFromBranch(lat, lon) {
  const brLat = 12.9716, brLon = 77.5946;
  const R = 6371e3, φ1 = lat * Math.PI/180, φ2 = brLat * Math.PI/180;
  const Δφ = (brLat-lat) * Math.PI/180;
  const Δλ = (brLon-lon) * Math.PI/180;
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // in meters
}

async function logFailure(empId, payload, dist, ip, device, reason) {
  const now = new Date().toISOString();
  await db.ref(`gpsFailures/${empId}/${now}`).set({
    ...payload,
    distance: dist,
    ip,
    device,
    error: reason,
    timestamp: now
  });
}