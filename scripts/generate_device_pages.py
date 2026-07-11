#!/usr/bin/env python3
"""
Generates device-dedicated IPTV landing pages for streamdeutschland.de,
each targeting a distinct high-volume keyword cluster with differentiated
setup content (not duplicated across pages).
Run from repo root: python3 scripts/generate_device_pages.py
"""
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEVICES = [
    {
        "slug": "iptv-box", "title_kw": "IPTV Box",
        "meta_title": "IPTV Box kaufen 2026 – Beste Android IPTV Box im Vergleich",
        "meta_desc": "IPTV Box ab 9€/Monat: Android-Boxen im Vergleich, Einrichtung in Minuten, +50.000 Kanäle in 4K. Jetzt IPTV Box Abo bei StreamDeutschland sichern.",
        "keywords": "iptv box, ip tv box, iptv box android, box android iptv, iptv box sky, iptv abo, iptv anbieter",
        "h1": "IPTV Box – die beste Android-Box für Ihr IPTV Abo",
        "lead": "Eine <strong>IPTV Box</strong> ist die zuverlässigste Art, IPTV auf dem Fernseher zu schauen — leistungsfähiger als die meisten Smart-TV-Betriebssysteme und flexibler als ein reiner Stick. Wir zeigen, welche Box-Typen sich eignen und wie die Einrichtung funktioniert.",
        "sections": [
            ("Welche IPTV Box passt zu Ihnen?", "Die gängigste Wahl ist eine <strong>Android-basierte IPTV Box</strong> (z. B. MAG-Box oder generische Android-TV-Box) mit mindestens 2 GB RAM. Diese Boxen laufen unabhängig vom Fernseher, unterstützen 4K-Wiedergabe und lassen sich frei mit Apps wie IPTV Smarters Pro oder TiviMate bestücken. Wichtig ist ein aktueller Prozessor, damit auch anspruchsvolle 4K-Streams flüssig laufen."),
            ("IPTV Box einrichten – so geht's", "1. Box mit dem Fernseher und dem Internet (idealerweise per LAN-Kabel für maximale Stabilität) verbinden. 2. IPTV-Player-App aus dem App-Store der Box installieren. 3. Die von uns per E-Mail zugesendeten Zugangsdaten (Benutzername, Passwort, M3U-Link) in der App hinterlegen. 4. Sender laden lassen — nach wenigen Minuten steht das komplette Kanalpaket bereit."),
            ("Warum eine IPTV Box oft besser ist als der Smart-TV selbst", "Viele Smart-TV-Betriebssysteme sind auf Hersteller-Apps optimiert und bei Drittanbieter-Apps limitiert. Eine dedizierte <strong>IPTV Box</strong> umgeht diese Einschränkung komplett, bekommt regelmäßige Updates und lässt sich bei Bedarf einfach austauschen, ohne den ganzen Fernseher zu ersetzen."),
        ],
        "faqs": [
            ("Brauche ich zwingend eine spezielle IPTV Box?", "Nein, IPTV läuft auch auf Smart-TVs, Fire TV Sticks oder Smartphones. Eine dedizierte Box bietet aber meist mehr Leistung und Flexibilität, besonders für 4K-Inhalte."),
            ("Welche IPTV Box wird empfohlen?", "Jede aktuelle Android-TV-Box mit mindestens 2 GB RAM und HDMI 2.0 (für 4K) funktioniert zuverlässig mit unserem Service."),
            ("Wie schnell ist die IPTV Box nach dem Kauf eingerichtet?", "In der Regel innerhalb weniger Minuten: App installieren, Zugangsdaten eingeben, Sender laden — fertig."),
        ],
    },
    {
        "slug": "iptv-stick", "title_kw": "IPTV Stick",
        "meta_title": "IPTV Stick 2026 – Fire TV Stick & Sticks für IPTV einrichten",
        "meta_desc": "IPTV Stick ab 9€/Monat: Fire TV Stick und andere Streaming-Sticks in Minuten einrichten, +50.000 Kanäle in 4K. Jetzt IPTV Stick Abo bei StreamDeutschland sichern.",
        "keywords": "iptv stick, iptv sticks, iptv tv stick, iptv fire tv, fire tv iptv, iptv abo, iptv anbieter",
        "h1": "IPTV Stick – IPTV in Minuten auf jedem Fernseher",
        "lead": "Ein <strong>IPTV Stick</strong> wie der Amazon Fire TV Stick ist die schnellste Möglichkeit, IPTV auf einem beliebigen Fernseher mit HDMI-Anschluss zu nutzen — ganz ohne zusätzliche Box. Wir zeigen, welcher Stick sich eignet und wie die Einrichtung funktioniert.",
        "sections": [
            ("Welcher IPTV Stick eignet sich am besten?", "Der <strong>Amazon Fire TV Stick 4K</strong> ist der mit Abstand populärste IPTV Stick in Deutschland: günstig, weit verbreitet und mit genügend Leistung für flüssiges 4K-Streaming. Auch Google-Chromecast-Nachfolger mit Google TV eignen sich gut. Wichtig ist in beiden Fällen ausreichend Arbeitsspeicher, damit die IPTV-Player-App nicht ins Stocken gerät."),
            ("IPTV Stick einrichten – Schritt für Schritt", "1. Stick in den HDMI-Anschluss des Fernsehers stecken und mit dem WLAN verbinden. 2. Im App-Store des Sticks eine IPTV-Player-App wie IPTV Smarters Pro installieren. 3. Ihre Zugangsdaten (Benutzername, Passwort, M3U-Link) aus unserer Willkommens-E-Mail eintragen. 4. Sender werden automatisch geladen — Streaming kann sofort starten."),
            ("Stick oder Box – was ist der Unterschied?", "Ein Stick ist kompakter, günstiger und für die meisten Haushalte völlig ausreichend. Eine separate <strong>IPTV Box</strong> bietet mehr Leistungsreserven für sehr anspruchsvolle Setups mit mehreren gleichzeitigen 4K-Streams im selben Haushalt."),
        ],
        "faqs": [
            ("Funktioniert IPTV mit dem Fire TV Stick?", "Ja, der Fire TV Stick (idealerweise die 4K-Version) ist eines der am häufigsten genutzten Geräte für unseren Service."),
            ("Wie viel RAM braucht ein IPTV Stick?", "Mindestens 1,5 GB RAM werden empfohlen, damit die IPTV-App auch bei großen Senderlisten flüssig läuft."),
            ("Kann ich mit einem Stick auch in 4K schauen?", "Ja, sofern der Stick 4K unterstützt (z. B. Fire TV Stick 4K oder 4K Max) und Ihre Internetverbindung ausreichend Bandbreite bietet."),
        ],
    },
    {
        "slug": "iptv-android", "title_kw": "IPTV Android",
        "meta_title": "IPTV für Android 2026 – App auf Smartphone, Tablet & Box einrichten",
        "meta_desc": "IPTV Android einrichten: App-Installation auf Smartphone, Tablet und Android-Box in Minuten. +50.000 Kanäle in 4K. Jetzt IPTV Abo bei StreamDeutschland sichern.",
        "keywords": "iptv android, box android iptv, application iptv android, iptv player android, iptv android",
        "h1": "IPTV für Android – Smartphone, Tablet und Box einrichten",
        "lead": "Android ist die mit Abstand flexibelste Plattform für IPTV: Ob <strong>Smartphone, Tablet oder Android-Box</strong> — mit der richtigen App läuft unser IPTV-Angebot auf praktisch jedem Android-Gerät. Wir zeigen die Einrichtung für alle drei Varianten.",
        "sections": [
            ("IPTV auf dem Android-Smartphone oder Tablet", "Laden Sie eine IPTV-Player-App wie IPTV Smarters Pro aus dem Google Play Store herunter. Tragen Sie anschließend Ihre Zugangsdaten ein — fertig ist Ihr mobiles IPTV-Erlebnis für unterwegs, im WLAN oder über mobile Daten."),
            ("IPTV auf einer Android-Box oder Android-TV", "Auf Android-TV-Geräten und dedizierten Android-Boxen funktioniert die Einrichtung identisch, nur mit einer für den Fernseher optimierten Oberfläche. Der Vorteil: großer Bildschirm, Fernbedienungssteuerung und in der Regel mehr Rechenleistung für flüssiges 4K."),
            ("Welche App eignet sich am besten für Android?", "IPTV Smarters Pro ist die beliebteste Wahl für Android, da sie EPG (elektronischer Programmführer), Kategorien und Favoriten übersichtlich darstellt. Alternativ funktionieren auch TiviMate oder GSE Smart IPTV zuverlässig mit unserem Service."),
        ],
        "faqs": [
            ("Funktioniert IPTV auf jedem Android-Gerät?", "Ja, solange das Gerät Android 5.0 oder neuer nutzt und über eine stabile Internetverbindung verfügt."),
            ("Brauche ich eine spezielle App für Android?", "Ja, eine IPTV-Player-App wie IPTV Smarters Pro, TiviMate oder GSE Smart IPTV ist notwendig, um die Zugangsdaten zu nutzen."),
            ("Kann ich IPTV gleichzeitig auf Smartphone und Fernseher nutzen?", "Das hängt von der Anzahl gleichzeitiger Verbindungen in Ihrem Paket ab. Mit einem Mehrgeräte-Paket können Smartphone und Fernseher parallel streamen."),
        ],
    },
    {
        "slug": "iptv-receiver", "title_kw": "IPTV Receiver",
        "meta_title": "IPTV Receiver 2026 – IPTV auf jedem Receiver empfangen",
        "meta_desc": "IPTV Receiver einrichten: So empfangen Sie unser IPTV-Angebot auf MAG-Boxen, Set-Top-Boxen und anderen Receivern. +50.000 Kanäle in 4K, ab 9€/Monat.",
        "keywords": "iptv receiver, iptv for receiver, internet protocol tv providers, what is internet protocol television",
        "h1": "IPTV Receiver – IPTV unabhängig vom klassischen Satelliten-Receiver",
        "lead": "Ein <strong>IPTV Receiver</strong> unterscheidet sich grundlegend von einem klassischen Sat- oder Kabelreceiver: Statt Satelliten- oder Kabelsignal wird der Inhalt über das Internet (Internet Protocol Television, kurz IPTV) übertragen. Wir erklären, welche Receiver-Optionen es gibt und wie der Umstieg gelingt.",
        "sections": [
            ("Was ist ein IPTV Receiver genau?", "Anders als bei DVB-S- oder DVB-C-Receivern empfängt ein <strong>IPTV Receiver</strong> das Fernsehsignal als Datenstrom über das Internet. Das kann eine dedizierte Set-Top-Box (z. B. MAG-Box), eine Android-TV-Box mit IPTV-Player-App oder auch ein Smart-TV mit installierter IPTV-App sein — technisch handelt es sich immer um dieselbe zugrunde liegende Streaming-Technologie."),
            ("Vom klassischen Receiver zu IPTV wechseln", "Der größte Vorteil beim Umstieg: Kein Techniker-Termin, keine Schüssel oder Kabelanschluss nötig. Sie benötigen lediglich eine stabile Internetverbindung und ein kompatibles Endgerät. Die Einrichtung dauert in der Regel wenige Minuten, da lediglich eine App installiert und Zugangsdaten eingetragen werden müssen."),
            ("Welche Receiver-Typen unterstützen IPTV?", "MAG-Boxen sind speziell für IPTV entwickelte Set-Top-Boxen mit langer Marktverbreitung. Alternativ funktioniert praktisch jede Android-TV-Box, jeder Fire TV Stick oder jeder aktuelle Smart-TV mit installierter IPTV-Player-App genauso zuverlässig — oft sogar günstiger als eine dedizierte MAG-Box."),
        ],
        "faqs": [
            ("Brauche ich einen speziellen IPTV Receiver?", "Nein, ein dedizierter Receiver wie eine MAG-Box ist eine Option, aber keine Voraussetzung — Android-Boxen, Fire TV Sticks und Smart-TVs funktionieren ebenso zuverlässig."),
            ("Was ist der Unterschied zwischen IPTV und klassischem Satelliten-Receiver?", "Ein Satelliten-Receiver empfängt das Signal über eine Schüssel, ein IPTV Receiver über das Internet. IPTV benötigt keine Installation einer Antenne oder Schüssel."),
            ("Funktioniert eine alte MAG-Box noch mit modernen IPTV-Diensten?", "In den meisten Fällen ja, sofern die Box mit M3U- oder Xtream-Codes-Zugangsdaten kompatibel ist — was bei den meisten MAG-Modellen der Fall ist."),
        ],
    },
]

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{meta_title}</title>
<meta name="description" content="{meta_desc}">
<meta name="keywords" content="{keywords}">
<link rel="canonical" href="https://www.streamdeutschland.de/{slug}.html">
<meta property="og:title" content="{meta_title}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.streamdeutschland.de/{slug}.html">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" href="assets/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{meta_title}",
  "url": "https://www.streamdeutschland.de/{slug}.html",
  "description": "{meta_desc}",
  "inLanguage": "de"
}}
</script>
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
{faq_schema}
  ]
}}
</script>
</head>
<body>

<header>
  <div class="wrap nav">
    <a href="index.html"><img class="brand-mark" src="assets/logo.svg" alt="StreamDeutschland" height="34" style="width:auto;"></a>
    <nav class="nav-links" id="navLinks">
      <a href="index.html#kanaele">Kanäle</a>
      <a href="iptv-preise.html">IPTV Preise</a>
      <a href="iptv-test.html">Kostenloser Test</a>
      <a href="index.html#faq">FAQ</a>
    </nav>
    <div class="nav-right">
      <a class="btn btn-primary" href="iptv-preise.html">IPTV kaufen</a>
      <button class="nav-toggle" id="navToggle" aria-label="Menü öffnen" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="page-content"><div class="wrap" style="max-width:860px;">
<div class="breadcrumb"><a href="index.html">Startseite</a> / {title_kw}</div>
<div class="eyebrow">{title_kw}</div>
<h1>{h1}</h1>
<p class="lead" style="font-size:18px;color:var(--text-dim);max-width:720px;margin:18px 0 34px;">{lead}</p>

{body_sections}

<div style="margin:44px 0;display:flex;gap:14px;flex-wrap:wrap;">
  <a class="btn btn-primary" href="iptv-test.html">Kostenlosen Test starten</a>
  <a class="btn btn-ghost" href="iptv-preise.html">IPTV Preise ansehen</a>
</div>

<h2>Häufige Fragen</h2>
<div class="faq-list">
{faq_html}
</div>

</div></div>

<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-col">
        <img src="assets/logo.svg" alt="StreamDeutschland" height="30" style="height:30px;width:auto;margin-bottom:14px;">
        <p style="color:var(--text-dim);font-size:14px;max-width:280px;">IPTV Deutschland 2026 – über 20.000 Kanäle, stabiler Server, deutscher Support.</p>
      </div>
      <div class="foot-col">
        <h4>Produkt</h4>
        <a href="iptv-preise.html">IPTV Abo &amp; Preise</a>
        <a href="index.html#kanaele">Kanäle</a>
        <a href="iptv-test.html">Kostenloser Test</a>
      </div>
      <div class="foot-col">
        <h4>Ratgeber</h4>
        <a href="iptv-kaufen.html">IPTV kaufen</a>
        <a href="iptv-anbieter-vergleich.html">Anbieter-Vergleich</a>
        <a href="iptv-box-stick.html">Box &amp; Stick</a>
        <a href="smart-iptv-app.html">Smart IPTV App</a>
        <a href="iptv-smarters-pro.html">IPTV Smarters Pro</a>
        <a href="iptv-m3u-playlist.html">M3U Playlist</a>
        <a href="iptv-test.html">Kostenlos testen</a>
        <a href="german-iptv.html">German IPTV (English)</a>
      </div>
      <div class="foot-col">
        <h4>Rechtliches</h4>
        <a href="legal/impressum.html">Impressum</a>
        <a href="legal/datenschutz.html">Datenschutz</a>
        <a href="legal/agb.html">AGB</a>
      </div>
    </div>
    <div class="foot-bottom">
      <div>© 2026 StreamDeutschland. Alle Rechte vorbehalten.</div>
      <div>IPTV-Technologie ist legal; die Rechtmässigkeit der übertragenen Inhalte liegt beim jeweiligen Rechteinhaber.</div>
    </div>
  </div>
</footer>
<a href="/go/wa?msg=Hallo%2C%20ich%20habe%20eine%20Frage%20zu%20{title_kw_url}" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Per WhatsApp kontaktieren">
  <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff" aria-hidden="true"><path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.36.66 4.57 1.8 6.46L4 29l7.7-1.75a11.98 11.98 0 0 0 4.32.8h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.9h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-4.57 1.04 1.06-4.45-.24-.38a9.86 9.86 0 0 1-1.5-5.5c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.45 9.87-9.87 9.87zm5.44-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>
</a>

<script src="assets/main.js"></script>
</body>
</html>
"""

def main():
    for d in DEVICES:
        body_sections = "\n".join(
            f"<h2>{h}</h2>\n<p>{p}</p>" for h, p in d["sections"]
        )
        faq_html = "\n".join(
            f"  <details><summary>{q}</summary><p>{a}</p></details>" for q, a in d["faqs"]
        )
        faq_schema = ",\n".join(
            '    { "@type": "Question", "name": "%s", "acceptedAnswer": { "@type": "Answer", "text": "%s" } }' % (q, a)
            for q, a in d["faqs"]
        )
        html = PAGE_TEMPLATE.format(
            meta_title=d["meta_title"], meta_desc=d["meta_desc"], keywords=d["keywords"],
            slug=d["slug"], title_kw=d["title_kw"], title_kw_url=d["title_kw"].replace(" ", "%20"),
            h1=d["h1"], lead=d["lead"], body_sections=body_sections,
            faq_html=faq_html, faq_schema=faq_schema,
        )
        path = os.path.join(BASE, f"{d['slug']}.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Wrote {path}")

if __name__ == "__main__":
    main()
