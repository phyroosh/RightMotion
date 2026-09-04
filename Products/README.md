# 📚 RightClips Products Library

This folder stores high-conversion product PDFs (worksheets, playbooks, blueprints, and digital workbooks) that can be showcased directly inside RightClips videos.

---

## 🎯 How It Works

When a video script references a product page (e.g. `{product: Photon.pdf, page: 14}` or via `--product Photon.pdf --product-page 14`):
1. The RightClips video generator automatically targets `Products/<name>.pdf`.
2. It uses `pdftoppm` to extract **only** the target page into `public/products/<name>/page_<page_num>.png` at retina resolution (220 DPI).
3. The page is rendered on screen with:
   - Physical 3D card perspective & depth shadow
   - Specular animated glass glare shimmer
   - Anchored tactile masking tape strip
   - Floating telemetry badge (e.g., `PAGE 14 • WORKSHEET PROTOCOL`)
   - Frame-accurate speech synchronization with the voiceover CTA

---

## 💡 Best Practices for Product PDFs

1. **Aspect Ratio**: Standard A4 or US Letter portrait works best.
2. **Design Theme**: Dark obsidian backgrounds with vibrant accents (cyan, emerald, gold, or cognitive blue) create the highest contrast on mobile video.
3. **Typography**: Ensure primary titles and checklist headings are bold and legible.
4. **Naming**: Keep filenames concise without spaces (e.g., `Photon.pdf`, `ApexWealthBlueprint.pdf`, `BioResetGuide.pdf`).
