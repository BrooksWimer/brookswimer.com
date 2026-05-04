"""
generator.py — Orchestrates the full resume generation pipeline.

Pipeline:
  1. Load content.json
  2. Build HTML  (html_builder.py)
  3. Render → PDF + PNG screenshot  (renderer.py)
  4. Analyze PDF visually  (pdf_analyzer.py)
  5. If overflow → trim lowest-priority content → go to 2
  6. Return final PDF + visual preview for inspection

Usage:
  python generator.py                          # uses content.json, outputs to output/
  python generator.py --content my_content.json --output-dir output/
"""

import argparse
import copy
import json
import sys
from pathlib import Path

from html_builder import build_html, DEFAULT_FMT
from renderer import render_html_to_pdf
from pdf_analyzer import analyze_pdf, print_analysis


# ── Trim strategy ─────────────────────────────────────────────────────────────
# Order of operations when content doesn't fit:
#   1. Remove the lowest-priority entire entry (coding or work) if it has bullets
#   2. Reduce highest-bullet-count entries by 1 bullet (lowest priority first)
#   3. Reduce font sizes and spacing slightly (one step)

FONT_REDUCTION_STEPS = [
    # (font_size_pt, line_height, section_gap_pt, entry_gap_pt, bullet_gap_pt)
    (10.0, 1.08, 3.0, 1.5, 0.5),   # default
    (10.0, 1.04, 2.5, 1.0, 0.3),   # tighter spacing
    (9.5,  1.04, 2.0, 1.0, 0.3),   # smaller font
    (9.5,  1.02, 1.5, 0.8, 0.2),   # very tight
    (9.0,  1.02, 1.5, 0.8, 0.2),   # last resort
]


def _all_entries(content: dict) -> list:
    """Return flat list of all coding + work entries with their section key."""
    entries = []
    for e in content.get("coding_experience", []):
        entries.append(("coding_experience", e))
    for e in content.get("work_experience", []):
        entries.append(("work_experience", e))
    return entries


def _remove_lowest_priority_entry(content: dict) -> bool:
    """
    Remove the single lowest-priority entry from either section.
    Returns True if something was removed, False if nothing left to remove.
    """
    candidates = _all_entries(content)
    if not candidates:
        return False
    # Sort by priority ascending (lowest first), then by bullet count ascending
    candidates.sort(key=lambda x: (x[1].get("priority", 5), len(x[1].get("bullets", []))))
    section_key, victim = candidates[0]
    content[section_key] = [e for e in content[section_key] if e is not victim]
    print(f"  ✂ Removed entry: {victim['name']} (priority {victim.get('priority', '?')})")
    return True


def _trim_one_bullet(content: dict) -> bool:
    """
    Remove the last bullet from the lowest-priority entry that still has >1 bullet.
    Returns True if a bullet was trimmed.
    """
    candidates = _all_entries(content)
    # Only entries with more than 1 bullet
    trimmable = [(sec, e) for sec, e in candidates if len(e.get("bullets", [])) > 1]
    if not trimmable:
        return False
    trimmable.sort(key=lambda x: (x[1].get("priority", 5), -len(x[1].get("bullets", []))))
    _, victim = trimmable[0]
    removed = victim["bullets"].pop()
    print(f"  ✂ Trimmed bullet from: {victim['name']}  →  removed: '{removed[:60]}...'")
    return True


def generate_resume(
    content_path: str = "content.json",
    output_dir: str = "output",
    max_iterations: int = 20,
    formatting_config: dict = None,
) -> dict:
    """
    Full generation pipeline with automatic overflow correction.

    Returns dict with:
        pdf      — path to final PDF
        png      — path to final preview PNG
        metrics  — analysis dict from pdf_analyzer
        iterations — number of iterations taken
        content  — the (possibly trimmed) content that was used
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)

    out_pdf = output_dir / "resume.pdf"
    out_png = output_dir / "resume_screen.png"

    # Load content
    content = json.loads(Path(content_path).read_text(encoding="utf-8"))
    content = copy.deepcopy(content)   # don't mutate the original

    fmt = copy.deepcopy(DEFAULT_FMT)
    if formatting_config:
        fmt.update(formatting_config)

    font_step = 0

    for iteration in range(1, max_iterations + 1):
        print(f"\n── Iteration {iteration} ──────────────────────────────")

        # Apply current font/spacing step
        step = FONT_REDUCTION_STEPS[min(font_step, len(FONT_REDUCTION_STEPS) - 1)]
        fmt.update({
            "font_size_pt":   step[0],
            "line_height":    step[1],
            "section_gap_pt": step[2],
            "entry_gap_pt":   step[3],
            "bullet_gap_pt":  step[4],
        })

        # Build HTML
        html = build_html(content, fmt)

        # Render
        render_html_to_pdf(html, str(out_pdf), str(out_png))

        # Analyze
        metrics = analyze_pdf(str(out_pdf))
        print_analysis(metrics)

        if metrics["fits_one_page"]:
            print("✅ Done! Resume fits on one page.")
            return {
                "pdf": str(out_pdf),
                "png": str(out_png),
                "metrics": metrics,
                "iterations": iteration,
                "content": content,
                "formatting": fmt,
            }

        # --- Overflow: decide what to trim ---
        print(f"  Overflow detected. Deciding trim strategy...")

        # Strategy: try removing a bullet first (preserves more entries)
        # Every 3rd iteration where we still overflow, try removing a whole entry
        if iteration % 3 == 0:
            if not _remove_lowest_priority_entry(content):
                if not _trim_one_bullet(content):
                    font_step += 1
                    print(f"  → Reducing font/spacing (step {font_step})")
        else:
            if not _trim_one_bullet(content):
                if not _remove_lowest_priority_entry(content):
                    font_step += 1
                    print(f"  → Reducing font/spacing (step {font_step})")

    raise RuntimeError(f"Could not fit resume to 1 page after {max_iterations} iterations.")


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a one-page resume PDF.")
    parser.add_argument("--content",    default="content.json", help="Path to content JSON")
    parser.add_argument("--output-dir", default="output",       help="Output directory")
    parser.add_argument("--max-iter",   default=20, type=int,   help="Max trim iterations")
    args = parser.parse_args()

    result = generate_resume(
        content_path=args.content,
        output_dir=args.output_dir,
        max_iterations=args.max_iter,
    )

    print(f"\n{'='*50}")
    print(f"  ✅ Final resume: {result['pdf']}")
    print(f"  📸 Preview PNG : {result['png']}")
    print(f"  Iterations    : {result['iterations']}")
    print(f"  Lines on pg 1 : {result['metrics']['page1_lines']}")
    print(f"{'='*50}")
