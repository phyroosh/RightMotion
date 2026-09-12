#!/usr/bin/env python3
"""
📐 RightMotion Platform-Safe Composition Engine & QA Validator

LAW: PLATFORM UI IS PART OF THE COMPOSITIONAL ENVIRONMENT.
Video Canvas + Platform Safe Region + Creative Focal Region

Validates scenes against platform-specific obstruction & caution zones:
  - YOUTUBE_SHORTS (Primary)
  - INSTAGRAM_REELS
  - TIKTOK
  - GENERIC_VERTICAL

Generates the official RightMotion Section 25 Visual QA Report.
"""

import sys
import os
import re
import json
from dataclasses import dataclass, field
from typing import List, Dict, Tuple, Optional, Any, Callable
from pathlib import Path

# Terminal colors
BOLD = "\033[1m"
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RESET = "\033[0m"


@dataclass
class BoundingBox:
    x: float
    y: float
    width: float
    height: float

    @property
    def right(self) -> float:
        return self.x + self.width

    @property
    def bottom(self) -> float:
        return self.y + self.height

    @property
    def area(self) -> float:
        return max(0.0, self.width) * max(0.0, self.height)


@dataclass
class PlatformZone:
    id: str
    name: str
    bounds: BoundingBox
    severity: str  # 'obstruction' | 'caution'
    description: str


@dataclass
class PlatformProfile:
    platform: str
    display_name: str
    canvas_width: int
    canvas_height: int
    safe_insets: Dict[str, float]
    obstruction_zones: List[PlatformZone]
    caution_zones: List[PlatformZone]
    recommended_text_region: BoundingBox
    recommended_subject_region: BoundingBox
    preferred_focal_region: BoundingBox
    captions_region: BoundingBox


# -------------------------------------------------------------
# Platform Profiles
# -------------------------------------------------------------

YOUTUBE_SHORTS_PROFILE = PlatformProfile(
    platform="YOUTUBE_SHORTS",
    display_name="YouTube Shorts",
    canvas_width=1080,
    canvas_height=1920,
    safe_insets={"top": 280, "bottom": 540, "left": 72, "right": 210},
    obstruction_zones=[
        PlatformZone(
            id="yt-top-nav",
            name="Top Navigation Bar",
            severity="obstruction",
            description="Search button, Shorts camera, 3-dots menu, sound selector",
            bounds=BoundingBox(0, 0, 1080, 230),
        ),
        PlatformZone(
            id="yt-right-rail",
            name="Right Engagement Rail",
            severity="obstruction",
            description="Like, Dislike, Comments, Share, Remix buttons and rotating sound disc",
            bounds=BoundingBox(910, 700, 170, 860),
        ),
        PlatformZone(
            id="yt-bottom-metadata",
            name="Bottom Channel & Metadata",
            severity="obstruction",
            description="Channel avatar, handle, Subscribe pill, video title snippet, audio banner",
            bounds=BoundingBox(0, 1560, 1080, 360),
        ),
    ],
    caution_zones=[
        PlatformZone(
            id="yt-top-caution",
            name="Top Caution Buffer",
            severity="caution",
            description="Hardware notch, dynamic island, device status bar variations",
            bounds=BoundingBox(0, 230, 1080, 50),
        ),
        PlatformZone(
            id="yt-right-caution",
            name="Right Rail Margin Buffer",
            severity="caution",
            description="Buffer zone directly adjacent to vertical action icons",
            bounds=BoundingBox(870, 700, 40, 860),
        ),
        PlatformZone(
            id="yt-captions-hazard",
            name="Kinetic Captions Zone",
            severity="caution",
            description="Reserved space for AppleKineticCaptions. Critical graphics must not collide.",
            bounds=BoundingBox(80, 1380, 920, 180),
        ),
    ],
    recommended_text_region=BoundingBox(80, 280, 790, 1060),
    recommended_subject_region=BoundingBox(64, 300, 820, 1060),
    preferred_focal_region=BoundingBox(120, 480, 720, 620),
    captions_region=BoundingBox(80, 1380, 920, 180),
)

INSTAGRAM_REELS_PROFILE = PlatformProfile(
    platform="INSTAGRAM_REELS",
    display_name="Instagram Reels",
    canvas_width=1080,
    canvas_height=1920,
    safe_insets={"top": 250, "bottom": 540, "left": 72, "right": 200},
    obstruction_zones=[
        PlatformZone(
            id="ig-top-header",
            name="Reels Top Header",
            severity="obstruction",
            description="Reels title header, camera icon, audio track selector",
            bounds=BoundingBox(0, 0, 1080, 200),
        ),
        PlatformZone(
            id="ig-right-rail",
            name="Right Engagement Rail",
            severity="obstruction",
            description="Heart (like), comment bubble, direct share paper airplane, audio thumbnail",
            bounds=BoundingBox(920, 800, 160, 760),
        ),
        PlatformZone(
            id="ig-bottom-metadata",
            name="Bottom Account & Audio",
            severity="obstruction",
            description="Profile picture, Follow button, caption snippet, original audio marquee",
            bounds=BoundingBox(0, 1580, 1080, 340),
        ),
    ],
    caution_zones=[
        PlatformZone(
            id="ig-top-caution",
            name="Top Caution Buffer",
            severity="caution",
            description="Status bar & notch margin",
            bounds=BoundingBox(0, 200, 1080, 50),
        ),
        PlatformZone(
            id="ig-right-caution",
            name="Right Rail Margin",
            severity="caution",
            description="Margin adjacent to Instagram like and comment icons",
            bounds=BoundingBox(880, 800, 40, 760),
        ),
        PlatformZone(
            id="ig-captions-hazard",
            name="Kinetic Captions Zone",
            severity="caution",
            description="Reserved space for RightMotion captions",
            bounds=BoundingBox(80, 1380, 920, 180),
        ),
    ],
    recommended_text_region=BoundingBox(80, 260, 800, 1080),
    recommended_subject_region=BoundingBox(64, 280, 820, 1080),
    preferred_focal_region=BoundingBox(120, 460, 720, 640),
    captions_region=BoundingBox(80, 1380, 920, 180),
)

TIKTOK_PROFILE = PlatformProfile(
    platform="TIKTOK",
    display_name="TikTok",
    canvas_width=1080,
    canvas_height=1920,
    safe_insets={"top": 260, "bottom": 540, "left": 72, "right": 200},
    obstruction_zones=[
        PlatformZone(
            id="tt-top-nav",
            name="Top Feed Tabs & Search",
            severity="obstruction",
            description="Following / For You tabs, LIVE badge, search icon",
            bounds=BoundingBox(0, 0, 1080, 210),
        ),
        PlatformZone(
            id="tt-right-rail",
            name="Right Interaction Stack",
            severity="obstruction",
            description="Creator avatar with follow +, heart, comments, favorites, share, rotating vinyl",
            bounds=BoundingBox(920, 640, 160, 920),
        ),
        PlatformZone(
            id="tt-bottom-metadata",
            name="Bottom Account & Music",
            severity="obstruction",
            description="Username, description text, sound marquee, home/inbox navigation bar",
            bounds=BoundingBox(0, 1560, 1080, 360),
        ),
    ],
    caution_zones=[
        PlatformZone(
            id="tt-top-caution",
            name="Top Caution Buffer",
            severity="caution",
            description="Notch and search bar buffer",
            bounds=BoundingBox(0, 210, 1080, 50),
        ),
        PlatformZone(
            id="tt-right-caution",
            name="Right Rail Margin",
            severity="caution",
            description="Margin buffer next to TikTok action stack",
            bounds=BoundingBox(880, 640, 40, 920),
        ),
        PlatformZone(
            id="tt-captions-hazard",
            name="Kinetic Captions Zone",
            severity="caution",
            description="Reserved space for RightMotion captions",
            bounds=BoundingBox(80, 1380, 920, 180),
        ),
    ],
    recommended_text_region=BoundingBox(80, 270, 800, 1070),
    recommended_subject_region=BoundingBox(64, 280, 820, 1080),
    preferred_focal_region=BoundingBox(120, 460, 720, 640),
    captions_region=BoundingBox(80, 1380, 920, 180),
)

PLATFORM_PROFILES = {
    "YOUTUBE_SHORTS": YOUTUBE_SHORTS_PROFILE,
    "INSTAGRAM_REELS": INSTAGRAM_REELS_PROFILE,
    "TIKTOK": TIKTOK_PROFILE,
}


def get_profile(platform: str = "YOUTUBE_SHORTS") -> PlatformProfile:
    return PLATFORM_PROFILES.get(platform, YOUTUBE_SHORTS_PROFILE)


# -------------------------------------------------------------
# Intersection & Validation Math
# -------------------------------------------------------------

def calculate_box_intersection(a: BoundingBox, b: BoundingBox) -> Tuple[float, Optional[BoundingBox], float, float]:
    left = max(a.x, b.x)
    right = min(a.right, b.right)
    top = max(a.y, b.y)
    bottom = min(a.bottom, b.bottom)

    x_overlap = max(0.0, right - left)
    y_overlap = max(0.0, bottom - top)
    area = x_overlap * y_overlap

    if area > 0:
        return area, BoundingBox(left, top, x_overlap, y_overlap), x_overlap, y_overlap
    return 0.0, None, 0.0, 0.0


def determine_intersection_side(element_box: BoundingBox, zone: PlatformZone, canvas_h: int, canvas_w: int) -> str:
    if zone.bounds.y == 0 or zone.bounds.y < 300:
        return "TOP"
    if zone.bounds.bottom >= canvas_h - 50 or zone.bounds.y > 1300:
        return "BOTTOM"
    if zone.bounds.right >= canvas_w - 50 or zone.bounds.x > 800:
        return "SIDE"
    if zone.bounds.x == 0 or zone.bounds.x < 150:
        return "SIDE"
    return "INSIDE"


@dataclass
class ValidationReport:
    platform: str
    scene: str
    element: str
    importance: str
    is_safe: bool
    status: str  # 'PASS' | 'WARNING' | 'CRITICAL'
    intersection: str  # 'NONE' | 'TOP' | 'BOTTOM' | 'SIDE' | 'INSIDE'
    max_intrusion_pixels: float
    max_intrusion_percent: float
    recommended_correction: str
    intersections: List[Dict[str, Any]] = field(default_factory=list)
    worst_frame: Optional[int] = None

    def render_section_25(self) -> str:
        """Formats the official Section 25 QA report block."""
        pct_str = f" ({self.max_intrusion_percent:.1f}% of element)" if self.max_intrusion_pixels > 0 else ""
        intrusion_str = f"{int(round(self.max_intrusion_pixels))} pixels{pct_str}" if self.max_intrusion_pixels > 0 else "0 pixels or 0.0%"

        return f"""Platform:
{self.platform}

Scene:
{self.scene}

Element:
{self.element}

Importance:
{self.importance.upper()}

Safe:
{"YES" if self.is_safe else "NO"}

Intersection:
{self.intersection}

Maximum intrusion:
{intrusion_str}

Recommended correction:
{self.recommended_correction}"""


def validate_element(
    element_id: str,
    name: str,
    bounds: BoundingBox,
    importance: str = "critical",
    scene: str = "Scene 1",
    profile: Optional[PlatformProfile] = None,
    intentional_edge_placement: bool = False,
) -> ValidationReport:
    if profile is None:
        profile = YOUTUBE_SHORTS_PROFILE

    all_zones = profile.obstruction_zones + profile.caution_zones
    element_area = max(1.0, bounds.area)

    max_intrusion_px = 0.0
    max_intrusion_pct = 0.0
    primary_side = "NONE"
    has_obstruction = False
    has_caution = False
    intersections_data = []

    for zone in all_zones:
        area, ibox, x_ov, y_ov = calculate_box_intersection(bounds, zone.bounds)
        if area > 0:
            side = determine_intersection_side(bounds, zone, profile.canvas_height, profile.canvas_width)
            intrusion_px = y_ov if side in ("TOP", "BOTTOM") else x_ov
            intrusion_pct = (area / element_area) * 100.0

            if intrusion_px > max_intrusion_px:
                max_intrusion_px = intrusion_px
                max_intrusion_pct = intrusion_pct
                primary_side = side

            if zone.severity == "obstruction":
                has_obstruction = True
            elif zone.severity == "caution":
                has_caution = True

            intersections_data.append({
                "zone_id": zone.id,
                "zone_name": zone.name,
                "severity": zone.severity,
                "side": side,
                "intrusion_px": intrusion_px,
                "intrusion_pct": intrusion_pct,
            })

    importance_lower = importance.lower()
    is_safe = True
    status = "PASS"
    correction = "None — element is positioned safely within platform bounds."

    if importance_lower == "critical":
        if has_obstruction:
            is_safe = False
            status = "CRITICAL"
            if primary_side == "TOP":
                req_y = profile.recommended_text_region.y
                correction = f"Reposition element downward into safe text zone (recommended y >= {int(req_y)}px) or rescale to clear top navigation."
            elif primary_side == "BOTTOM":
                max_y = profile.recommended_text_region.bottom
                correction = f"Elevate element above caption/metadata hazard (recommended bottom edge <= {int(max_y)}px)."
            elif primary_side == "SIDE":
                max_x = profile.recommended_text_region.right
                correction = f"Shift element leftward (recommended right edge <= {int(max_x)}px) to avoid right engagement rail collision."
            else:
                correction = "Restructure scene or rescale element to fit within recommended text region."
        elif has_caution:
            is_safe = False
            status = "WARNING"
            correction = f"Critical element encroaches into caution zone ({int(max_intrusion_px)}px). Nudge toward central focal region to ensure cross-device safety."
    elif importance_lower == "important":
        if has_obstruction:
            is_safe = False
            status = "WARNING"
            correction = f"Important supporting element overlaps platform obstruction ({primary_side}). Adjust alignment, reduce scale, or move to secondary focal area."
        else:
            is_safe = True
            status = "PASS"
    else:  # decorative
        if intentional_edge_placement or has_obstruction:
            is_safe = True
            status = "PASS"
            correction = "Intentional edge composition for decorative/ambient visual permitted."

    return ValidationReport(
        platform=profile.display_name,
        scene=scene,
        element=name,
        importance=importance,
        is_safe=is_safe,
        status=status,
        intersection=primary_side,
        max_intrusion_pixels=max_intrusion_px,
        max_intrusion_percent=max_intrusion_pct,
        recommended_correction=correction,
        intersections=intersections_data,
    )


def validate_trajectory(
    element_id: str,
    name: str,
    get_bounds_fn: Callable[[int], BoundingBox],
    frame_range: Tuple[int, int],
    importance: str = "critical",
    scene: str = "Scene 1",
    profile: Optional[PlatformProfile] = None,
    step_frames: int = 4,
) -> ValidationReport:
    """Validates an animated element across its full motion trajectory."""
    if profile is None:
        profile = YOUTUBE_SHORTS_PROFILE

    start_frame, end_frame = frame_range
    worst_report: Optional[ValidationReport] = None
    worst_frame = start_frame

    frames_to_test = list(range(start_frame, end_frame + 1, step_frames))
    if end_frame not in frames_to_test:
        frames_to_test.append(end_frame)

    for f in frames_to_test:
        box = get_bounds_fn(f)
        rep = validate_element(
            element_id=element_id,
            name=name,
            bounds=box,
            importance=importance,
            scene=f"{scene} (Frame {f})",
            profile=profile,
        )
        if worst_report is None or (rep.max_intrusion_pixels > worst_report.max_intrusion_pixels) or (rep.status == "CRITICAL" and worst_report.status != "CRITICAL"):
            worst_report = rep
            worst_frame = f

    if worst_report is None:
        return validate_element(element_id, name, get_bounds_fn(start_frame), importance, scene, profile)

    # Adjust scene title & message
    worst_report.worst_frame = worst_frame
    worst_report.scene = f"{scene} [Trajectory Worst Frame: {worst_frame}]"
    if not worst_report.is_safe:
        worst_report.recommended_correction = f"Motion path collision at frame {worst_frame}: {worst_report.recommended_correction}"
    return worst_report


# -------------------------------------------------------------
# Static Clip Code Audit
# -------------------------------------------------------------

def audit_clip_source(clip_name: str, root_dir: Optional[Path] = None) -> List[ValidationReport]:
    """Inspects Canvas.tsx of a clip to detect potential platform UI collisions."""
    if root_dir is None:
        root_dir = Path(__file__).resolve().parent.parent

    canvas_file = root_dir / "src" / "clips" / clip_name / "Canvas.tsx"
    if not canvas_file.exists():
        return []

    code = canvas_file.read_text(encoding="utf-8")
    reports = []

    # Check for obsolete top paddings: pt-[6%], pt-[8%], pt-[9%], pt-[10%]
    # In CSS, percentage padding is based on WIDTH (1080px), so pt-[8%] = 86px!
    old_pt_matches = re.finditer(r'pt-\[(\d+(?:\.\d+)?)%\]', code)
    for m in old_pt_matches:
        pct = float(m.group(1))
        # Equivalent pixels from top
        calc_y = (pct / 100.0) * 1080.0
        if calc_y < 230:
            reports.append(
                ValidationReport(
                    platform="YouTube Shorts",
                    scene=f"Canvas.tsx line ~{code[:m.start()].count(chr(10)) + 1}",
                    element=f"Container with Tailwind pt-[{pct}%] ({int(calc_y)}px)",
                    importance="CRITICAL",
                    is_safe=False,
                    status="CRITICAL",
                    intersection="TOP",
                    max_intrusion_pixels=230 - calc_y,
                    max_intrusion_percent=((230 - calc_y) / 230.0) * 100.0,
                    recommended_correction=f"Tailwind percentage padding is calculated from width (1080px)! pt-[{pct}%] resolves to {int(calc_y)}px, which collides with Shorts top navigation (0-230px). Use style={{{{ paddingTop: 280 }}}} instead.",
                )
            )

    return reports


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_clip = sys.argv[1]
        reps = audit_clip_source(target_clip)
        if reps:
            print(f"\n{RED}{BOLD}❌ Platform Safe Violations in '{target_clip}':{RESET}\n")
            for r in reps:
                print(r.render_section_25())
                print("-" * 50)
            sys.exit(1)
        else:
            print(f"\n{GREEN}{BOLD}✅ Clip '{target_clip}' passes Platform Safe standards!{RESET}\n")
            sys.exit(0)
    else:
        print("Usage: python3 platform_safe_validator.py <clip_name>")
        sys.exit(0)
