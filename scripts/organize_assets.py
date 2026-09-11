#!/usr/bin/env python3
"""
RightMotion Cutout Asset Organizer & Visual Catalog Generator
Copies 45 cutout assets into semantic public/assets/ categories,
generates public/assets/registry.json, and renders high-res visual contact sheets.
"""

import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

import os
import shutil
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = Path(r"c:\Toptier Products\RightClips")
DESKTOP_DIR = Path(r"C:\Users\Qwen\Desktop\Assets")
PUBLIC_ASSETS_DIR = ROOT_DIR / "public" / "assets"

ASSET_MAPPINGS = [
    # Psychology & Neuroscience
    ("Brain/2.png", "psychology", "hyperrealistic_3d_glowing_brain.png", "3D Glowing Neural Brain", "Hyper-realistic 3D glass brain with glowing synapses and electrical sparks", "insightful", "whoosh_sparkle", ["brain", "neuroscience", "rewire", "neuroplasticity", "mind", "iq", "genius", "clarity"]),
    ("10 on 10 assets/1.png", "psychology", "dopamine_head_circuit.png", "Dopamine Circuit Head", "Head profile outline with DOPAMINE text and neural circuit vesicles", "analytical", "click", ["dopamine", "circuit", "neurotransmitter", "reward", "habit", "addiction"]),
    ("10 on 10 assets/2.png", "psychology", "neurotransmitter_molecule_head.png", "Neurotransmitter Molecule", "Chemical formula structure HO-C-HO inside profile silhouette", "scientific", "click", ["molecule", "chemistry", "biology", "hormone", "serotonin", "dopamine"]),
    ("10 on 10 assets/5.png", "psychology", "dopamine_sparks_brain.png", "Dopamine Spark Mind", "Silhouette head with explosive dopamine spark particles in brain", "energetic", "whoosh_sparkle", ["spark", "dopamine", "motivation", "energy", "drive", "focus"]),
    ("10 on 10 assets/36.png", "psychology", "enlightened_mind_insight.png", "Enlightened Mind Insight", "Head outline with radiating light rays emanating from brain", "epiphany", "whoosh_sparkle", ["insight", "breakthrough", "epiphany", "realization", "clarity", "wisdom"]),
    ("10 on 10 assets/37.png", "psychology", "emotional_regulation_branches.png", "Emotional Regulation Node", "Brain branching into 3 emotional state nodes (happy, neutral, sad)", "diagnostic", "click", ["regulation", "emotions", "balance", "mood", "mental state", "psychology"]),
    ("10 on 10 assets/38.png", "psychology", "mindful_heart_gratitude.png", "Mindful Gratitude Sparks", "Hands offering uplifted glowing heart and radiant energy sparks", "uplifting", "whoosh_sparkle", ["gratitude", "mindfulness", "peace", "spiritual", "calm", "acceptance"]),
    ("10 on 10 assets/41.png", "psychology", "heart_and_brain_harmony.png", "Heart & Brain Harmony", "Cute mascot brain and heart holding hands walking in harmony", "warm", "whoosh_sparkle", ["harmony", "balance", "heart", "logic", "emotions", "alignment"]),
    ("10 on 10 assets/42.png", "psychology", "tangled_confusion_chaos.png", "Tangled Confusion Knot", "Dense scribble ball with ?! marks showing chaotic racing thoughts", "chaotic", "whoosh_deep", ["confusion", "overthinking", "chaos", "rumination", "mess", "stress"]),
    ("Brain/1.png", "psychology", "head_brain_cortex_outline.png", "Anatomical Cortex Profile", "Clean anatomical brain cortex structure inside head outline", "clinical", "click", ["cortex", "prefrontal", "anatomy", "neurobiology", "structure"]),
    ("Brain/Brain.png", "psychology", "head_brain_clean_outline.png", "Minimalist Mind Outline", "Minimal line-art head profile with cerebral convolutions", "minimal", "click", ["thought", "thinking", "mental", "mind", "intellect"]),

    # Burnout & Exhaustion
    ("10 on 10 assets/4.png", "burnout", "brain_battery_depleted.png", "Brain Battery Depleted", "Brain with embedded battery bar at red empty level", "drained", "whoosh_deep", ["burnout", "exhaustion", "drain", "tired", "low energy", "fatigue"]),
    ("10 on 10 assets/23.png", "burnout", "head_battery_empty.png", "Head Battery Critical", "Silhouette head profile with red flashing low battery warning", "critical", "whoosh_deep", ["depleted", "energy", "sleep", "rest", "limit", "overload"]),
    ("10 on 10 assets/9.png", "burnout", "battery_low_red.png", "Low Red Battery Bar", "Minimalist horizontal battery bar with single red segment", "warning", "whoosh_deep", ["battery", "charge", "power", "empty", "recharge"]),
    ("10 on 10 assets/11.png", "burnout", "exhausted_dead_brain.png", "Exhausted Zombie Brain", "Cartoon brain drooling with crossed-out eyes and dead battery icon", "fatigued", "whoosh_deep", ["dead tired", "burnt out", "brain fry", "zombie", "overworked"]),
    ("10 on 10 assets/3.png", "burnout", "overwhelmed_mind_ripples.png", "Overwhelmed Ripple Waves", "Minimal figure with dizzy disorienting ripples around head", "disoriented", "whoosh_fast", ["overwhelm", "dizziness", "sensory overload", "stimulation", "noise"]),
    ("10 on 10 assets/13.png", "burnout", "girl_headache_stress.png", "Girl Acute Stress", "Girl squatting holding head in severe migraine or stress panic", "distressed", "whoosh_deep", ["headache", "migraine", "stress", "panic", "pain", "pressure"]),
    ("10 on 10 assets/14.png", "burnout", "boy_crouching_despair.png", "Boy Crouching Despair", "Hoodie-wearing boy crouching looking down in deep despair", "somber", "whoosh_deep", ["despair", "hopeless", "defeat", "struggle", "sadness", "regret"]),
    ("10 on 10 assets/15.png", "burnout", "student_study_burnout.png", "Student Study Burnout", "Student slumped at desk clutching head over open book", "overwhelmed", "whoosh_deep", ["study", "exams", "homework", "academic", "burnout", "reading"]),
    ("10 on 10 assets/16.png", "burnout", "anxiety_racing_thoughts.png", "Anxiety Racing Heads", "Person clutching head with multiple blurred frantic ghost heads", "frantic", "whoosh_fast", ["anxiety", "racing thoughts", "panic attack", "adhd", "overthinking"]),
    ("10 on 10 assets/17.png", "burnout", "slumped_anxiety_scribble.png", "Slumped Anxiety Shadow", "Person sitting slumped with chaotic dark scribble above head", "heavy", "whoosh_deep", ["depression", "gloom", "dark thoughts", "heavy", "burden"]),
    ("10 on 10 assets/18.png", "burnout", "brain_trapped_in_cage.png", "Brain In Prison Cage", "Sad cartoon brain trapped behind birdcage bars", "constricted", "whoosh_deep", ["trapped", "cage", "prison", "limiting beliefs", "stuck", "blocked"]),
    ("10 on 10 assets/21.png", "burnout", "dark_thought_cloud_crushing.png", "Dark Cloud Crushing", "Figure crouching under a massive dark cloud of negative thoughts", "oppressive", "whoosh_deep", ["crushed", "negative thoughts", "weight", "pressure", "burden"]),
    ("10 on 10 assets/12.png", "burnout", "insomnia_awake_in_bed.png", "Insomnia Awake In Bed", "Person lying awake in bed staring at clock late at night", "restless", "click", ["insomnia", "sleep", "bedtime", "night", "clock", "screentime"]),
    ("10 on 10 assets/22.png", "burnout", "exhausted_in_bed.png", "Exhausted Bed Morning", "Tired weary person under blankets lacking energy to get up", "lethargic", "whoosh_deep", ["morning", "waking up", "lazy", "lethargy", "unmotivated", "bed"]),
    ("10 on 10 assets/26.png", "burnout", "furious_frustrated_pulling_hair.png", "Furious Hair Pulling", "Girl pulling hair screaming in acute frustration and anger", "explosive", "whoosh_deep", ["anger", "frustration", "rage", "screaming", "patience", "temper"]),
    ("10 on 10 assets/32.png", "burnout", "girl_crying_at_desk.png", "Girl Crying At Desk", "Girl slumped over desk resting head on arm with single tear", "melancholic", "whoosh_deep", ["crying", "tears", "heartbreak", "failure", "disappointment"]),
    ("10 on 10 assets/29.png", "burnout", "trapped_in_glass_jar.png", "Trapped In Glass Jar", "Sad woman sitting curled up inside a corked glass jar in the rain", "isolated", "whoosh_deep", ["suffocation", "claustrophobia", "trapped", "helpless", "bottle"]),
    ("10 on 10 assets/39.png", "burnout", "trembling_nervous_mascot.png", "Trembling Nervous Mascot", "Shivering mascot figure trembling with fear and cold sweat", "anxious", "click", ["nervous", "scared", "shivering", "phobia", "fear", "trembling"]),

    # Devices & Dopamine Hijacking
    ("10 on 10 assets/6.png", "devices", "phone_dopamine_overload.png", "Phone Dopamine Overload", "Shocked guy overwhelmed by colorful exploding feed dopamine streams", "hypnotic", "whoosh_deep", ["phone", "social media", "tiktok", "reels", "scroll", "addiction", "dopamine"]),
    ("10 on 10 assets/7.png", "devices", "phone_silent_notifications.png", "Phone Silent Mode", "Hand holding phone with red silent bell badge for digital detox", "intentional", "click", ["detox", "silent", "notifications", "focus", "mute", "monk mode"]),
    ("10 on 10 assets/8.png", "devices", "smartphone_lockscreen_notifications.png", "Lockscreen Notification Stack", "Morning 08:45 smartphone lockscreen stacked with alerts", "distracting", "click", ["lockscreen", "morning", "notifications", "alerts", "screen time", "digital"]),

    # Relationships & Social Psychology
    ("10 on 10 assets/10.png", "relationships", "isolated_curled_up.png", "Isolated Curled Up", "Figure sitting alone in dark corner curled up", "lonely", "whoosh_deep", ["loneliness", "isolation", "alone", "alienated", "rejection"]),
    ("10 on 10 assets/19.png", "relationships", "fear_paranoia_voices.png", "Fear Whispering Voices", "Boy clutching ears surrounded by spectral whispering fear figures", "paranoia", "whoosh_fast", ["imposter syndrome", "judgment", "critics", "paranoia", "voices", "fear"]),
    ("10 on 10 assets/20.png", "relationships", "peer_pressure_criticism.png", "Peer Pressure Criticism", "One person whispering toxic gossip into sweating friend's ear", "toxic", "whoosh_deep", ["peer pressure", "gossip", "toxic", "comparison", "criticism", "influence"]),
    ("10 on 10 assets/24.png", "relationships", "sad_blue_figure_lonely.png", "Blue Watercolor Solitude", "Soft blue watercolor figure sitting curled in gentle sadness", "vulnerable", "whoosh_sparkle", ["solitude", "sadness", "melancholy", "gentle", "healing"]),
    ("10 on 10 assets/25.png", "relationships", "friendship_comfort_support.png", "Friendship Comfort Hug", "Two friendly blue figures with supportive arm around shoulder", "empathetic", "whoosh_sparkle", ["friendship", "support", "comfort", "empathy", "ally", "kindness"]),
    ("10 on 10 assets/27.png", "relationships", "angry_pouting_arms_crossed.png", "Angry Arms Crossed Pout", "Girl standing with arms folded refusing to comply in defiance", "defiant", "click", ["boundary", "stubborn", "refusal", "conflict", "saying no", "ego"]),
    ("10 on 10 assets/31.png", "relationships", "cute_sad_mascot_knees.png", "Cute Mascot Hugging Knees", "Cute white cartoon figure sitting hugging knees in quiet reflection", "pensive", "whoosh_sparkle", ["reflection", "sad", "quiet", "solitude", "thinking", "introvert"]),
    ("10 on 10 assets/33.png", "relationships", "hugging_comfort_embrace.png", "Embrace Hug Line Art", "Minimalist line art of two souls embracing in deep comfort", "comforting", "whoosh_sparkle", ["love", "hug", "embrace", "intimacy", "healing", "connection"]),
    ("10 on 10 assets/40.png", "relationships", "setting_boundary_stop_hand.png", "Stop Hand Boundary", "Figure holding palm forward in firm STOP gesture setting boundary", "assertive", "whoosh_deep", ["boundary", "saying no", "stop", "limit", "self respect", "assertiveness"]),

    # Habits & Systems
    ("10 on 10 assets/28.png", "habits", "mood_rating_scale_emojis.png", "Mood Spectrum Scale", "6-level mood tracking scale from green smiling to red frowning", "systematic", "click", ["mood tracker", "journaling", "progress", "rating", "scale", "emotion"]),
    ("10 on 10 assets/30.png", "habits", "happy_heart_mascot.png", "Happy Heart Mascot", "Vibrant smiling pink heart with rosy cheeks radiating warmth", "joyful", "whoosh_sparkle", ["love", "self love", "joy", "kindness", "positivity", "health"]),
    ("10 on 10 assets/34.png", "habits", "target_focus_crosshair.png", "Precision Target Crosshair", "Minimalist laser focus crosshair target line art", "focused", "click", ["focus", "target", "goal", "discipline", "precision", "aim"]),
    ("10 on 10 assets/35.png", "habits", "calendar_habit_check.png", "Habit Calendar Streak", "Calendar grid with confirmed checkmark indicating completed streak", "disciplined", "click", ["streak", "calendar", "consistency", "habit loop", "daily action", "routine"])
]

def organize():
    print(f"Organizing {len(ASSET_MAPPINGS)} cutouts into {PUBLIC_ASSETS_DIR}...")
    PUBLIC_ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    registry = {}

    for src_rel, cat, tgt_name, title, desc, tone, sfx, keywords in ASSET_MAPPINGS:
        src_path = DESKTOP_DIR / src_rel
        cat_dir = PUBLIC_ASSETS_DIR / cat
        cat_dir.mkdir(parents=True, exist_ok=True)
        tgt_path = cat_dir / tgt_name

        if not src_path.exists():
            print(f"Warning: Missing source file {src_path}")
            continue

        shutil.copy2(src_path, tgt_path)

        with Image.open(tgt_path) as img:
            w, h = img.size

        asset_id = tgt_name.replace(".png", "")
        registry[asset_id] = {
            "id": asset_id,
            "filename": tgt_name,
            "category": cat,
            "path": f"assets/{cat}/{tgt_name}",
            "title": title,
            "description": desc,
            "tone": tone,
            "recommendedSfx": sfx,
            "keywords": keywords,
            "width": w,
            "height": h
        }

    # Save registry.json
    registry_path = PUBLIC_ASSETS_DIR / "registry.json"
    with open(registry_path, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2, ensure_ascii=False)
    print(f"Created {registry_path} with {len(registry)} indexed assets.")

    # Render Visual Contact Sheets
    render_contact_sheets(registry)

    # Save script to scripts/organize_assets.py
    scripts_dir = ROOT_DIR / "scripts"
    scripts_dir.mkdir(parents=True, exist_ok=True)
    with open(__file__, "r", encoding="utf-8") as current:
        content = current.read()
    with open(scripts_dir / "organize_assets.py", "w", encoding="utf-8") as dest:
        dest.write(content)
    print(f"Saved permanent script to {scripts_dir / 'organize_assets.py'}")

def render_contact_sheets(registry: dict):
    print("Generating visual contact sheets for AI Agents...")
    items = list(registry.values())
    
    page1_items = [item for item in items if item["category"] in ["psychology", "burnout"]]
    page2_items = [item for item in items if item["category"] in ["devices", "relationships", "habits"]]

    render_sheet(page1_items, PUBLIC_ASSETS_DIR / "visual_catalog_1.png", "RIGHTCLIPS VISUAL ASSETS - PART 1: PSYCHOLOGY & BURNOUT")
    render_sheet(page2_items, PUBLIC_ASSETS_DIR / "visual_catalog_2.png", "RIGHTCLIPS VISUAL ASSETS - PART 2: DEVICES, RELATIONSHIPS & HABITS")

def render_sheet(items, output_path: Path, title: str):
    cols = 5
    card_w = 260
    card_h = 320
    pad = 20
    header_h = 70

    rows = (len(items) + cols - 1) // cols
    sheet_w = cols * (card_w + pad) + pad
    sheet_h = rows * (card_h + pad) + pad + header_h

    sheet = Image.new("RGBA", (sheet_w, sheet_h), (11, 15, 25, 255))
    draw = ImageDraw.Draw(sheet)

    # Draw Header
    draw.rectangle([0, 0, sheet_w, header_h], fill=(15, 23, 42, 255))
    draw.line([0, header_h, sheet_w, header_h], fill=(30, 41, 59, 255), width=2)
    draw.text((30, 22), title, fill=(248, 250, 252, 255))

    for i, item in enumerate(items):
        r = i // cols
        c = i % cols
        x = pad + c * (card_w + pad)
        y = header_h + pad + r * (card_h + pad)

        # Card container
        draw.rectangle([x, y, x + card_w, y + card_h], fill=(24, 33, 50, 255), outline=(51, 65, 85, 255), width=2)

        # Category pill
        cat_colors = {
            "psychology": ((147, 51, 234, 255), (243, 232, 255, 255)),
            "burnout": ((225, 29, 72, 255), (255, 228, 230, 255)),
            "devices": ((14, 165, 233, 255), (224, 242, 254, 255)),
            "relationships": ((16, 185, 129, 255), (209, 250, 229, 255)),
            "habits": ((245, 158, 11, 255), (254, 243, 199, 255))
        }
        bg_col, txt_col = cat_colors.get(item["category"], ((71, 85, 105, 255), (255, 255, 255, 255)))
        draw.rectangle([x + 10, y + 10, x + 100, y + 28], fill=bg_col)
        draw.text((x + 14, y + 13), item["category"].upper(), fill=txt_col)

        # Image thumbnail
        full_img_path = ROOT_DIR / "public" / item["path"]
        try:
            with Image.open(full_img_path) as img:
                img_copy = img.convert("RGBA")
                bbox = img_copy.getbbox()
                if bbox:
                    cropped = img_copy.crop(bbox)
                else:
                    cropped = img_copy
                
                cropped.thumbnail((card_w - 40, 160), Image.Resampling.LANCZOS)
                px = x + (card_w - cropped.width) // 2
                py = y + 36 + (160 - cropped.height) // 2
                sheet.paste(cropped, (px, py), cropped)
        except Exception as e:
            print(f"Error loading {full_img_path}: {e}")

        # Metadata labels
        draw.text((x + 12, y + 206), item["title"][:26], fill=(248, 250, 252, 255))
        draw.text((x + 12, y + 230), f"ID: {item['id'][:25]}", fill=(56, 189, 248, 255))
        draw.text((x + 12, y + 252), f"SFX: {item['recommendedSfx']}", fill=(251, 191, 36, 255))
        
        # Tags line
        tags = " • ".join(item["keywords"][:3])
        draw.text((x + 12, y + 276), tags[:30], fill=(148, 163, 184, 255))

    sheet.save(output_path)
    print(f"Generated visual contact sheet: {output_path}")

if __name__ == "__main__":
    organize()
