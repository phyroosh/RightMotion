#!/usr/bin/env python3
"""
RightMotion High-Performance Product Page & Paragraph Extraction Engine
Extracts specific PDF pages or focused paragraph screenshots directly from original user PDFs in Products/ or public/products/.
"""

import sys
import os
import re
import shutil
import subprocess
import argparse
from pathlib import Path
from PIL import Image

ROOT_DIR = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT_DIR / "Products"
PUBLIC_PRODUCTS_DIR = ROOT_DIR / "public" / "products"

def find_pdf_file(pdf_name: str) -> Path:
    """Locate the user's original PDF file in Products/ or public/products/."""
    raw = pdf_name.strip()
    if not raw.lower().endswith(".pdf"):
        raw = f"{raw}.pdf"
    
    search_dirs = [PRODUCTS_DIR, PUBLIC_PRODUCTS_DIR, ROOT_DIR]
    # Also strip duplicate counters like (1), (2), etc.
    clean_raw = re.sub(r"\s*\(\d+\)", "", raw)
    if not clean_raw.lower().endswith(".pdf"):
        clean_raw = f"{clean_raw}.pdf"

    for d in search_dirs:
        if not d.exists():
            continue
        for target in [raw, clean_raw]:
            candidate = d / target
            if candidate.exists() and candidate.is_file():
                return candidate
        for item in d.glob("*.pdf"):
            item_stem_clean = re.sub(r"\s*\(\d+\)", "", item.stem).lower()
            raw_stem_clean = re.sub(r"\s*\(\d+\)", "", Path(raw).stem).lower()
            if (
                item.name.lower() == raw.lower()
                or item.stem.lower() == Path(raw).stem.lower()
                or item_stem_clean == raw_stem_clean
            ):
                return item

    for target in [raw, clean_raw]:
        p = Path(target)
        if p.exists() and p.is_file():
            return p

    raise FileNotFoundError(f"Product PDF '{pdf_name}' not found in {PRODUCTS_DIR} or {PUBLIC_PRODUCTS_DIR}")

def crop_paragraph_if_isolated(full_png: Path, paragraph_png: Path) -> bool:
    """
    Analyzes page image and creates a cropped screenshot of the specific paragraph/box
    if there is significant whitespace or isolated exercise section.
    """
    try:
        im = Image.open(full_png)
        width, height = im.size
        gray = im.convert("L")

        # Exclude top 3% header and bottom 8% footer margins
        top_margin = int(height * 0.035)
        bottom_margin = int(height * 0.92)

        active_rows = []
        for y in range(top_margin, bottom_margin, 5):
            dark_pixels = sum(1 for x in range(int(width * 0.05), int(width * 0.95), 4) if gray.getpixel((x, y)) < 235)
            if dark_pixels > 8:
                active_rows.append(y)

        if not active_rows:
            return False

        first_y = max(0, active_rows[0] - 40)
        last_y = min(height, active_rows[-1] + 50)
        content_height_ratio = (last_y - first_y) / height

        # If content occupies less than 80% of page height, it's an isolated paragraph/exercise block!
        if content_height_ratio < 0.80:
            active_cols = []
            for x in range(int(width * 0.05), int(width * 0.95), 5):
                dark = sum(1 for y in range(first_y, last_y, 4) if gray.getpixel((x, y)) < 235)
                if dark > 5:
                    active_cols.append(x)
            first_x = max(0, active_cols[0] - 50) if active_cols else 0
            last_x = min(width, active_cols[-1] + 50) if active_cols else width

            cropped = im.crop((first_x, first_y, last_x, last_y))
            cropped.save(paragraph_png)
            return True
        return False
    except Exception as e:
        print(f"Warning in paragraph cropping: {e}", file=sys.stderr)
        return False

def extract_product_page(pdf_name_or_path: str, page_num: int, dpi: int = 220, force: bool = False) -> dict:
    """
    Extract a single page or focused paragraph screenshot from an original user PDF.
    Returns metadata with public paths for Remotion (staticFile).
    """
    pdf_path = find_pdf_file(pdf_name_or_path)
    pdf_stem = pdf_path.stem

    dest_dir = PUBLIC_PRODUCTS_DIR / pdf_stem
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    final_full_png = dest_dir / f"page_{page_num}.png"
    paragraph_png = dest_dir / f"page_{page_num}_paragraph.png"

    rel_full_path = f"products/{pdf_stem}/page_{page_num}.png"
    rel_paragraph_path = f"products/{pdf_stem}/page_{page_num}_paragraph.png"

    # If cached and non-empty, check and return
    if final_full_png.exists() and final_full_png.stat().st_size > 1000 and not force:
        has_paragraph = paragraph_png.exists() and paragraph_png.stat().st_size > 1000
        chosen_path = rel_paragraph_path if has_paragraph else rel_full_path
        return {
            "pdf_name": pdf_path.name,
            "page": page_num,
            "abs_path": str(dest_dir / Path(chosen_path).name),
            "public_path": chosen_path,
            "full_path": rel_full_path,
            "paragraph_path": rel_paragraph_path if has_paragraph else None,
            "has_paragraph": has_paragraph,
            "cached": True
        }

    # Find pdftoppm
    pdftoppm_bin = shutil.which("pdftoppm") or "/usr/bin/pdftoppm"
    if not os.path.exists(pdftoppm_bin):
        raise RuntimeError("pdftoppm executable not found. Please install poppler-utils.")

    temp_prefix = dest_dir / f"temp_p{page_num}"
    cmd = [
        pdftoppm_bin,
        "-png",
        "-r", str(dpi),
        "-f", str(page_num),
        "-l", str(page_num),
        str(pdf_path),
        str(temp_prefix)
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"pdftoppm failed: {res.stderr}")

    generated = list(dest_dir.glob(f"temp_p{page_num}-*.png"))
    if not generated:
        raise FileNotFoundError(f"Failed to generate page {page_num} from {pdf_path.name}")

    shutil.move(str(generated[0]), str(final_full_png))

    # Smart paragraph screenshot detection
    has_paragraph = crop_paragraph_if_isolated(final_full_png, paragraph_png)
    chosen_path = rel_paragraph_path if has_paragraph else rel_full_path

    return {
        "pdf_name": pdf_path.name,
        "page": page_num,
        "abs_path": str(dest_dir / Path(chosen_path).name),
        "public_path": chosen_path,
        "full_path": rel_full_path,
        "paragraph_path": rel_paragraph_path if has_paragraph else None,
        "has_paragraph": has_paragraph,
        "cached": False
    }

def main():
    parser = argparse.ArgumentParser(description="Extract product PDF page or paragraph screenshot for video presentation.")
    parser.add_argument("--pdf", required=True, help="PDF filename in Products/ (e.g. Photon.pdf)")
    parser.add_argument("--page", type=int, required=True, help="Exact 1-indexed page number")
    parser.add_argument("--dpi", type=int, default=220, help="DPI rendering resolution (default 220)")
    parser.add_argument("--force", action="store_true", help="Force re-extraction even if cached")

    args = parser.parse_args()
    try:
        meta = extract_product_page(args.pdf, args.page, args.dpi, args.force)
        print(f"✓ Extracted {meta['pdf_name']} Page {meta['page']} -> {meta['public_path']} (Has Paragraph Crop: {meta['has_paragraph']}, Cached: {meta['cached']})")
    except Exception as e:
        print(f"✗ Extraction failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
