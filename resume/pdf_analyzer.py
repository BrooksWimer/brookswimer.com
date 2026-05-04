"""
pdf_analyzer.py — Visual + structural analysis of a PDF resume.
Returns page metrics AND saves a preview PNG so Claude can visually inspect the output.
"""

import fitz  # pymupdf
from pathlib import Path


def analyze_pdf(pdf_path: str, preview_zoom: float = 2.0) -> dict:
    """
    Analyze a PDF file.

    Returns:
        dict with keys:
            pages           — total page count
            fits_one_page   — True if pages == 1
            page1_lines     — non-empty text lines on page 1
            overflow        — True if pages > 1
            overflow_sample — first 300 chars of page 2 (if any), for debugging
            preview_png     — path to rendered PNG preview (for visual inspection)
            page_width_pt   — page width in points
            page_height_pt  — page height in points
    """
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    preview_path = pdf_path.with_suffix(".preview.png")

    doc = fitz.open(str(pdf_path))
    num_pages = len(doc)
    page1 = doc[0]

    # Render page 1 to PNG for visual inspection
    mat = fitz.Matrix(preview_zoom, preview_zoom)
    pix = page1.get_pixmap(matrix=mat)
    pix.save(str(preview_path))

    # Count non-empty lines on page 1
    raw_text = page1.get_text()
    lines = [ln for ln in raw_text.split("\n") if ln.strip()]

    # Overflow content from page 2 (if exists)
    overflow_sample = ""
    if num_pages > 1:
        overflow_sample = doc[1].get_text()[:300]

    # Page dimensions
    rect = page1.rect
    doc.close()

    return {
        "pages": num_pages,
        "fits_one_page": num_pages == 1,
        "page1_lines": len(lines),
        "overflow": num_pages > 1,
        "overflow_sample": overflow_sample,
        "preview_png": str(preview_path),
        "page_width_pt": rect.width,
        "page_height_pt": rect.height,
    }


def print_analysis(result: dict) -> None:
    status = "✅ FITS (1 page)" if result["fits_one_page"] else f"❌ OVERFLOW ({result['pages']} pages)"
    print(f"\n{'='*50}")
    print(f"  {status}")
    print(f"  Lines on page 1 : {result['page1_lines']}")
    print(f"  Page size       : {result['page_width_pt']:.0f} x {result['page_height_pt']:.0f} pt")
    print(f"  Preview PNG     : {result['preview_png']}")
    if result["overflow"]:
        print(f"  Overflow sample : {result['overflow_sample'][:100]}...")
    print(f"{'='*50}\n")


# ── CLI usage ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else "output/resume.pdf"
    result = analyze_pdf(path)
    print_analysis(result)
