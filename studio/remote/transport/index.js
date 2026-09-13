/**
 * RightMotion Remote Access — Transport Manager Factory
 */

const TailscaleTransport = require('./TailscaleTransport');
const CloudflareTransport = require('./CloudflareTransport');
const ManualTransport = require('./ManualTransport');

const tailscale = new TailscaleTransport();
const cloudflare = new CloudflareTransport();
const manual = new ManualTransport();

function getTransport(type = 'auto') {
  if (type === 'cloudflare') return cloudflare;
  if (type === 'tailscale') {
    if (tailscale.isAvailable()) return tailscale;
    if (cloudflare.isAvailable()) return cloudflare;
    return manual;
  }
  if (type === 'manual') return manual;

  // Default priority: Cloudflare Tunnel -> Tailscale -> Manual
  if (cloudflare.isAvailable()) return cloudflare;
  if (tailscale.isAvailable()) return tailscale;
  return manual;
}

module.exports = {
  getTransport,
  cloudflare,
  tailscale,
  manual,
};
