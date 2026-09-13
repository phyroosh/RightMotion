/**
 * RightMotion Event-Driven Notification Service
 * Orchestrates In-App notifications, real-time SSE broadcasts, and OS Web Push (VAPID).
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const webpush = require('web-push');
const { configureWebPush } = require('./vapid');

const DATA_DIR = path.resolve(__dirname, 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'push_subscriptions.json');

class NotificationService extends EventEmitter {
  constructor() {
    super();
    this.sseClients = new Set();
    this.ensureStorage();
    this.vapidKeys = configureWebPush();
  }

  ensureStorage() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
    }
    if (!fs.existsSync(NOTIFICATIONS_FILE)) {
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify([], null, 2), { mode: 0o600 });
    }
    if (!fs.existsSync(SUBSCRIPTIONS_FILE)) {
      fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify([], null, 2), { mode: 0o600 });
    }
  }

  loadNotifications() {
    try {
      if (fs.existsSync(NOTIFICATIONS_FILE)) {
        return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
      }
    } catch (e) {
      console.warn('[Notifications] Error loading notifications:', e.message);
    }
    return [];
  }

  saveNotifications(notifications) {
    try {
      // Keep last 150 notifications max to keep file lightweight
      const trimmed = notifications.slice(0, 150);
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(trimmed, null, 2), { mode: 0o600 });
    } catch (e) {
      console.error('[Notifications] Error saving notifications:', e.message);
    }
  }

  loadSubscriptions() {
    try {
      if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
        return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_FILE, 'utf8'));
      }
    } catch (e) {
      console.warn('[Notifications] Error loading push subscriptions:', e.message);
    }
    return [];
  }

  saveSubscriptions(subscriptions) {
    try {
      fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2), { mode: 0o600 });
    } catch (e) {
      console.error('[Notifications] Error saving push subscriptions:', e.message);
    }
  }

  /**
   * Register a new Web Push subscription from client
   */
  subscribePush(subscription, metadata = {}) {
    if (!subscription || !subscription.endpoint) {
      throw new Error('Invalid push subscription: missing endpoint');
    }

    const subs = this.loadSubscriptions();
    const existingIdx = subs.findIndex(s => s.endpoint === subscription.endpoint);

    const record = {
      ...subscription,
      userAgent: metadata.userAgent || '',
      device: metadata.device || 'Web Browser',
      subscribedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      subs[existingIdx] = record;
    } else {
      subs.push(record);
    }

    this.saveSubscriptions(subs);
    console.log(`[Notifications] Registered push subscription (${subs.length} total subscribers).`);
    return record;
  }

  /**
   * Unsubscribe push endpoint
   */
  unsubscribePush(endpoint) {
    if (!endpoint) return false;
    let subs = this.loadSubscriptions();
    const before = subs.length;
    subs = subs.filter(s => s.endpoint !== endpoint);
    this.saveSubscriptions(subs);
    return subs.length < before;
  }

  /**
   * Add a Server-Sent Events client connection
   */
  addSseClient(res) {
    this.sseClients.add(res);
    console.log(`[Notifications] SSE client connected. Active connections: ${this.sseClients.size}`);

    // Send initial ping to keep connection alive
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`);

    res.on('close', () => {
      this.sseClients.delete(res);
      console.log(`[Notifications] SSE client disconnected. Active connections: ${this.sseClients.size}`);
    });
  }

  /**
   * Format standard deep-link URL
   */
  formatDeepLink(clip, tab = 'studio', extraParams = {}) {
    if (!clip && !tab) return '/';
    const params = new URLSearchParams();
    if (clip) {
      const cleanClip = clip.endsWith('.mp4') ? clip : `${clip}.mp4`;
      params.set('clip', cleanClip);
    }
    if (tab) {
      params.set('tab', tab);
    }
    for (const [k, v] of Object.entries(extraParams)) {
      if (v) params.set(k, v);
    }
    return `/?${params.toString()}`;
  }

  /**
   * Dispatch an Event across all notification channels:
   * 1. Persisted In-App Store
   * 2. Real-time SSE Foreground Stream
   * 3. OS / Browser Web Push (VAPID)
   */
  async dispatch(eventData) {
    const now = new Date().toISOString();
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const category = eventData.category || this.inferCategory(eventData.type);
    const deepLink = eventData.url || this.formatDeepLink(eventData.clip, eventData.tab || 'studio');

    const notification = {
      id,
      type: eventData.type || 'INFO',
      category,
      title: eventData.title || 'RightMotion Studio',
      body: eventData.body || eventData.message || '',
      clip: eventData.clip || null,
      tab: eventData.tab || 'studio',
      url: deepLink,
      data: eventData.data || {},
      timestamp: now,
      read: false
    };

    // 1. Save to in-app history
    const all = this.loadNotifications();
    all.unshift(notification);
    this.saveNotifications(all);

    // Emit event bus
    this.emit('notification', notification);

    // 2. Broadcast via Server-Sent Events (Foreground)
    this.broadcastSse(notification);

    // 3. Dispatch Web Push to background devices (Async)
    this.sendWebPush(notification).catch(err => {
      console.warn('[Notifications] Web push dispatch warning:', err.message);
    });

    return notification;
  }

  inferCategory(type = '') {
    const t = type.toUpperCase();
    if (t.includes('RENDER')) return 'render';
    if (t.includes('PROJECT') || t.includes('CLIP')) return 'project';
    if (t.includes('PUBLISH') || t.includes('UPLOAD')) return 'release';
    if (t.includes('REMOTE') || t.includes('COLLABORATOR') || t.includes('AUTH') || t.includes('KILL')) return 'security';
    return 'system';
  }

  /**
   * Broadcast payload to all active SSE browser connections
   */
  broadcastSse(notification) {
    const payload = `data: ${JSON.stringify({ type: 'NOTIFICATION', notification })}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(payload);
      } catch (e) {
        this.sseClients.delete(client);
      }
    }
  }

  /**
   * Dispatch Web Push notifications via VAPID
   */
  async sendWebPush(notification) {
    const subs = this.loadSubscriptions();
    if (subs.length === 0) return;

    const pushPayload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: '/assets/icon-192.png',
      badge: '/assets/badge-72.png',
      data: {
        url: notification.url,
        clip: notification.clip,
        tab: notification.tab,
        id: notification.id
      },
      tag: `rightmotion-${notification.category}-${notification.clip || 'alert'}`,
      renotify: true
    });

    const failedEndpoints = [];

    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            pushPayload,
            { TTL: 86400 } // 24 hours
          );
        } catch (err) {
          // 410 Gone or 404 Not Found means subscription expired
          if (err.statusCode === 410 || err.statusCode === 404) {
            failedEndpoints.push(sub.endpoint);
          } else {
            console.warn(`[Notifications] Push failed to ${sub.endpoint.substring(0, 35)}...:`, err.message);
          }
        }
      })
    );

    // Cleanup expired subscriptions
    if (failedEndpoints.length > 0) {
      const active = subs.filter(s => !failedEndpoints.includes(s.endpoint));
      this.saveSubscriptions(active);
      console.log(`[Notifications] Cleaned up ${failedEndpoints.length} expired push subscriptions.`);
    }
  }

  /**
   * Get notifications with optional filtering
   */
  getNotifications({ limit = 50, category = null, unreadOnly = false } = {}) {
    let list = this.loadNotifications();
    if (category && category !== 'all') {
      list = list.filter(n => n.category === category);
    }
    if (unreadOnly) {
      list = list.filter(n => !n.read);
    }
    const unreadCount = this.loadNotifications().filter(n => !n.read).length;
    return {
      notifications: list.slice(0, limit),
      totalCount: list.length,
      unreadCount
    };
  }

  /**
   * Mark notification(s) as read
   */
  markAsRead(ids = null) {
    const list = this.loadNotifications();
    let updated = 0;
    list.forEach(n => {
      if (!ids || ids.includes(n.id)) {
        if (!n.read) {
          n.read = true;
          updated++;
        }
      }
    });
    this.saveNotifications(list);
    return { updated, unreadCount: list.filter(n => !n.read).length };
  }

  /**
   * Clear all notification history
   */
  clearAll() {
    this.saveNotifications([]);
    return { success: true };
  }
}

const notificationService = new NotificationService();
module.exports = notificationService;
