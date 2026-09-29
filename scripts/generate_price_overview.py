#!/usr/bin/env python3
"""Rebuild the 'Alle IPTV Pakete im Überblick' section on pages that carry it.

Prices are the single source of truth here. CSS-only tabs (radio inputs) keep all
40 plan links in the static HTML for crawlers, no JavaScript needed.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ["de/index.html", "index.html", "iptv-preise.html"]

# devices -> (1 Monat, 3 Monate, 6 Monate, 1 Jahr)
PRICES = {
    1: (9, 29, 39, 49),
    2: (18, 50, 69, 89),
    3: (27, 75, 105, 135),
    4: (36, 99, 140, 180),
    5: (45, 120, 175, 225),
    6: (54, 144, 210, 270),
    7: (63, 168, 245, 315),
    8: (72, 192, 280, 360),
    9: (81, 216, 315, 405),
    10: (90, 240, 350, 450),
}
PERIODS = [  # key, months, label, slug
    ("1", 1, "1 Monat", "1-monat"),
    ("3", 3, "3 Monate", "3-monate"),
    ("6", 6, "6 Monate", "6-monate"),
    ("12", 12, "1 Jahr", "1-jahr"),
]

CSS = """
.pp{position:relative;padding:72px 0;border-top:1px solid var(--line,rgba(255,255,255,.09));overflow:hidden}
.pp::before{content:"";position:absolute;inset:0;background:radial-gradient(60% 45% at 50% 0%,rgba(223,173,5,.14),transparent 70%);pointer-events:none}
.pp .wrap{position:relative}
.pp-head{text-align:center;max-width:640px;margin:0 auto 28px}
.pp-eyebrow{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold,#DFAD05);margin-bottom:10px}
.pp-head h2{font-size:clamp(24px,4.2vw,34px);font-weight:800;line-height:1.2;margin-bottom:10px}
.pp-head p{color:var(--text-dim,#B0B0B0);font-size:15px}
.pp-r{position:absolute;opacity:0;pointer-events:none}
.pp-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;max-width:520px;margin:0 auto 32px;padding:5px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid var(--line,rgba(255,255,255,.09))}
.pp-tabs label{position:relative;text-align:center;padding:10px 4px;border-radius:999px;font-size:14px;font-weight:700;color:var(--text-dim,#B0B0B0);cursor:pointer;transition:.2s;white-space:nowrap;-webkit-tap-highlight-color:transparent}
.pp-tabs label:hover{color:#fff}
.pp-tabs label small{display:block;font-size:10px;font-weight:700;letter-spacing:.04em;color:inherit;opacity:.8;margin-top:1px}
.pp-panel{display:none;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px}
#pp-r1:checked~.pp-tabs label[for=pp-r1],#pp-r3:checked~.pp-tabs label[for=pp-r3],#pp-r6:checked~.pp-tabs label[for=pp-r6],#pp-r12:checked~.pp-tabs label[for=pp-r12]{background:linear-gradient(135deg,#F6D054,#DFAD05 55%,#B08A04);color:#111;box-shadow:0 4px 18px rgba(223,173,5,.35)}
#pp-r1:focus-visible~.pp-tabs label[for=pp-r1],#pp-r3:focus-visible~.pp-tabs label[for=pp-r3],#pp-r6:focus-visible~.pp-tabs label[for=pp-r6],#pp-r12:focus-visible~.pp-tabs label[for=pp-r12]{outline:2px solid #fff;outline-offset:2px}
#pp-r1:checked~.pp-panels .pp-p1,#pp-r3:checked~.pp-panels .pp-p3,#pp-r6:checked~.pp-panels .pp-p6,#pp-r12:checked~.pp-panels .pp-p12{display:grid;animation:ppIn .35s ease both}
@keyframes ppIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.pp-card{position:relative;display:flex;flex-direction:column;gap:2px;padding:22px 20px 18px;border-radius:18px;text-decoration:none;color:inherit;background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:1px solid var(--line,rgba(255,255,255,.09));transition:transform .2s,border-color .2s,box-shadow .2s}
.pp-card:hover,.pp-card:focus-visible{transform:translateY(-4px);border-color:rgba(223,173,5,.6);box-shadow:0 12px 34px rgba(223,173,5,.16)}
.pp-card.pp-top{border-color:rgba(223,173,5,.55);background:linear-gradient(160deg,rgba(223,173,5,.16),rgba(255,255,255,.02))}
.pp-flag{position:absolute;top:-11px;left:18px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:.03em;color:#111;background:linear-gradient(135deg,#F6D054,#DFAD05)}
.pp-dev{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700}
.pp-dev svg{width:20px;height:20px;flex:none;color:var(--gold,#DFAD05)}
.pp-price{display:flex;align-items:flex-start;gap:2px;margin:12px 0 2px;font-size:44px;font-weight:800;line-height:1;letter-spacing:-.02em}
.pp-price sup{font-size:20px;font-weight:700;margin-top:5px;color:var(--gold,#DFAD05)}
.pp-per{font-size:13px;color:var(--text-dim,#B0B0B0);min-height:20px}
.pp-per b{color:#fff;font-weight:700}
.pp-save{display:inline-block;align-self:flex-start;margin-top:10px;padding:3px 9px;border-radius:999px;font-size:12px;font-weight:700;color:#34d399;background:rgba(16,185,129,.14);border:1px solid rgba(16,185,129,.3)}
.pp-save.pp-none{visibility:hidden}
.pp-cta{margin-top:16px;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px 14px;border-radius:12px;font-size:14px;font-weight:700;color:var(--gold,#DFAD05);border:1px solid rgba(223,173,5,.45);transition:.2s}
.pp-card:hover .pp-cta,.pp-card:focus-visible .pp-cta,.pp-top .pp-cta{color:#111;background:linear-gradient(135deg,#F6D054,#DFAD05 55%,#B08A04);border-color:transparent}
.pp-foot{display:flex;flex-wrap:wrap;justify-content:center;gap:10px 22px;margin-top:30px;font-size:13.5px;color:var(--text-dim,#B0B0B0)}
.pp-foot span::before{content:"✓";margin-right:6px;font-weight:800;color:var(--gold,#DFAD05)}
@media(max-width:560px){.pp{padding:52px 0}.pp-panel{grid-template-columns:1fr 1fr;gap:12px}.pp-card{padding:20px 14px 14px}.pp-price{font-size:36px}.pp-tabs label{font-size:13px;padding:9px 2px}.pp-dev{font-size:14px}}
@media(max-width:340px){.pp-panel{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.pp-panel,.pp-card{animation:none!important;transition:none}}
"""

ICON = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>')


def euro(n):
    s = f"{n:.2f}".replace(".", ",")
    return s[:-3] if s.endswith(",00") else s


def build():
    out = [f"<style>{CSS}</style>",
           '<section class="pp" id="alle-pakete" aria-labelledby="pp-title">',
           '  <div class="wrap">',
           '    <div class="pp-head">',
           '      <span class="pp-eyebrow">Alle Pakete</span>',
           '      <h2 id="pp-title">Alle IPTV Pakete im Überblick</h2>',
           '      <p>Wählen Sie Ihre Laufzeit – je länger, desto günstiger pro Monat. Von 1 bis 10 Geräte gleichzeitig.</p>',
           '    </div>']
    for i, (k, _, _, _) in enumerate(PERIODS):
        chk = " checked" if k == "12" else ""
        out.append(f'    <input class="pp-r" type="radio" name="pp-period" id="pp-r{k}"{chk} aria-label="{PERIODS[i][2]}">')
    out.append('    <div class="pp-tabs" role="presentation">')
    for k, months, label, _ in PERIODS:
        out.append(f'      <label for="pp-r{k}">{label}</label>')
    out.append("    </div>")
    out.append('    <div class="pp-panels">')
    for pi, (k, months, label, slug) in enumerate(PERIODS):
        out.append(f'      <div class="pp-panel pp-p{k}">')
        for dev, row in PRICES.items():
            price = row[pi]
            monthly = row[0]
            full = monthly * months
            save = round((1 - price / full) * 100) if months > 1 else 0
            per = f"<b>{euro(price / months)} €</b> pro Monat" if months > 1 else "monatlich flexibel"
            savehtml = (f'<span class="pp-save">-{save}% gespart</span>' if save
                        else '<span class="pp-save pp-none">&nbsp;</span>')
            word = "Gerät" if dev == 1 else "Geräte"
            top = " pp-top" if (dev == 2 and k == "12") else ""
            flag = '<span class="pp-flag">★ Beliebt</span>' if top else ""
            href = f"/iptv-kaufen-{dev}-{'geraet' if dev == 1 else 'geraete'}-{slug}"
            out.append(
                f'        <a class="pp-card{top}" href="{href}" aria-label="{dev} {word}, {label}: {price} Euro">'
                f'{flag}<span class="pp-dev">{ICON}{dev} {word}</span>'
                f'<span class="pp-price">{price}<sup>€</sup></span>'
                f'<span class="pp-per">{per}</span>{savehtml}'
                f'<span class="pp-cta">Wählen →</span></a>')
        out.append("      </div>")
    out += ['    </div>',
            '    <div class="pp-foot"><span>Kein Vertrag</span><span>Keine automatische Verlängerung</span>'
            '<span>Aktivierung in 5–15 Minuten</span><span>24/7 Support</span></div>',
            "  </div>", "</section>"]
    return "\n".join(out) + "\n"


SEC = re.compile(
    r'(?:<style>\s*\.pp\{.*?</style>\s*)?<section class="(?:pp|py-10 border-t border-white/10)"[^>]*>\s*'
    r'<div class="wrap">\s*<h2[^>]*>Alle IPTV Pakete im Überblick</h2>.*?</section>\n?'
    r'|<style>\s*\.pp\{.*?</style>\s*<section class="pp".*?</section>\n?', re.S)


def main():
    new = build()
    for p in PAGES:
        f = ROOT / p
        html = f.read_text(encoding="utf-8")
        html2, n = SEC.subn(lambda m: new, html, count=1)
        if n != 1:
            sys.exit(f"{p}: section not found")
        f.write_text(html2, encoding="utf-8")
        print("updated", p)


if __name__ == "__main__":
    main()
