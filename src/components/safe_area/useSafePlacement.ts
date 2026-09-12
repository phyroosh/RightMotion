import { useMemo } from "react";
import { getPlatformProfile } from "../../platform/profiles";
import {
  BoundingBox,
  ElementImportance,
  ElementValidationResult,
  PlatformProfile,
  PlatformType,
} from "../../platform/types";
import { validateElementBounds } from "../../platform/validator";

export interface SafePlacementHelpers {
  profile: PlatformProfile;
  safeTop: number;
  safeBottom: number;
  safeLeft: number;
  safeRight: number;
  safeWidth: number;
  safeHeight: number;
  recommendedTextRegion: BoundingBox;
  recommendedSubjectRegion: BoundingBox;
  preferredFocalRegion: BoundingBox;
  clampToSafeRegion: (bounds: BoundingBox) => BoundingBox;
  validateBounds: (
    id: string,
    name: string,
    bounds: BoundingBox,
    importance?: ElementImportance
  ) => ElementValidationResult;
}

/**
 * 🎬 useSafePlacement Hook
 *
 * Provides platform safe coordinate baselines and validation helpers
 * without imposing rigid universal layouts.
 */
export function useSafePlacement(
  platform: PlatformType = "YOUTUBE_SHORTS"
): SafePlacementHelpers {
  const profile = useMemo(() => getPlatformProfile(platform), [platform]);

  const helpers = useMemo(() => {
    const safeTop = profile.safeInsets.top;
    const safeBottom = profile.canvas.height - profile.safeInsets.bottom;
    const safeLeft = profile.safeInsets.left;
    const safeRight = profile.canvas.width - profile.safeInsets.right;
    const safeWidth = safeRight - safeLeft;
    const safeHeight = safeBottom - safeTop;

    const clampToSafeRegion = (box: BoundingBox): BoundingBox => {
      const clampedX = Math.max(safeLeft, Math.min(box.x, safeRight - box.width));
      const clampedY = Math.max(safeTop, Math.min(box.y, safeBottom - box.height));
      return {
        x: clampedX,
        y: clampedY,
        width: Math.min(box.width, safeWidth),
        height: Math.min(box.height, safeHeight),
      };
    };

    const validateBounds = (
      id: string,
      name: string,
      bounds: BoundingBox,
      importance: ElementImportance = "critical"
    ): ElementValidationResult => {
      return validateElementBounds(
        {
          id,
          name,
          bounds,
          importance,
        },
        profile
      );
    };

    return {
      profile,
      safeTop,
      safeBottom,
      safeLeft,
      safeRight,
      safeWidth,
      safeHeight,
      recommendedTextRegion: profile.recommendedTextRegion,
      recommendedSubjectRegion: profile.recommendedSubjectRegion,
      preferredFocalRegion: profile.preferredFocalRegion,
      clampToSafeRegion,
      validateBounds,
    };
  }, [profile]);

  return helpers;
}
