/**
 * RightMotion Notification API Routes
 * Endpoints for In-App Notification Center, Real-Time SSE Stream, and Web Push Subscriptions.
 */

const express = require('express');
const router = express.Router();
const notificationService = require('./service');
const { getVapidKeys } = require('./vapid');
const { requirePermission, requireOwner, isDirectLocalOrigin, Permissions } = require('../remote/permissions');
const { Roles } = require('../remote/types');

// 1. GET VAPID Public Key for client push registration
router.get('/vapid-public-key', (req, res) => {
  try {
    const keys = getVapidKeys();
    res.json({ publicKey: keys.publicKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST Subscribe to Web Push
router.post('/subscribe', requirePermission(Permissions.VIEW_PROJECTS), (req, res) => {
  try {
    const { subscription, device } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Valid subscription object required' });
    }
    const record = notificationService.subscribePush(subscription, {
      userAgent: req.headers['user-agent'] || '',
      device: device || (req.user?.label ? `${req.user.label}'s device` : 'Browser')
    });
    const subscriberCount = notificationService.loadSubscriptions().length;
    res.json({ success: true, record, subscriberCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST Unsubscribe from Web Push
router.post('/unsubscribe', requirePermission(Permissions.VIEW_PROJECTS), (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }
    const removed = notificationService.unsubscribePush(endpoint);
    res.json({ success: true, removed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET In-App Notification History & Counter
router.get('/', requirePermission(Permissions.VIEW_PROJECTS), (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const category = req.query.category || null;
    const unreadOnly = req.query.unreadOnly === 'true';

    const data = notificationService.getNotifications({ limit, category, unreadOnly });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. POST Mark as Read
router.post('/read', requirePermission(Permissions.VIEW_PROJECTS), (req, res) => {
  try {
    const { ids } = req.body; // array of IDs or null for all
    const result = notificationService.markAsRead(ids);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. POST Clear All Notifications (Owner Only)
router.post('/clear', requireOwner, (req, res) => {
  try {
    notificationService.clearAll();
    res.json({ success: true, message: 'Notification history cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. GET Real-Time Server-Sent Events (SSE) Stream
router.get('/stream', requirePermission(Permissions.VIEW_PROJECTS), (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.flushHeaders?.();

  notificationService.addSseClient(res);
});

// 8. POST Emit Event (Internal scripts / Localhost or Owner Only)
router.post('/emit', async (req, res) => {
  // Enforce caller authority: direct unproxied localhost script OR authenticated Owner
  const isLocal = isDirectLocalOrigin(req);
  const isOwner = req.user && req.user.role === Roles.OWNER;
  if (!isLocal && !isOwner) {
    return res.status(403).json({
      error: 'Forbidden: emitting notifications is restricted to local pipeline scripts or the studio owner.',
      code: 'LOCAL_OR_OWNER_REQUIRED'
    });
  }

  try {
    const bodyData = req.body || {};
    const { type, title, body, clip, tab, category, data } = bodyData;
    if (!title) {
      return res.status(400).json({ error: 'Notification title is required' });
    }

    const notification = await notificationService.dispatch({
      type: type || 'CUSTOM_EVENT',
      title,
      body: body || '',
      clip: clip || null,
      tab: tab || 'studio',
      category: category || null,
      data: data || {}
    });

    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. POST Test Notification (Owner Only)
router.post('/test', requireOwner, async (req, res) => {
  try {
    const bodyData = req.body || {};
    const clip = bodyData.clip || 'dopamine_reality_video.mp4';
    const notification = await notificationService.dispatch({
      type: 'RENDER_COMPLETED',
      category: 'render',
      title: '🎬 New Video Ready',
      body: 'Dopamine Reality has been added and is ready for review.',
      clip,
      tab: 'studio',
      url: notificationService.formatDeepLink(clip, 'studio')
    });
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
