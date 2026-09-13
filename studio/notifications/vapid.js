/**
 * RightMotion VAPID Key Manager
 * Generates and persists VAPID (RFC 8292) keys for Web Push.
 */

const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const DATA_DIR = path.resolve(__dirname, 'data');
const VAPID_FILE = path.join(DATA_DIR, 'vapid.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  }
}

function getVapidKeys() {
  ensureDataDir();
  if (fs.existsSync(VAPID_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf8'));
      if (data.publicKey && data.privateKey) {
        return data;
      }
    } catch (e) {
      console.warn('[VAPID] Corrupt key file, regenerating:', e.message);
    }
  }

  // Generate new standard VAPID keypair
  const keys = webpush.generateVAPIDKeys();
  const vapidData = {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    subject: 'mailto:studio@rightmotion.local',
    createdAt: new Date().toISOString()
  };

  fs.writeFileSync(VAPID_FILE, JSON.stringify(vapidData, null, 2), { mode: 0o600 });
  console.log('[VAPID] Generated new Web Push VAPID keypair.');
  return vapidData;
}

function configureWebPush() {
  const keys = getVapidKeys();
  webpush.setVapidDetails(
    keys.subject || 'mailto:studio@rightmotion.local',
    keys.publicKey,
    keys.privateKey
  );
  return keys;
}

module.exports = {
  getVapidKeys,
  configureWebPush
};
