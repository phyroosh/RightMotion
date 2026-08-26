import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def generate_natural_blink_asset(source_path, target_path, eye_regions):
    img = Image.open(source_path).convert("RGBA")
    arr = np.array(img).astype(np.float32)
    h, w, _ = arr.shape
    
    result = img.copy()
    
    # Eyelash overlay layer for smooth anti-aliased drawing
    lash_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ldraw = ImageDraw.Draw(lash_layer)
    
    for (cx, cy, rx, ry, tilt_angle) in eye_regions:
        # Create elliptical mask for eye socket
        mask = Image.new("L", (w, h), 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
        
        mask = mask.filter(ImageFilter.GaussianBlur(1.0))
        marr = np.array(mask).astype(np.float32) / 255.0
        
        # Sample average eyelid skin tone
        skin_r, skin_g, skin_b = 242, 216, 203
        
        # Blend eyelid skin over iris & sclera
        for y in range(max(0, int(cy - ry - 2)), min(h, int(cy + ry + 2))):
            for x in range(max(0, int(cx - rx - 2)), min(w, int(cx + rx + 2))):
                alpha_weight = marr[y, x]
                if alpha_weight > 0.05:
                    orig_r, orig_g, orig_b, orig_a = arr[y, x]
                    luminance = 0.299 * orig_r + 0.587 * orig_g + 0.114 * orig_b
                    
                    if luminance < 80:
                        # Dark glasses frame or hair line
                        continue
                    elif luminance < 125:
                        blend_factor = alpha_weight * 0.45
                    else:
                        blend_factor = alpha_weight * 0.94
                    
                    # Vertical gradient shading on eyelid
                    v_pos = (y - (cy - ry)) / (2.0 * ry)
                    shade = 0.95 + (0.07 * v_pos)
                    
                    new_r = orig_r * (1 - blend_factor) + (skin_r * shade) * blend_factor
                    new_g = orig_g * (1 - blend_factor) + (skin_g * shade) * blend_factor
                    new_b = orig_b * (1 - blend_factor) + (skin_b * shade) * blend_factor
                    
                    result.putpixel((x, y), (int(new_r), int(new_g), int(new_b), int(orig_a)))
        
        # Draw smooth, delicate closed eyelash curve
        lash_y_center = cy + ry * 0.18
        pts = [
            (cx - rx * 0.88, cy - ry * 0.12),
            (cx - rx * 0.55, lash_y_center - 0.5),
            (cx - rx * 0.15, lash_y_center + 0.5),
            (cx + rx * 0.35, lash_y_center),
            (cx + rx * 0.85, cy - ry * 0.22),
        ]
        
        # Multi-stroke soft eyelash
        ldraw.line(pts, fill=(50, 26, 22, 235), width=max(2, int(rx * 0.14)))
        ldraw.line([(p[0], p[1] - 0.5) for p in pts], fill=(90, 48, 40, 160), width=1)

    # Soften lash layer slightly and composite
    lash_layer = lash_layer.filter(ImageFilter.GaussianBlur(0.4))
    result = Image.alpha_composite(result, lash_layer)
    
    os.makedirs(os.path.dirname(target_path) or ".", exist_ok=True)
    result.save(target_path, "PNG")
    print(f"✅ Saved blink asset: {target_path}")

def generate_all_blinks():
    poses = [
        # 1. character_pointing
        ("public/character_pointing.png", "public/character_pointing_blink.png", [
            (286, 160, 21, 13, 0),
            (350, 136, 21, 13, 0)
        ]),
        # 2. character_crossed
        ("public/character_crossed.png", "public/character_crossed_blink.png", [
            (285, 172, 21, 13, 0),
            (348, 149, 21, 13, 0)
        ]),
        # 3. character_open
        ("public/character_open.png", "public/character_open_blink.png", [
            (314, 155, 21, 13, 0),
            (376, 136, 21, 13, 0)
        ]),
        # 4. character_fullbody_pointing
        ("public/character_fullbody_pointing.png", "public/character_fullbody_pointing_blink.png", [
            (334, 103, 15, 9, 0),
            (380, 87, 15, 9, 0)
        ]),
        # 5. character_fullbody_open
        ("public/character_fullbody_open.png", "public/character_fullbody_open_blink.png", [
            (334, 103, 15, 9, 0),
            (380, 87, 15, 9, 0)
        ]),
        # 6. character_fullbody_casual
        ("public/character_fullbody_casual.png", "public/character_fullbody_casual_blink.png", [
            (334, 103, 15, 9, 0),
            (380, 87, 15, 9, 0)
        ]),
    ]

    for src, dst, eyes in poses:
        if os.path.exists(src):
            generate_natural_blink_asset(src, dst, eyes)

if __name__ == "__main__":
    generate_all_blinks()
