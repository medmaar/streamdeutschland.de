#!/usr/bin/env python3
"""
SEO Fix Script - streamdeutschland.de
Fixes:
  1. og:image:type mismatch (image/jpeg → image/webp) on 201 pages
  2. 5 <title> tags over 60 Unicode chars
"""

import re, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ──────────────────────────────────────────────────────────────
# FIX 1 – OG IMAGE TYPE
# All OG images are .webp but type is declared as image/jpeg
# ──────────────────────────────────────────────────────────────

def fix_og_image_type(content):
    """Change og:image:type from image/jpeg to image/webp when image URL is .webp"""
    def replacer(m):
        full = m.group(0)
        # Only replace if the og:image referenced on this page is webp
        if 'image/jpeg' in full:
            return full.replace('content="image/jpeg"', 'content="image/webp"')
        return full
    # Target the specific og:image:type tag
    return re.sub(
        r'<meta property="og:image:type" content="image/jpeg">',
        '<meta property="og:image:type" content="image/webp">',
        content
    )

# ──────────────────────────────────────────────────────────────
# FIX 2 – TITLE TAG LENGTH (5 pages)
# ──────────────────────────────────────────────────────────────

TITLE_FIXES = {
    "iptv-test-24h.html": {
        "title_old": "IPTV Test 24 Stunden kostenlos – gratis testen 2026 | StreamDeutschland",
        "title_new": "IPTV 24h Test kostenlos 2026 – gratis testen | StreamDE",
    },
    "iptv-nachrichten.html": {
        "title_old": "IPTV Nachrichten Sender 2026 – ARD, ZDF, n-tv live | StreamDeutschland",
        "title_new": "IPTV Nachrichten 2026 – ARD, ZDF, n-tv live | StreamDE",
    },
    "iptv-sky-ticket.html": {
        "title_old": "IPTV statt Sky Ticket 2026 – 50.000 Sender ab 9€ | StreamDeutschland",
        "title_new": "IPTV statt Sky Ticket 2026 – 50.000 Sender ab 9€ | StreamDE",
    },
    "iptv-dazn.html": {
        "title_old": "IPTV vs DAZN 2026 – Alle Sport-Sender für 9€ | StreamDeutschland",
        "title_new": "IPTV vs DAZN 2026 – Sport-Sender ab 9€ | StreamDeutschland",
    },
    "iptv-kabel-deutschland.html": {
        "title_old": "IPTV vs Kabel Deutschland 2026 – Vergleich | StreamDeutschland",
        "title_new": "IPTV vs Kabel Deutschland 2026 – Vergleich | StreamDE",
    },
}

def fix_title(content, filename):
    fix = TITLE_FIXES.get(filename)
    if not fix:
        return content
    old_title = fix["title_old"]
    new_title = fix["title_new"]
    # Replace in <title> tag
    content = content.replace(
        f"<title>{old_title}</title>",
        f"<title>{new_title}</title>"
    )
    return content

# ──────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────

og_type_fixed = 0
title_fixed = 0
errors = []

html_files = sorted(glob.glob(os.path.join(ROOT, "*.html")))

for filepath in html_files:
    filename = os.path.basename(filepath)
    try:
        with open(filepath, encoding='utf-8') as f:
            original = f.read()
        
        content = original
        
        # Check if this page's OG image is webp before fixing type
        og_img_m = re.search(r'og:image" content="([^"]+)"', content)
        if og_img_m and '.webp' in og_img_m.group(1):
            content = fix_og_image_type(content)
            if content != original:
                og_type_fixed += 1
        
        # Fix title if this page needs it
        if filename in TITLE_FIXES:
            content = fix_title(content, filename)
            title_fixed += 1

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
    
    except Exception as e:
        errors.append(f"{filename}: {e}")

print(f"✅ og:image:type fixed: {og_type_fixed} pages")
print(f"✅ Titles fixed: {title_fixed} pages")
if errors:
    print(f"❌ Errors: {errors}")
else:
    print("✅ No errors")

# ── Verify ────────────────────────────────────────────────────
print("\n=== VERIFICATION ===")

# Verify OG type fix
remaining_mismatch = 0
for filepath in html_files:
    with open(filepath, encoding='utf-8') as f:
        c = f.read()
    og_img = re.search(r'og:image" content="([^"]+)"', c)
    og_type = re.search(r'og:image:type" content="([^"]+)"', c)
    if og_img and og_type and '.webp' in og_img.group(1) and og_type.group(1) != 'image/webp':
        remaining_mismatch += 1

print(f"Remaining og:image:type mismatches: {remaining_mismatch}")

# Verify title lengths
remaining_title_violations = []
for filepath in html_files:
    with open(filepath, encoding='utf-8') as f:
        c = f.read()
    title_m = re.search(r'<title>(.*?)</title>', c)
    if title_m:
        t = title_m.group(1)
        if len(t) > 60:
            remaining_title_violations.append((len(t), os.path.basename(filepath), t))

if remaining_title_violations:
    print("Remaining title violations:")
    for l, f, t in sorted(remaining_title_violations, reverse=True):
        print(f"  [{l}] {f}: {t}")
else:
    print("No remaining title violations ✅")
