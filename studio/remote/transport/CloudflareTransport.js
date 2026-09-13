/**
 * RightMotion Remote Access — Cloudflare Quick Tunnel Transport Adapter
 * Uses free, zero-config Cloudflare Tunnels (https://*.trycloudflare.com)
 */

const { spawn, execSync } = require('child_process');
const BaseTransport = require('./BaseTransport');

class CloudflareTransport extends BaseTransport {
  constructor() {
    super('cloudflare');
    this.publicUrl = null;
    this.status = 'offline';
    this.errorMessage = null;
    this.process = null;
  }

  isAvailable() {
    try {
      execSync('which cloudflared', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  }

  async start(port) {
    if (!this.isAvailable()) {
      this.status = 'unavailable';
      this.errorMessage = 'cloudflared binary is not found in system PATH.';
      return { success: false, publicUrl: null, error: this.errorMessage };
    }

    if (this.process) {
      try { this.process.kill('SIGTERM'); } catch (e) {}
      this.process = null;
    }

    return new Promise((resolve) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.status = 'error';
          this.errorMessage = 'Timeout waiting for Cloudflare Tunnel URL (20s)';
          resolve({ success: false, publicUrl: null, error: this.errorMessage });
        }
      }, 20000);

      try {
        const proc = spawn('cloudflared', ['tunnel', '--url', `http://127.0.0.1:${port}`]);
        this.process = proc;

        const handleData = (data) => {
          const text = data.toString();
          const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
          if (match && !resolved) {
            resolved = true;
            clearTimeout(timeout);
            this.publicUrl = match[0];
            this.status = 'online';
            this.errorMessage = null;
            console.log(`[CloudflareTransport] Live public tunnel established: ${this.publicUrl}`);
            resolve({ success: true, publicUrl: this.publicUrl, error: null });
          }
        };

        proc.stderr.on('data', handleData);
        proc.stdout.on('data', handleData);

        proc.on('error', (err) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            this.status = 'error';
            this.errorMessage = err.message;
            resolve({ success: false, publicUrl: null, error: err.message });
          }
        });

        proc.on('exit', (code) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            this.status = 'offline';
            this.errorMessage = `cloudflared exited unexpectedly with code ${code}`;
            resolve({ success: false, publicUrl: null, error: this.errorMessage });
          } else {
            this.status = 'offline';
            this.publicUrl = null;
          }
        });
      } catch (err) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          this.status = 'error';
          this.errorMessage = err.message;
          resolve({ success: false, publicUrl: null, error: err.message });
        }
      }
    });
  }

  async stop() {
    if (this.process) {
      try { this.process.kill('SIGTERM'); } catch (e) {}
      this.process = null;
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
    return { status: this.status, error: this.errorMessage };
  }
}

module.exports = CloudflareTransport;
