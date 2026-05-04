import fitz  # pymupdf
import json

PDF_PATH = r'C:\Users\wimer\Desktop\portfolio\resume\Brooks Wimer Software Developer Resume (4).pdf'
OUT_PNG  = r'C:\Users\wimer\Desktop\portfolio\resume\v4_preview.png'

doc = fitz.open(PDF_PATH)
print(f'Pages: {len(doc)}')
page = doc[0]

# Render to PNG at 2x for clarity
mat = fitz.Matrix(2.0, 2.0)
pix = page.get_pixmap(matrix=mat)
pix.save(OUT_PNG)
print(f'Preview saved to: {OUT_PNG}')

# Extract text spans with font info
print('\n=== TEXT SPANS (first 60) ===')
count = 0
blocks = page.get_text('dict')['blocks']
for b in blocks:
    if b['type'] != 0:
        continue
    for line in b['lines']:
        for span in line['spans']:
            txt = span['text'].strip()
            if not txt:
                continue
            print(f"  size={span['size']:.1f}  bold={'Bold' in span['font'] or 'bold' in span['font']}  "
                  f"color={hex(span['color'])}  font={span['font']}  text={txt[:80]}")
            count += 1
            if count >= 60:
                break
        if count >= 60:
            break
    if count >= 60:
        break

# Page dimensions
print(f'\nPage rect: {page.rect}')
print(f'Width: {page.rect.width:.1f}pt  Height: {page.rect.height:.1f}pt')

# Get all text (flat) so we see the full content
print('\n=== ALL TEXT ===')
print(page.get_text())
