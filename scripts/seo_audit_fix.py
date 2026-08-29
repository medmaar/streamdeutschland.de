#!/usr/bin/env python3
"""
SEO Audit Fix Script — streamdeutschland.de
Run: python3 scripts/seo_audit_fix.py

Fixes:
  1. 21 plan pages: switch OG image hero.webp→og-pricing.webp, add width/height/type
  2. 4 pages: add missing x-default hreflang
  3. 2 noindex pages: align og:url with canonical
"""

import re, glob, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

fixes = {
    'og_image_plan': 0,
    'hreflang_xdefault': 0,
    'ogurl_canon': 0,
}
errors = []

# ─── FIX 1: Plan pages — og:image + missing width/height/type ────────────────

PLAN_PAGES = sorted(glob.glob(os.path.join(ROOT, "iptv-kaufen-*.html")))

for filepath in PLAN_PAGES:
    try:
        with open(filepath, encoding='utf-8') as f:
            content = f.read()
        original = content

        # Replace hero.webp with og-pricing.webp
        content = content.replace(
            'content="https://streamdeutschland.de/assets/hero.webp"',
            'content="https://streamdeutschland.de/assets/og-pricing.webp"'
        )

        # After og:image tag, inject width/height/type if missing
        # Pattern: og:image" content="..."> followed by NO og:image:width
        if 'og:image:width' not in content:
            content = re.sub(
                r'(<meta property="og:image" content="[^"]+">\n)',
                r'\1<meta property="og:image:width" content="1200">\n'
                r'<meta property="og:image:height" content="630">\n'
                r'<meta property="og:image:type" content="image/webp">\n',
                content
            )

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            fixes['og_image_plan'] += 1

    except Exception as e:
        errors.append(f"{os.path.basename(filepath)}: {e}")

# ─── FIX 2: 4 pages — add missing x-default hreflang ────────────────────────

# Pages where only "de" hreflang exists, need to add x-default
HREFLANG_FIXES = {
    "bestes-iptv.html": "https://streamdeutschland.de/bestes-iptv",
    "iptv-gratis-testen.html": "https://streamdeutschland.de/iptv-gratis-testen",
    "iptv-m3u-listen.html": "https://streamdeutschland.de/iptv-m3u-listen",
    # testline is noindex pointing to iptv-line-test as canonical
    "iptv-testline.html": "https://streamdeutschland.de/iptv-line-test",
}

for filename, xdefault_href in HREFLANG_FIXES.items():
    filepath = os.path.join(ROOT, filename)
    try:
        with open(filepath, encoding='utf-8') as f:
            content = f.read()
        original = content

        if 'hreflang="x-default"' not in content:
            # Insert x-default after the existing hreflang="de" line
            content = re.sub(
                r'(<link rel="alternate" hreflang="de" href="[^"]+">\n)',
                r'\1' + f'<link rel="alternate" hreflang="x-default" href="{xdefault_href}">\n',
                content
            )

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            fixes['hreflang_xdefault'] += 1

    except Exception as e:
        errors.append(f"{filename}: {e}")

# ─── FIX 3: 2 noindex pages — align og:url with canonical ───────────────────

OGURL_FIXES = {
    "iptv-test-kostenlos.html": "https://streamdeutschland.de/iptv-test",
    "iptv-testline.html": "https://streamdeutschland.de/iptv-line-test",
}

for filename, correct_url in OGURL_FIXES.items():
    filepath = os.path.join(ROOT, filename)
    try:
        with open(filepath, encoding='utf-8') as f:
            content = f.read()
        original = content

        # Replace whatever og:url currently is
        content = re.sub(
            r'<meta property="og:url" content="[^"]+">',
            f'<meta property="og:url" content="{correct_url}">',
            content
        )

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            fixes['ogurl_canon'] += 1

    except Exception as e:
        errors.append(f"{filename}: {e}")

# ─── REPORT ──────────────────────────────────────────────────────────────────

print("✅ Fix 1 — Plan page OG image (width/height/type + og-pricing.webp):")
print(f"   {fixes['og_image_plan']} pages fixed")
print()
print("✅ Fix 2 — Hreflang x-default added:")
print(f"   {fixes['hreflang_xdefault']} pages fixed")
print()
print("✅ Fix 3 — og:url aligned with canonical on noindex pages:")
print(f"   {fixes['ogurl_canon']} pages fixed")
print()
if errors:
    print("❌ ERRORS:")
    for e in errors: print(f"   {e}")
else:
    print("✅ No errors")

# ─── VERIFICATION ────────────────────────────────────────────────────────────
print()
print("=== VERIFICATION ===")

# Verify plan pages
sample_plan = os.path.join(ROOT, "iptv-kaufen-1-geraet-1-monat.html")
c = open(sample_plan, encoding='utf-8').read()
og_img   = re.search(r'og:image" content="([^"]+)"', c)
og_w     = re.search(r'og:image:width" content="([^"]+)"', c)
og_h     = re.search(r'og:image:height" content="([^"]+)"', c)
og_t     = re.search(r'og:image:type" content="([^"]+)"', c)
print(f"Sample plan page (iptv-kaufen-1-geraet-1-monat):")
print(f"  og:image = {og_img.group(1) if og_img else 'MISSING'}")
print(f"  og:image:width = {og_w.group(1) if og_w else 'MISSING'}")
print(f"  og:image:height = {og_h.group(1) if og_h else 'MISSING'}")
print(f"  og:image:type = {og_t.group(1) if og_t else 'MISSING'}")

# Verify hreflang
print()
for fn in ['bestes-iptv.html', 'iptv-gratis-testen.html', 'iptv-m3u-listen.html', 'iptv-testline.html']:
    c = open(os.path.join(ROOT, fn), encoding='utf-8').read()
    tags = re.findall(r'<link rel="alternate" hreflang="[^"]+" href="[^"]+">', c)
    xdef = any('x-default' in t for t in tags)
    print(f"{fn}: hreflang tags={len(tags)}, x-default={'✅' if xdef else '❌'}")

# Verify og:url on noindex pages
print()
for fn, expected in [("iptv-test-kostenlos.html", "iptv-test"), 
                      ("iptv-testline.html", "iptv-line-test")]:
    c = open(os.path.join(ROOT, fn), encoding='utf-8').read()
    ogurl = re.search(r'og:url" content="([^"]+)"', c)
    match = expected in (ogurl.group(1) if ogurl else '')
    print(f"{fn}: og:url={'✅ matches canonical' if match else '❌ MISMATCH'} ({ogurl.group(1) if ogurl else 'MISSING'})")

print()
print("=== FINAL AUDIT SUMMARY ===")
import glob as g
all_pages = g.glob(os.path.join(ROOT, "*.html"))
total_issues = 0
for filepath in all_pages:
    c = open(filepath, encoding='utf-8').read()
    og_img = re.search(r'og:image" content="([^"]+)"', c)
    og_w = re.search(r'og:image:width" content="([^"]+)"', c)
    og_h = re.search(r'og:image:height" content="([^"]+)"', c)
    if not og_w or not og_h:
        total_issues += 1
        print(f"  Still missing og:image dimensions: {os.path.basename(filepath)}")

if total_issues == 0:
    print("  All pages: og:image:width and og:image:height present ✅")
