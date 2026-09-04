#!/usr/bin/env python3
"""
RightClips Autonomous Entity Media & B-Roll Fetcher
==================================================
Empowers AI Agents to autonomously fetch, search, generate, and format
authentic entity media (founder photos, real news articles, location maps,
and business B-roll) for Remotion facecam compositions.

Usage:
  1. Download direct media URL:
     python3 scripts/fetch_entity_media.py --url "https://..." --out "public/my_clip/broll/asset.png"

  2. Generate authentic news clipping graphic:
     python3 scripts/fetch_entity_media.py --news-clipping \
       --source "The Economic Times" \
       --date "Oct 16, 2024, 08:09 PM IST" \
       --headline "Bikaji Foods acquires majority 53.02% stake for Rs 131 crore in Lucknow-based Hazelnut Factory" \
       --body "Ethnic snacks maker Bikaji Foods International Ltd has acquired majority 53.02% stake for Rs 131 crore in Lucknow-based cafe and artisanal sweets chain Hazelnut Factory Food Products Private Ltd through its wholly-owned subsidiary Bikaji Foods Retail Ltd." \
       --highlight "53.02% stake for Rs 131 crore" \
       --out "public/my_clip/broll/bikaji_news.png"

  3. Generate Search AI Overview card:
     python3 scripts/fetch_entity_media.py --search-overview \
       --query "The Hazelnut Factory valuation" \
       --answer "The total valuation of The Hazelnut Factory (THF) is estimated to be approximately ₹247 crore (around ₹247.1 crore) following its acquisition by Bikaji Foods." \
       --highlight "approximately ₹247 crore" \
       --out "public/my_clip/broll/valuation_overview.png"
"""

import sys
import os
import argparse
import urllib.request
import urllib.parse
import json
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

def get_font(size: int, bold: bool = False):
    """Attempts to find a clean system TTF font, falling back to default."""
    font_paths = [
        "/usr/share/fonts/google-noto/NotoSans-Bold.ttf" if bold else "/usr/share/fonts/google-noto/NotoSans-Regular.ttf",
        "/usr/share/fonts/google-noto/NotoSans-Black.ttf" if bold else "/usr/share/fonts/google-noto/NotoSans-Medium.ttf",
        "/usr/share/fonts/google-carlito-fonts/Carlito-Bold.ttf" if bold else "/usr/share/fonts/google-carlito-fonts/Carlito-Regular.ttf",
        "/usr/share/fonts/dejavu-sans-fonts/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/dejavu-sans-fonts/DejaVuSans.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def download_url(url: str, out_path: str, max_w: int = 1080, max_h: int = 800):
    """Downloads an image from URL and formats it."""
    print(f"🌐 Fetching entity media from: {url}", flush=True)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()

    img = Image.open(BytesIO(data)).convert("RGBA")
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)
    print(f"✅ Saved B-roll media: {out_path} ({img.width}x{img.height})", flush=True)

def generate_news_clipping(
    source: str,
    date_str: str,
    headline: str,
    body: str,
    highlight: str,
    out_path: str,
    width: int = 1040,
    height: int = 680
):
    """Renders a crisp, realistic news article clipping with a highlighted snippet."""
    print(f"📰 Generating News Article Clipping: {headline[:50]}...", flush=True)
    img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Top metadata bar
    meta_font = get_font(22, bold=False)
    source_font = get_font(26, bold=True)
    head_font = get_font(34, bold=True)
    body_font = get_font(28, bold=False)
    bold_body_font = get_font(28, bold=True)

    # Source & Date
    draw.text((90, 45), source.upper(), fill=(180, 20, 20), font=source_font)
    draw.text((90, 82), date_str, fill=(110, 110, 110), font=meta_font)

    # Separator line
    draw.line([(90, 125), (width - 90, 125)], fill=(225, 225, 225), width=2)

    # Headline
    y = 145
    words = headline.split()
    lines = []
    curr = []
    for w in words:
        curr.append(w)
        test_line = " ".join(curr)
        bbox = draw.textbbox((0, 0), test_line, font=head_font)
        if (bbox[2] - bbox[0]) > (width - 180):
            curr.pop()
            lines.append(" ".join(curr))
            curr = [w]
    if curr:
        lines.append(" ".join(curr))

    for line in lines:
        draw.text((90, y), line, fill=(20, 20, 20), font=head_font)
        y += 46

    y += 15
    # Thin divider
    draw.line([(40, y), (width - 40, y)], fill=(240, 240, 240), width=1)
    y += 25

    # Body with Highlight
    body_words = body.split()
    body_lines = []
    curr = []
    for w in body_words:
        curr.append(w)
        test_line = " ".join(curr)
        bbox = draw.textbbox((0, 0), test_line, font=body_font)
        if (bbox[2] - bbox[0]) > (width - 180):
            curr.pop()
            body_lines.append(" ".join(curr))
            curr = [w]
    if curr:
        body_lines.append(" ".join(curr))

    for line in body_lines:
        if highlight and highlight.lower() in line.lower():
            # Find start and end of highlight
            start_idx = line.lower().find(highlight.lower())
            pre = line[:start_idx]
            match = line[start_idx:start_idx + len(highlight)]
            post = line[start_idx + len(highlight):]

            x_curr = 90
            if pre:
                draw.text((x_curr, y), pre, fill=(35, 35, 35), font=body_font)
                bbox_pre = draw.textbbox((0, 0), pre, font=body_font)
                x_curr += (bbox_pre[2] - bbox_pre[0])

            # Draw highlight rectangle
            bbox_m = draw.textbbox((0, 0), match, font=bold_body_font)
            m_w = bbox_m[2] - bbox_m[0]
            draw.rectangle([(x_curr - 4, y - 2), (x_curr + m_w + 4, y + 36)], fill=(254, 226, 226))
            draw.text((x_curr, y), match, fill=(185, 28, 28), font=bold_body_font)
            x_curr += m_w

            if post:
                draw.text((x_curr, y), post, fill=(35, 35, 35), font=body_font)
        else:
            draw.text((90, y), line, fill=(35, 35, 35), font=body_font)

        y += 42
        if y > height - 60:
            break

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)
    print(f"✅ Generated News Clipping: {out_path}", flush=True)

def generate_search_overview(
    query: str,
    answer: str,
    highlight: str,
    out_path: str,
    width: int = 1040,
    height: int = 680
):
    """Renders a clean modern Google Search AI Overview style proof card."""
    print(f"🔍 Generating Search AI Overview: '{query}'...", flush=True)
    img = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    tag_font = get_font(28, bold=True)
    query_font = get_font(34, bold=True)
    body_font = get_font(30, bold=False)
    bold_body_font = get_font(30, bold=True)

    # Top search bar header (centered with generous margin)
    draw.rounded_rectangle([(60, 30), (width - 60, 105)], radius=36, fill=(241, 243, 244), outline=(218, 220, 224), width=2)
    draw.text((90, 52), f"SEARCH:  {query}", fill=(60, 64, 67), font=query_font)

    # AI Overview card
    y = 135
    draw.rounded_rectangle([(60, y), (width - 60, height - 35)], radius=24, fill=(248, 249, 250), outline=(226, 232, 240), width=2)

    draw.text((90, y + 25), "✦  AI OVERVIEW", fill=(26, 115, 232), font=tag_font)
    draw.line([(90, y + 72), (width - 90, y + 72)], fill=(230, 235, 240), width=2)

    # Answer text with highlight
    y_text = y + 100
    words = answer.split()
    lines = []
    curr = []
    for w in words:
        curr.append(w)
        test_line = " ".join(curr)
        bbox = draw.textbbox((0, 0), test_line, font=body_font)
        if (bbox[2] - bbox[0]) > (width - 180):
            curr.pop()
            lines.append(" ".join(curr))
            curr = [w]
    if curr:
        lines.append(" ".join(curr))

    for line in lines:
        if highlight and highlight.lower() in line.lower():
            start_idx = line.lower().find(highlight.lower())
            pre = line[:start_idx]
            match = line[start_idx:start_idx + len(highlight)]
            post = line[start_idx + len(highlight):]

            x_curr = 90
            if pre:
                draw.text((x_curr, y_text), pre, fill=(32, 33, 36), font=body_font)
                bbox_pre = draw.textbbox((0, 0), pre, font=body_font)
                x_curr += (bbox_pre[2] - bbox_pre[0])

            bbox_m = draw.textbbox((0, 0), match, font=bold_body_font)
            m_w = bbox_m[2] - bbox_m[0]
            # Yellow highlighter pill
            draw.rectangle([(x_curr - 4, y_text - 3), (x_curr + m_w + 4, y_text + 40)], fill=(254, 240, 138))
            draw.text((x_curr, y_text), match, fill=(113, 63, 18), font=bold_body_font)
            x_curr += m_w

            if post:
                draw.text((x_curr, y_text), post, fill=(32, 33, 36), font=body_font)
        else:
            draw.text((90, y_text), line, fill=(32, 33, 36), font=body_font)

        y_text += 48
        if y_text > height - 60:
            break

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)
    print(f"✅ Generated Search AI Overview: {out_path}", flush=True)

def main():
    parser = argparse.ArgumentParser(description="Autonomous Entity Media & B-Roll Fetcher for RightClips")
    parser.add_argument("--url", type=str, help="Direct URL of image to download")
    parser.add_argument("--news-clipping", action="store_true", help="Generate news clipping graphic")
    parser.add_argument("--source", type=str, default="The Economic Times", help="News publication source")
    parser.add_argument("--date", type=str, default="Oct 16, 2024", help="News publication date")
    parser.add_argument("--headline", type=str, default="", help="News headline")
    parser.add_argument("--body", type=str, default="", help="News article paragraph")
    parser.add_argument("--search-overview", action="store_true", help="Generate search overview proof card")
    parser.add_argument("--query", type=str, default="", help="Search query")
    parser.add_argument("--answer", type=str, default="", help="Answer snippet")
    parser.add_argument("--highlight", type=str, default="", help="Key phrase to highlight")
    parser.add_argument("--out", type=str, required=True, help="Output image file path")
    args = parser.parse_args()

    if args.url:
        download_url(args.url, args.out)
    elif args.news_clipping:
        if not args.headline or not args.body:
            print("❌ Error: --headline and --body are required for --news-clipping")
            sys.exit(1)
        generate_news_clipping(
            source=args.source,
            date_str=args.date,
            headline=args.headline,
            body=args.body,
            highlight=args.highlight,
            out_path=args.out
        )
    elif args.search_overview:
        if not args.query or not args.answer:
            print("❌ Error: --query and --answer are required for --search-overview")
            sys.exit(1)
        generate_search_overview(
            query=args.query,
            answer=args.answer,
            highlight=args.highlight,
            out_path=args.out
        )
    else:
        print("❌ Error: Must specify --url, --news-clipping, or --search-overview")
        sys.exit(1)

if __name__ == "__main__":
    main()
