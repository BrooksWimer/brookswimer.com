"""
html_builder.py — Builds a resume HTML string from a content dict.
Styling precisely matches the v4 PDF reference (Times New Roman, tight margins).

Content dict schema:
{
  "name": str,
  "contact": { "address", "phone", "email", "linkedin", "github", "portfolio" },
  "education": [
    { "institution", "date", "degree", "gpa", "bullets": [str] }
  ],
  "coding_experience": [
    { "name", "tech", "date", "bullets": [str], "priority": int }
  ],
  "work_experience": [
    { "name", "role", "date", "bullets": [str], "priority": int }
  ],
  "technologies": str   # single line
}

formatting_config keys (all optional, with defaults):
  font_size_pt        (default 10)
  header_size_pt      (default 11)
  entry_header_pt     (default 10.5)
  contact_size_pt     (default 9)
  name_size_pt        (default 25)
  margin_top_in       (default 0.14)
  margin_bottom_in    (default 0.22)
  margin_left_in      (default 0.50)
  margin_right_in     (default 0.42)
  line_height         (default 1.08)
  section_gap_pt      (default 3)
  entry_gap_pt        (default 1.5)
  bullet_gap_pt       (default 0.5)
"""

from typing import Optional
import html as html_lib


DEFAULT_FMT = {
    "font_size_pt": 10,
    "header_size_pt": 11,
    "entry_header_pt": 10.5,
    "contact_size_pt": 9,
    "name_size_pt": 25,
    "margin_top_in": 0.14,
    "margin_bottom_in": 0.22,
    "margin_left_in": 0.50,
    "margin_right_in": 0.42,
    "line_height": 1.08,
    "section_gap_pt": 3,
    "entry_gap_pt": 1.5,
    "bullet_gap_pt": 0.5,
}


def _e(text: str) -> str:
    """HTML-escape a string."""
    return html_lib.escape(str(text))


def _render_bullet(text: str, fs: float, gap: float, lh: float) -> str:
    """
    Render a bullet line. If text starts with 'Word:', render 'Word:' in bold.
    """
    # Check for bold label pattern: "Label: rest of text"
    if ":" in text:
        colon_idx = text.index(":")
        label = text[:colon_idx]
        # Only treat as bold label if the label is a single word / short phrase
        if len(label.split()) <= 3 and not label.startswith("http"):
            rest = text[colon_idx + 1:]
            inner = f"<strong>{_e(label)}:</strong>{_e(rest)}"
            return (
                f'<div class="bullet" style="font-size:{fs}pt;'
                f'margin-bottom:{gap}pt;line-height:{lh};">'
                f"• {inner}</div>"
            )
    return (
        f'<div class="bullet" style="font-size:{fs}pt;'
        f'margin-bottom:{gap}pt;line-height:{lh};">'
        f"• {_e(text)}</div>"
    )


def _render_entry_header(left_html: str, date: str, fs: float, gap_below: float) -> str:
    return f"""
    <div class="entry-header" style="font-size:{fs}pt;margin-bottom:{gap_below}pt;">
      <span class="entry-left">{left_html}</span>
      <span class="entry-date">{_e(date)}</span>
    </div>"""


def build_html(content: dict, formatting_config: Optional[dict] = None) -> str:
    fmt = {**DEFAULT_FMT, **(formatting_config or {})}

    fs       = fmt["font_size_pt"]
    h_fs     = fmt["header_size_pt"]
    eh_fs    = fmt["entry_header_pt"]
    c_fs     = fmt["contact_size_pt"]
    name_fs  = fmt["name_size_pt"]
    lh       = fmt["line_height"]
    s_gap    = fmt["section_gap_pt"]
    e_gap    = fmt["entry_gap_pt"]
    b_gap    = fmt["bullet_gap_pt"]

    mt = fmt["margin_top_in"]
    mb = fmt["margin_bottom_in"]
    ml = fmt["margin_left_in"]
    mr = fmt["margin_right_in"]

    # ── CSS ──────────────────────────────────────────────────────────────────
    css = f"""
    @page {{
      size: letter;
      margin: {mt}in {mr}in {mb}in {ml}in;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Times New Roman', Times, serif;
      font-size: {fs}pt;
      color: #000000;
      line-height: {lh};
    }}
    .page-header {{
      text-align: center;
      margin-bottom: 2pt;
    }}
    .name {{
      font-size: {name_fs}pt;
      font-weight: normal;
      line-height: 1.05;
    }}
    .contact {{
      font-size: {c_fs}pt;
      margin-top: 1pt;
    }}
    .section {{
      margin-top: {s_gap}pt;
    }}
    .section-title {{
      font-size: {h_fs}pt;
      font-weight: bold;
      border-bottom: 0.75pt solid #000000;
      padding-bottom: 0pt;
      margin-bottom: 2pt;
      line-height: 1.05;
    }}
    .entry {{
      margin-bottom: {e_gap}pt;
    }}
    .entry-header {{
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: bold;
    }}
    .entry-left {{
      flex: 1 1 0;
      min-width: 0;
    }}
    .entry-date {{
      flex: 0 0 auto;
      white-space: nowrap;
      padding-left: 6pt;
    }}
    .entry-subtitle {{
      font-size: {fs}pt;
      line-height: {lh};
      margin-bottom: {b_gap}pt;
    }}
    .bullet {{
      padding-left: 10pt;
      text-indent: -8pt;
    }}
    """

    # ── Contact line ─────────────────────────────────────────────────────────
    c = content.get("contact", {})
    contact_parts = []
    for key in ("address", "phone", "email", "linkedin", "github", "portfolio"):
        val = c.get(key, "")
        if val:
            contact_parts.append(_e(val))
    contact_line = " | ".join(contact_parts)

    # ── EDUCATION ────────────────────────────────────────────────────────────
    edu_html = ""
    for edu in content.get("education", []):
        header = _render_entry_header(
            f"<strong>{_e(edu['institution'])}</strong>",
            edu["date"],
            eh_fs,
            b_gap,
        )
        subtitle = ""
        if edu.get("degree") or edu.get("gpa"):
            degree_str = f"<em>{_e(edu.get('degree',''))}</em>"
            gpa_str = f" (GPA: {_e(edu.get('gpa',''))})" if edu.get("gpa") else ""
            subtitle = f'<div class="entry-subtitle">{degree_str}{gpa_str}</div>'
        bullets_html = "".join(_render_bullet(b, fs, b_gap, lh) for b in edu.get("bullets", []))
        edu_html += f'<div class="entry">{header}{subtitle}{bullets_html}</div>'

    # ── CODING EXPERIENCE ────────────────────────────────────────────────────
    coding_html = ""
    for entry in content.get("coding_experience", []):
        left = (
            f"<strong>{_e(entry['name'])}</strong>"
            f" | <em>{_e(entry['tech'])}</em>"
        )
        header = _render_entry_header(left, entry["date"], eh_fs, b_gap)
        bullets_html = "".join(_render_bullet(b, fs, b_gap, lh) for b in entry.get("bullets", []))
        coding_html += f'<div class="entry">{header}{bullets_html}</div>'

    # ── WORK EXPERIENCE ──────────────────────────────────────────────────────
    work_html = ""
    for entry in content.get("work_experience", []):
        left = (
            f"<strong>{_e(entry['name'])}</strong>"
            f" | <em>{_e(entry['role'])}</em>"
        )
        header = _render_entry_header(left, entry["date"], eh_fs, b_gap)
        bullets_html = "".join(_render_bullet(b, fs, b_gap, lh) for b in entry.get("bullets", []))
        work_html += f'<div class="entry">{header}{bullets_html}</div>'

    # ── TECHNOLOGIES ─────────────────────────────────────────────────────────
    tech_line = _e(content.get("technologies", ""))
    tech_html = f'<div style="font-size:{fs}pt;margin-top:1pt;">• {tech_line}</div>'

    # ── ASSEMBLE ─────────────────────────────────────────────────────────────
    body = f"""
    <div class="page-header">
      <div class="name">{_e(content.get("name", ""))}</div>
      <div class="contact">{contact_line}</div>
    </div>

    <div class="section">
      <div class="section-title">EDUCATION</div>
      {edu_html}
    </div>

    <div class="section">
      <div class="section-title">CODING EXPERIENCE</div>
      {coding_html}
    </div>

    <div class="section">
      <div class="section-title">WORK EXPERIENCE</div>
      {work_html}
    </div>

    <div class="section">
      <div class="section-title">TECHNOLOGIES:</div>
      {tech_html}
    </div>
    """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>{css}</style>
</head>
<body>{body}</body>
</html>"""
