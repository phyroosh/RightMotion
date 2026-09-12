/**
 * 📐 RightMotion Platform-Safe Composition Architecture
 * Core Type Definitions
 *
 * LAW: PLATFORM UI IS PART OF THE COMPOSITIONAL ENVIRONMENT.
 * Video Canvas + Platform Safe Region + Creative Focal Region
 */

export type PlatformType =
  | "YOUTUBE_SHORTS"
  | "INSTAGRAM_REELS"
  | "TIKTOK"
  | "GENERIC_VERTICAL";

export type OrientationType = "vertical" | "horizontal";
export type AspectRatioType = "9:16" | "16:9";

export type ElementImportance = "critical" | "important" | "decorative";

export type ZoneSeverity = "obstruction" | "caution" | "safe" | "focal";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PlatformZone {
  id: string;
  name: string;
  bounds: BoundingBox;
  severity: ZoneSeverity;
  description: string;
}

export interface PlatformProfile {
  platform: PlatformType;
  displayName: string;
  orientation: OrientationType;
  aspectRatio: AspectRatioType;
  canvas: {
    width: number;
    height: number;
  };
  safeInsets: Insets;
  obstructionZones: PlatformZone[];
  cautionZones: PlatformZone[];
  recommendedTextRegion: BoundingBox;
  recommendedSubjectRegion: BoundingBox;
  preferredFocalRegion: BoundingBox;
  captionsRegion: BoundingBox;
}

export interface ValidatedElement {
  id: string;
  name: string;
  bounds: BoundingBox;
  importance: ElementImportance;
  frame?: number;
  scene?: string;
  intentionalEdgePlacement?: boolean;
}

export interface AnimatedElement {
  id: string;
  name: string;
  getBounds: (frame: number) => BoundingBox;
  frameRange: [number, number];
  importance: ElementImportance;
  scene?: string;
  intentionalEdgePlacement?: boolean;
}

export type IntersectionSide = "none" | "top" | "bottom" | "left" | "right" | "inside";

export interface ZoneIntersection {
  zoneId: string;
  zoneName: string;
  severity: ZoneSeverity;
  intersectionBox: BoundingBox;
  intrusionPixels: number;
  intrusionPercent: number;
  side: IntersectionSide;
}

export interface ElementValidationResult {
  elementId: string;
  name: string;
  importance: ElementImportance;
  scene?: string;
  frame?: number;
  isSafe: boolean;
  status: "PASS" | "WARNING" | "CRITICAL";
  intersections: ZoneIntersection[];
  maxIntrusion: {
    pixels: number;
    percent: number;
    side: IntersectionSide;
  };
  recommendedCorrection?: string;
}

export interface TrajectoryValidationResult {
  elementId: string;
  name: string;
  importance: ElementImportance;
  scene?: string;
  frameRange: [number, number];
  isSafe: boolean;
  status: "PASS" | "WARNING" | "CRITICAL";
  worstFrame: number;
  unionBounds: BoundingBox;
  intersections: ZoneIntersection[];
  maxIntrusion: {
    pixels: number;
    percent: number;
    side: IntersectionSide;
  };
  recommendedCorrection?: string;
}

export interface VisualQAReportItem {
  platform: string;
  scene: string;
  element: string;
  importance: ElementImportance;
  safe: "YES" | "NO";
  intersection: "NONE" | "TOP" | "BOTTOM" | "SIDE" | "INSIDE";
  maxIntrusionText: string;
  recommendedCorrection: string;
}
