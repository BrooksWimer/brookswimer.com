"""
renderer.py — Renders an HTML string to PDF + PNG using Playwright (headless Chromium).
No external dependencies beyond 'playwright' pip package + 'playwright install chromium'.
"""

from pathlib import Path
from playwright.sync_api import sync_playwright


def render_html_to_pdf(
    html_content: str,
    output_pdf: str,
    output_png: Optional[str] = None,
    page_format: str = "Letter",
) -> dict:
    """
    Render HTML to a PDF file using headless Chromium.
    Optionally also captures a full-page screenshot (PNG) for visual inspection.

    Args:
        html_content  : Full HTML string (including <style> / @page rules)
        output_pdf    : Path to write the output PDF
        output_png    : Path to write screenshot PNG (optional; pass None to skip)
        page_format   : Playwright page format string (default 'Letter')

    Returns:
        dict with 'pdf' and 'png' paths (png may be None)
    """
    output_pdf = str(Path(output_pdf).resolve())
    if output_png:
        output_png = str(Path(output_png).resolve())

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        # Load HTML content
        page.set_content(html_content, wait_until="networkidle")

        # Export PDF — honours CSS @page rules (size, margins)
        page.pdf(
            path=output_pdf,
            format=page_format,
            print_background=True,
            prefer_css_page_size=True,   # use @page size/margins from CSS
        )

        # Screenshot for visual inspection (before PDF export changes the view)
        if output_png:
            # Re-load to get screen rendering (PDF mode changes layout slightly)
            page.set_content(html_content, wait_until="networkidle")
            page.screenshot(path=output_png, full_page=True)

        browser.close()

    return {"pdf": output_pdf, "png": output_png}


# Allow Optional import for type hint
from typing import Optional  # noqa: E402 (placed after function to avoid circular look)

# ── CLI usage ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    html_path = sys.argv[1]
    out_pdf   = sys.argv[2] if len(sys.argv) > 2 else "output/resume.pdf"
    out_png   = sys.argv[3] if len(sys.argv) > 3 else "output/resume_screen.png"
    html_content = Path(html_path).read_text(encoding="utf-8")
    result = render_html_to_pdf(html_content, out_pdf, out_png)
    print(f"PDF  → {result['pdf']}")
    print(f"PNG  → {result['png']}")
