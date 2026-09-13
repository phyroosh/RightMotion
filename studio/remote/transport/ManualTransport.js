/**
 * RightMotion Remote Access — Manual / Custom Tunnel & LAN Transport Adapter
 */

const os = require('os');
const BaseTransport = require('./BaseTransport');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

class ManualTransport extends BaseTransport {
  constructor() {
    super('manual');
    this.publicUrl = null;
    this.status = 'offline';
    this.errorMessage = null;
  }

  async start(port, customUrl = null) {
    if (customUrl && typeof customUrl === 'string' && customUrl.startsWith('http')) {
      this.publicUrl = customUrl.trim();
      this.status = 'online';
      this.errorMessage = null;
      return { success: true, publicUrl: this.publicUrl, error: null };
    }

    const localIp = getLocalIp();
    this.publicUrl = `http://${localIp}:${port}`;
    this.status = 'online';
    this.errorMessage = null;
    return { success: true, publicUrl: this.publicUrl, error: null };
  }

  async stop() {
    this.publicUrl = null;
    this.status = 'offline';
    this.errorMessage = null;
    return { success: true };
  }

  getPublicUrl() {
    return this.publicUrl;
  }

  getStatus() {
    return { status: this.status, error: this.errorMessage };
  }
}

module.exports = ManualTransport;
