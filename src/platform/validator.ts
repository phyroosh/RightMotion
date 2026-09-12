/**
 * 📐 RightMotion Platform Safe Validator
 *
 * Provides deterministic bounding-box, intersection calculation,
 * animated trajectory validation, and the official Section 25 Visual QA Report generator.
 */

import {
  AnimatedElement,
  BoundingBox,
  ElementValidationResult,
  IntersectionSide,
  PlatformProfile,
  PlatformZone,
  TrajectoryValidationResult,
  ValidatedElement,
  VisualQAReportItem,
  ZoneIntersection,
} from "./types";

/**
 * Calculates rectangle intersection between two bounding boxes
 */
export function calculateBoxIntersection(
  a: BoundingBox,
  b: BoundingBox
): { area: number; intersectionBox: BoundingBox; xOverlap: number; yOverlap: number } {
  const left = Math.max(a.x, b.x);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const top = Math.max(a.y, b.y);
  const bottom = Math.min(a.y + a.height, b.y + b.height);

  const xOverlap = Math.max(0, right - left);
  const yOverlap = Math.max(0, bottom - top);
  const area = xOverlap * yOverlap;

  return {
    area,
    xOverlap,
    yOverlap,
    intersectionBox: {
      x: area > 0 ? left : 0,
      y: area > 0 ? top : 0,
      width: xOverlap,
      height: yOverlap,
    },
  };
}

/**
 * Determines which side of the platform canvas the intersection primarily occurs on
 */
export function determineIntersectionSide(
  elementBox: BoundingBox,
  zone: PlatformZone,
  canvasHeight: number,
  canvasWidth: number
): IntersectionSide {
  if (zone.bounds.y === 0 || zone.bounds.y < 300) {
    return "top";
  }
  if (zone.bounds.y + zone.bounds.height >= canvasHeight - 50 || zone.bounds.y > 1300) {
    return "bottom";
  }
  if (zone.bounds.x + zone.bounds.width >= canvasWidth - 50 || zone.bounds.x > 800) {
    return "right";
  }
  if (zone.bounds.x === 0 || zone.bounds.x < 150) {
    return "left";
  }
  return "inside";
}

/**
 * Validates a single element's static bounding box against platform zones
 */
export function validateElementBounds(
  element: ValidatedElement,
  profile: PlatformProfile
): ElementValidationResult {
  const intersections: ZoneIntersection[] = [];
  const allZones = [...profile.obstructionZones, ...profile.cautionZones];

  let maxIntrusionPx = 0;
  let maxIntrusionPct = 0;
  let primarySide: IntersectionSide = "none";
  let hasObstruction = false;
  let hasCaution = false;

  const elementArea = Math.max(1, element.bounds.width * element.bounds.height);

  for (const zone of allZones) {
    const { area, intersectionBox, yOverlap, xOverlap } = calculateBoxIntersection(
      element.bounds,
      zone.bounds
    );

    if (area > 0) {
      const side = determineIntersectionSide(
        element.bounds,
        zone,
        profile.canvas.height,
        profile.canvas.width
      );

      const intrusionPx = side === "top" || side === "bottom" ? yOverlap : xOverlap;
      const intrusionPct = (area / elementArea) * 100;

      if (intrusionPx > maxIntrusionPx) {
        maxIntrusionPx = intrusionPx;
        maxIntrusionPct = intrusionPct;
        primarySide = side;
      }

      if (zone.severity === "obstruction") {
        hasObstruction = true;
      } else if (zone.severity === "caution") {
        hasCaution = true;
      }

      intersections.push({
        zoneId: zone.id,
        zoneName: zone.name,
        severity: zone.severity,
        intersectionBox,
        intrusionPixels: intrusionPx,
        intrusionPercent: Math.round(intrusionPct * 10) / 10,
        side,
      });
    }
  }

  // Evaluate safety status based on importance
  let isSafe = true;
  let status: "PASS" | "WARNING" | "CRITICAL" = "PASS";
  let recommendedCorrection = "None — element is positioned safely within platform bounds.";

  if (element.importance === "critical") {
    if (hasObstruction) {
      isSafe = false;
      status = "CRITICAL";
      if (primarySide === "top") {
        const requiredY = profile.recommendedTextRegion.y;
        recommendedCorrection = `Reposition element downward into safe text zone (recommended y >= ${requiredY}px) or rescale to clear top navigation.`;
      } else if (primarySide === "bottom") {
        const maxY = profile.recommendedTextRegion.y + profile.recommendedTextRegion.height;
        recommendedCorrection = `Elevate element above caption/metadata hazard (recommended bottom edge <= ${maxY}px).`;
      } else if (primarySide === "right") {
        const maxX = profile.recommendedTextRegion.x + profile.recommendedTextRegion.width;
        recommendedCorrection = `Shift element leftward (recommended right edge <= ${maxX}px) to avoid right engagement rail collision.`;
      } else {
        recommendedCorrection = `Reposition or rescale element to fit within recommended text region [x: ${profile.recommendedTextRegion.x}..${profile.recommendedTextRegion.x + profile.recommendedTextRegion.width}, y: ${profile.recommendedTextRegion.y}..${profile.recommendedTextRegion.y + profile.recommendedTextRegion.height}].`;
      }
    } else if (hasCaution) {
      isSafe = false;
      status = "WARNING";
      recommendedCorrection = `Critical element encroaches into caution zone (${maxIntrusionPx}px). Nudge toward central focal region to ensure cross-device safety.`;
    }
  } else if (element.importance === "important") {
    if (hasObstruction) {
      isSafe = false;
      status = "WARNING";
      recommendedCorrection = `Important supporting element overlaps platform obstruction (${primarySide}). Adjust alignment, reduce scale, or move to secondary focal area.`;
    } else {
      isSafe = true;
      status = "PASS";
    }
  } else {
    // Decorative
    if (element.intentionalEdgePlacement) {
      isSafe = true;
      status = "PASS";
      recommendedCorrection = "Intentional edge composition for decorative visual element permitted.";
    } else if (hasObstruction) {
      isSafe = true;
      status = "PASS";
      recommendedCorrection = "Decorative element overlaps UI; permitted if background/ambient visual.";
    }
  }

  return {
    elementId: element.id,
    name: element.name,
    importance: element.importance,
    scene: element.scene,
    frame: element.frame,
    isSafe,
    status,
    intersections,
    maxIntrusion: {
      pixels: maxIntrusionPx,
      percent: Math.round(maxIntrusionPct * 10) / 10,
      side: primarySide,
    },
    recommendedCorrection,
  };
}

/**
 * Validates animated trajectory across frames
 */
export function validateAnimatedTrajectory(
  element: AnimatedElement,
  profile: PlatformProfile,
  stepFrames: number = 4
): TrajectoryValidationResult {
  const [startFrame, endFrame] = element.frameRange;
  let worstResult: ElementValidationResult | null = null;
  let worstFrame = startFrame;
  let maxIntrusion = 0;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const keyframesToTest: number[] = [];
  for (let f = startFrame; f <= endFrame; f += stepFrames) {
    keyframesToTest.push(f);
  }
  if (!keyframesToTest.includes(endFrame)) {
    keyframesToTest.push(endFrame);
  }

  for (const f of keyframesToTest) {
    const box = element.getBounds(f);
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);

    const res = validateElementBounds(
      {
        id: element.id,
        name: element.name,
        bounds: box,
        importance: element.importance,
        frame: f,
        scene: element.scene,
        intentionalEdgePlacement: element.intentionalEdgePlacement,
      },
      profile
    );

    if (!worstResult || res.maxIntrusion.pixels > maxIntrusion || (res.status === "CRITICAL" && worstResult.status !== "CRITICAL")) {
      maxIntrusion = res.maxIntrusion.pixels;
      worstResult = res;
      worstFrame = f;
    }
  }

  const unionBounds: BoundingBox = {
    x: minX,
    y: minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };

  const finalResult = worstResult || validateElementBounds(
    {
      id: element.id,
      name: element.name,
      bounds: element.getBounds(startFrame),
      importance: element.importance,
      frame: startFrame,
      scene: element.scene,
      intentionalEdgePlacement: element.intentionalEdgePlacement,
    },
    profile
  );

  return {
    elementId: element.id,
    name: element.name,
    importance: element.importance,
    scene: element.scene,
    frameRange: element.frameRange,
    isSafe: finalResult.isSafe,
    status: finalResult.status,
    worstFrame,
    unionBounds,
    intersections: finalResult.intersections,
    maxIntrusion: finalResult.maxIntrusion,
    recommendedCorrection:
      finalResult.status !== "PASS"
        ? `Trajectory violation at frame ${worstFrame}: ${finalResult.recommendedCorrection}`
        : "None — entire animated trajectory remains within acceptable zones.",
  };
}

/**
 * Generates the official Section 25 Visual QA Report item
 */
export function formatVisualQAReportItem(
  result: ElementValidationResult | TrajectoryValidationResult,
  platformName: string = "YouTube Shorts"
): VisualQAReportItem {
  let intersectionStr: "NONE" | "TOP" | "BOTTOM" | "SIDE" | "INSIDE" = "NONE";
  if (result.maxIntrusion.side === "top") intersectionStr = "TOP";
  else if (result.maxIntrusion.side === "bottom") intersectionStr = "BOTTOM";
  else if (result.maxIntrusion.side === "left" || result.maxIntrusion.side === "right") intersectionStr = "SIDE";
  else if (result.maxIntrusion.side === "inside") intersectionStr = "INSIDE";

  const intrusionText =
    result.maxIntrusion.pixels > 0
      ? `${result.maxIntrusion.pixels}px (${result.maxIntrusion.percent}% of element)`
      : "0px (0.0%)";

  return {
    platform: platformName,
    scene: result.scene || "Scene 1",
    element: result.name,
    importance: result.importance,
    safe: result.isSafe ? "YES" : "NO",
    intersection: intersectionStr,
    maxIntrusionText: intrusionText,
    recommendedCorrection: result.recommendedCorrection || "None",
  };
}

/**
 * Formats a block of text matching Section 25 exactly
 */
export function renderSection25ReportText(item: VisualQAReportItem): string {
  return [
    `Platform:`,
    `${item.platform}`,
    ``,
    `Scene:`,
    `${item.scene}`,
    ``,
    `Element:`,
    `${item.element}`,
    ``,
    `Importance:`,
    `${item.importance.toUpperCase()}`,
    ``,
    `Safe:`,
    `${item.safe}`,
    ``,
    `Intersection:`,
    `${item.intersection}`,
    ``,
    `Maximum intrusion:`,
    `${item.maxIntrusionText}`,
    ``,
    `Recommended correction:`,
    `${item.recommendedCorrection}`,
  ].join("\n");
}
