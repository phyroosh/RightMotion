/**
 * RightMotion Remote Access — Tailscale Funnel Transport Adapter
 */

const { execSync, spawn } = require('child_process');
const BaseTransport = require('./BaseTransport');

class TailscaleTransport extends BaseTransport {
  constructor() {
    super('tailscale');
    this.publicUrl = null;
    this.status = 'offline';
    this.errorMessage = null;
    this.funnelProcess = null;
  }

  isAvailable() {
    try {
      execSync('which tailscale', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  }

  async start(port) {
    if (!this.isAvailable()) {
      this.status = 'unavailable';
      this.errorMessage = 'Tailscale binary is not found in system PATH. Install Tailscale or configure a manual tunnel.';
      return {
        success: false,
        publicUrl: null,
        error: this.errorMessage,
      };
    }

    try {
      // 1. Check tailscale login status
      const statusOut = execSync('tailscale status --json', { encoding: 'utf-8' });
      const statusJson = JSON.parse(statusOut);
      const nodeName = statusJson.Self?.DNSName?.replace(/\.$/, '') || null;

      if (!nodeName) {
        throw new Error('Tailscale node DNS name could not be resolved. Please ensure Tailscale is connected.');
      }

      // 2. Enable Tailscale Funnel for target port
      // Command: tailscale funnel --bg <port> (or tailscale serve + funnel)
      try {
        execSync(`tailscale funnel --bg ${port}`, { stdio: 'ignore' });
      } catch (err) {
        // Some Tailscale versions use `tailscale funnel <port> on`
        execSync(`tailscale funnel ${port} on`, { stdio: 'ignore' });
      }

      this.publicUrl = `https://${nodeName}`;
      this.status = 'online';
      this.errorMessage = null;

      return {
        success: true,
        publicUrl: this.publicUrl,
        error: null,
      };
    } catch (err) {
      console.warn('[TailscaleTransport] Funnel start warning:', err.message);
      this.status = 'error';
      this.errorMessage = err.message;
      return {
        success: false,
        publicUrl: null,
        error: `Failed to start Tailscale Funnel: ${err.message}`,
      };
    }
  }

  async stop(port = 4000) {
    if (this.isAvailable()) {
      try {
        execSync(`tailscale funnel ${port} off`, { stdio: 'ignore' });
      } catch (e) {
        try {
          execSync(`tailscale funnel --bg=false ${port}`, { stdio: 'ignore' });
        } catch (e2) {}
      }
    }

    this.publicUrl = null;
    this.status = 'offline';
    this.errorMessage = null;
    return { success: true };
  }

  getPublicUrl() {
    return this.publicUrl;
  }

  getStatus() {
    return {
      status: this.status,
      error: this.errorMessage,
      isAvailable: this.isAvailable(),
    };
  }
}

module.exports = TailscaleTransport;
