/**
 * 📐 RightMotion Platform Safe Profiles
 *
 * Centralized, extensible configuration defining UI safe areas,
 * caution zones, obstruction zones, and creative focal regions.
 *
 * LAW: PLATFORM UI IS PART OF THE COMPOSITIONAL ENVIRONMENT.
 */

import { PlatformProfile, PlatformType } from "./types";

export const YOUTUBE_SHORTS_PROFILE: PlatformProfile = {
  platform: "YOUTUBE_SHORTS",
  displayName: "YouTube Shorts",
  orientation: "vertical",
  aspectRatio: "9:16",
  canvas: { width: 1080, height: 1920 },
  safeInsets: {
    top: 280,
    bottom: 540, // 360px platform UI + 180px kinetic captions clearance
    left: 72,
    right: 210, // engagement rail clearance
  },
  obstructionZones: [
    {
      id: "yt-top-nav",
      name: "Top Navigation Bar",
      severity: "obstruction",
      description: "Search button, Shorts camera, 3-dots menu, back button, and sound selector",
      bounds: { x: 0, y: 0, width: 1080, height: 230 },
    },
    {
      id: "yt-right-rail",
      name: "Right Engagement Rail",
      severity: "obstruction",
      description: "Like, Dislike, Comments, Share, Remix buttons and rotating sound disc",
      bounds: { x: 910, y: 700, width: 170, height: 860 },
    },
    {
      id: "yt-bottom-metadata",
      name: "Bottom Channel & Metadata",
      severity: "obstruction",
      description: "Channel avatar, handle, Subscribe pill, video title snippet, audio attribution banner, progress bar",
      bounds: { x: 0, y: 1560, width: 1080, height: 360 },
    },
  ],
  cautionZones: [
    {
      id: "yt-top-caution",
      name: "Top Caution Buffer",
      severity: "caution",
      description: "Hardware notch, dynamic island, device status bar variations",
      bounds: { x: 0, y: 230, width: 1080, height: 50 },
    },
    {
      id: "yt-right-caution",
      name: "Right Rail Margin Buffer",
      severity: "caution",
      description: "Buffer zone directly adjacent to vertical action icons",
      bounds: { x: 870, y: 700, width: 40, height: 860 },
    },
    {
      id: "yt-captions-hazard",
      name: "Kinetic Captions Zone",
      severity: "caution",
      description: "Reserved space for AppleKineticCaptions. Critical graphics must not collide.",
      bounds: { x: 80, y: 1380, width: 920, height: 180 },
    },
  ],
  recommendedTextRegion: {
    x: 80,
    y: 280,
    width: 790,
    height: 1060,
  },
  recommendedSubjectRegion: {
    x: 64,
    y: 300,
    width: 820,
    height: 1060,
  },
  preferredFocalRegion: {
    x: 120,
    y: 480,
    width: 720,
    height: 620,
  },
  captionsRegion: {
    x: 80,
    y: 1380,
    width: 920,
    height: 180,
  },
};

export const INSTAGRAM_REELS_PROFILE: PlatformProfile = {
  platform: "INSTAGRAM_REELS",
  displayName: "Instagram Reels",
  orientation: "vertical",
  aspectRatio: "9:16",
  canvas: { width: 1080, height: 1920 },
  safeInsets: {
    top: 250,
    bottom: 540,
    left: 72,
    right: 200,
  },
  obstructionZones: [
    {
      id: "ig-top-header",
      name: "Reels Top Header",
      severity: "obstruction",
      description: "Reels title header, camera icon, audio track selector",
      bounds: { x: 0, y: 0, width: 1080, height: 200 },
    },
    {
      id: "ig-right-rail",
      name: "Right Engagement Rail",
      severity: "obstruction",
      description: "Heart (like), comment bubble, direct share paper airplane, audio thumbnail",
      bounds: { x: 920, y: 800, width: 160, height: 760 },
    },
    {
      id: "ig-bottom-metadata",
      name: "Bottom Account & Audio",
      severity: "obstruction",
      description: "Profile picture, Follow button, caption snippet, original audio marquee",
      bounds: { x: 0, y: 1580, width: 1080, height: 340 },
    },
  ],
  cautionZones: [
    {
      id: "ig-top-caution",
      name: "Top Caution Buffer",
      severity: "caution",
      description: "Status bar & notch margin",
      bounds: { x: 0, y: 200, width: 1080, height: 50 },
    },
    {
      id: "ig-right-caution",
      name: "Right Rail Margin",
      severity: "caution",
      description: "Margin adjacent to Instagram like and comment icons",
      bounds: { x: 880, y: 800, width: 40, height: 760 },
    },
    {
      id: "ig-captions-hazard",
      name: "Kinetic Captions Zone",
      severity: "caution",
      description: "Reserved space for RightMotion captions",
      bounds: { x: 80, y: 1380, width: 920, height: 180 },
    },
  ],
  recommendedTextRegion: {
    x: 80,
    y: 260,
    width: 800,
    height: 1080,
  },
  recommendedSubjectRegion: {
    x: 64,
    y: 280,
    width: 820,
    height: 1080,
  },
  preferredFocalRegion: {
    x: 120,
    y: 460,
    width: 720,
    height: 640,
  },
  captionsRegion: {
    x: 80,
    y: 1380,
    width: 920,
    height: 180,
  },
};

export const TIKTOK_PROFILE: PlatformProfile = {
  platform: "TIKTOK",
  displayName: "TikTok",
  orientation: "vertical",
  aspectRatio: "9:16",
  canvas: { width: 1080, height: 1920 },
  safeInsets: {
    top: 260,
    bottom: 540,
    left: 72,
    right: 200,
  },
  obstructionZones: [
    {
      id: "tt-top-nav",
      name: "Top Feed Tabs & Search",
      severity: "obstruction",
      description: "Following / For You tabs, LIVE badge, search icon",
      bounds: { x: 0, y: 0, width: 1080, height: 210 },
    },
    {
      id: "tt-right-rail",
      name: "Right Interaction Stack",
      severity: "obstruction",
      description: "Creator avatar with follow +, heart, comments, favorites, share, rotating vinyl",
      bounds: { x: 920, y: 640, width: 160, height: 920 },
    },
    {
      id: "tt-bottom-metadata",
      name: "Bottom Account & Music",
      severity: "obstruction",
      description: "Username, description text, sound marquee, home/inbox navigation bar",
      bounds: { x: 0, y: 1560, width: 1080, height: 360 },
    },
  ],
  cautionZones: [
    {
      id: "tt-top-caution",
      name: "Top Caution Buffer",
      severity: "caution",
      description: "Notch and search bar buffer",
      bounds: { x: 0, y: 210, width: 1080, height: 50 },
    },
    {
      id: "tt-right-caution",
      name: "Right Rail Margin",
      severity: "caution",
      description: "Margin buffer next to TikTok action stack",
      bounds: { x: 880, y: 640, width: 40, height: 920 },
    },
    {
      id: "tt-captions-hazard",
      name: "Kinetic Captions Zone",
      severity: "caution",
      description: "Reserved space for RightMotion captions",
      bounds: { x: 80, y: 1380, width: 920, height: 180 },
    },
  ],
  recommendedTextRegion: {
    x: 80,
    y: 270,
    width: 800,
    height: 1070,
  },
  recommendedSubjectRegion: {
    x: 64,
    y: 280,
    width: 820,
    height: 1080,
  },
  preferredFocalRegion: {
    x: 120,
    y: 460,
    width: 720,
    height: 640,
  },
  captionsRegion: {
    x: 80,
    y: 1380,
    width: 920,
    height: 180,
  },
};

export const GENERIC_VERTICAL_PROFILE: PlatformProfile = {
  platform: "GENERIC_VERTICAL",
  displayName: "Generic Vertical Feed",
  orientation: "vertical",
  aspectRatio: "9:16",
  canvas: { width: 1080, height: 1920 },
  safeInsets: {
    top: 280,
    bottom: 540,
    left: 80,
    right: 210,
  },
  obstructionZones: [
    {
      id: "generic-top-header",
      name: "Top System & Navigation Header",
      severity: "obstruction",
      description: "Top navigation, status icons, device notch",
      bounds: { x: 0, y: 0, width: 1080, height: 240 },
    },
    {
      id: "generic-right-rail",
      name: "Right Action Controls",
      severity: "obstruction",
      description: "Vertical social engagement controls",
      bounds: { x: 910, y: 680, width: 170, height: 880 },
    },
    {
      id: "generic-bottom-metadata",
      name: "Bottom Feed Controls",
      severity: "obstruction",
      description: "Account info, captions, player controls",
      bounds: { x: 0, y: 1560, width: 1080, height: 360 },
    },
  ],
  cautionZones: [
    {
      id: "generic-top-caution",
      name: "Top Caution Buffer",
      severity: "caution",
      description: "Device buffer",
      bounds: { x: 0, y: 240, width: 1080, height: 40 },
    },
    {
      id: "generic-right-caution",
      name: "Right Margin Buffer",
      severity: "caution",
      description: "Margin adjacent to action icons",
      bounds: { x: 870, y: 680, width: 40, height: 880 },
    },
    {
      id: "generic-captions-hazard",
      name: "Captions Reserved Zone",
      severity: "caution",
      description: "Captions reserved zone",
      bounds: { x: 80, y: 1380, width: 920, height: 180 },
    },
  ],
  recommendedTextRegion: {
    x: 80,
    y: 280,
    width: 790,
    height: 1060,
  },
  recommendedSubjectRegion: {
    x: 64,
    y: 300,
    width: 820,
    height: 1060,
  },
  preferredFocalRegion: {
    x: 120,
    y: 480,
    width: 720,
    height: 620,
  },
  captionsRegion: {
    x: 80,
    y: 1380,
    width: 920,
    height: 180,
  },
};

export const PLATFORM_PROFILES: Record<PlatformType, PlatformProfile> = {
  YOUTUBE_SHORTS: YOUTUBE_SHORTS_PROFILE,
  INSTAGRAM_REELS: INSTAGRAM_REELS_PROFILE,
  TIKTOK: TIKTOK_PROFILE,
  GENERIC_VERTICAL: GENERIC_VERTICAL_PROFILE,
};

export function getPlatformProfile(platform: PlatformType = "YOUTUBE_SHORTS"): PlatformProfile {
  return PLATFORM_PROFILES[platform] || YOUTUBE_SHORTS_PROFILE;
}
