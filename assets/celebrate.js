/* Stream Deutschland – full-screen funny success screen after a free-trial request or a plan order.
   Loaded on /iptv-test (data-kind="free-trial") and every /iptv-kaufen-* plan page (data-kind="order").
   The forms are untouched: when a form's own code reveals #formSuccessPanel after a successful send,
   this script swaps that plain panel for the celebration and shows the email from #confirmedEmail.
   Preview without submitting: add ?celebrate=trial or ?celebrate=order to the page URL.
   Edit the texts in CELEBRATE below. */
(function () {
  "use strict";
  var me = document.currentScript;
  var KIND = (me && me.getAttribute("data-kind")) || "free-trial";

  var CELEBRATE = {
    "free-trial": {
      title: "Ihr Testzugang ist unterwegs!",
      lines: [
        "Unsere Technik-Wichtel schicken Ihre Zugangsdaten gerade an <b data-c-email></b>, mit deutscher Gründlichkeit und ganz ohne Formular in dreifacher Ausfertigung. 📨",
        "Meist ist die E-Mail in unter 2 Minuten da. Bitte prüfen Sie Ihren <b>Posteingang</b> UND Ihren <b>Spam-Ordner</b>, denn manchmal versteckt sich unsere E-Mail dort wie ein Gartenzwerg im Gebüsch.",
        "Ihre einzige Aufgabe für die nächsten 24 Stunden: Chips holen und Füße hoch. 🍿",
      ],
      btn: "Alles klar, ich hol die Chips",
    },
    order: {
      title: "Geschafft! Bestellung ist drin.",
      lines: [
        "Starke Entscheidung. Ihr Sofa wurde bereits informiert und ist mächtig stolz auf Sie. 🛋️",
        "Ihre Rechnung fliegt gerade zu <b data-c-email></b>. Bitte prüfen Sie Ihren <b>Posteingang</b> UND Ihren <b>Spam-Ordner</b>, denn E-Mails spielen gern Verstecken.",
        "Rechnung bezahlen, und Ihre Sender sind schneller startklar als jeder ICE. Versprochen, wir sind pünktlicher als die Bahn. 🚄",
      ],
      btn: "Super, los geht’s!",
    },
  };

  var CSS =
    ".sd-cel-lock,.sd-cel-lock body{overflow:hidden!important}" +
    ".sd-cel{position:fixed;inset:0;z-index:10050;display:grid;place-items:center;padding:16px;overflow-y:auto;font-family:inherit;" +
    "background:radial-gradient(circle at 50% 35%,rgba(34,197,94,.22),transparent 60%),rgba(6,8,14,.93);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);animation:sd-cel-in .3s ease both}" +
    ".sd-cel.is-out{animation:sd-cel-out .25s ease forwards}" +
    ".sd-cel-box{position:relative;box-sizing:border-box;width:min(560px,100%);text-align:center;padding:clamp(28px,6vw,48px) clamp(18px,5vw,40px);" +
    "background:#0f172a;border:1px solid rgba(34,197,94,.45);border-radius:20px;box-shadow:0 0 0 1px rgba(34,197,94,.2),0 40px 120px -30px rgba(34,197,94,.45);" +
    "animation:sd-cel-pop .55s .05s cubic-bezier(.2,.9,.3,1.3) both}" +
    ".sd-cel-x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.06);color:#94a3b8;font-size:28px;line-height:1;cursor:pointer}" +
    ".sd-cel-x:hover,.sd-cel-x:focus-visible{color:#fff;background:rgba(255,255,255,.12)}" +
    ".sd-cel-mark{display:block;width:clamp(130px,38vw,180px);height:auto;margin:0 auto 22px;fill:none;stroke:#4ade80;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 24px rgba(74,222,128,.5))}" +
    ".sd-cel-mark circle{stroke-width:6;stroke-dasharray:340;stroke-dashoffset:340;fill:rgba(34,197,94,.1);animation:sd-cel-draw .7s .2s ease forwards}" +
    ".sd-cel-mark path{stroke-width:9;stroke-dasharray:80;stroke-dashoffset:80;transform-origin:center;animation:sd-cel-draw .45s .8s ease forwards,sd-cel-bounce .5s 1.2s ease}" +
    ".sd-cel h2{font-size:clamp(28px,6vw,40px);line-height:1.15;font-weight:800;margin:0 0 16px;color:#4ade80}" +
    ".sd-cel p{color:#cbd5e1;font-size:clamp(16px,2.2vw,18px);line-height:1.55;margin:0 auto 12px;max-width:460px}" +
    ".sd-cel p b{color:#fff;word-break:break-word}" +
    ".sd-cel-go{display:block;margin:22px auto 0;width:100%;max-width:360px;min-height:52px;padding:14px 22px;border:0;border-radius:12px;cursor:pointer;" +
    "background:#22c55e;color:#04140a;font:inherit;font-size:17px;font-weight:800;box-shadow:0 10px 30px -10px rgba(34,197,94,.7)}" +
    ".sd-cel-go:hover,.sd-cel-go:focus-visible{background:#4ade80}" +
    ".sd-cel-help{margin-top:16px!important;font-size:14px!important;color:#64748b!important}" +
    ".sd-cel-help a{color:#22c55e;font-weight:600;text-decoration:none}" +
    ".sd-cel-bits{position:fixed;inset:0;pointer-events:none;overflow:hidden}" +
    ".sd-cel-bits i{position:absolute;top:-40px;left:var(--x);width:10px;height:16px;border-radius:3px;font-style:normal;font-size:22px;line-height:1;background:#dd0000;" +
    "animation:sd-cel-fall var(--t) var(--d) linear infinite}" +
    ".sd-cel-bits i:nth-child(4n+1){background:#ffce00}.sd-cel-bits i:nth-child(4n+2){background:#22c55e}.sd-cel-bits i:nth-child(4n+3){background:#f8fafc}" +
    ".sd-cel-bits i.e{width:auto;height:auto;background:none}" +
    "@keyframes sd-cel-in{from{opacity:0}}@keyframes sd-cel-out{to{opacity:0}}" +
    "@keyframes sd-cel-pop{from{opacity:0;transform:scale(.85) translateY(20px)}}" +
    "@keyframes sd-cel-draw{to{stroke-dashoffset:0}}@keyframes sd-cel-bounce{50%{transform:scale(1.15)}}" +
    "@keyframes sd-cel-fall{from{transform:translateY(0) rotate(var(--r))}to{transform:translateY(110vh) rotate(calc(var(--r) + 540deg))}}" +
    "@media (prefers-reduced-motion:reduce){.sd-cel,.sd-cel-box{animation:none}.sd-cel-bits{display:none}.sd-cel-mark circle,.sd-cel-mark path{animation:none;stroke-dashoffset:0}}";

  var EMOJI = ["⚽", "📺", "🍿", "🥨"];

  function addCss() {
    if (document.getElementById("sd-cel-css")) return;
    var s = document.createElement("style");
    s.id = "sd-cel-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function celebrate(kind, email) {
    var c = CELEBRATE[kind] || CELEBRATE["free-trial"];
    addCss();
    var old = document.querySelector(".sd-cel");
    if (old) old.remove();
    var back = document.activeElement;
    var el = document.createElement("div");
    el.className = "sd-cel";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "sd-cel-title");
    var bits = "";
    for (var i = 0; i < 30; i++) {
      var emo = i % 3 ? "" : EMOJI[(i / 3) % EMOJI.length];
      bits += '<i class="' + (emo ? "e" : "") + '" style="--x:' + ((i * 37) % 100) + "%;--d:" + (i % 7) * 0.35 + "s;--t:" +
        (3.2 + (i % 5) * 0.5) + "s;--r:" + ((i * 53) % 360) + 'deg">' + emo + "</i>";
    }
    el.innerHTML =
      '<div class="sd-cel-bits" aria-hidden="true">' + bits + "</div>" +
      '<div class="sd-cel-box">' +
      '<button class="sd-cel-x" type="button" aria-label="Schließen">×</button>' +
      '<svg class="sd-cel-mark" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54"/><path d="M36 62 53 79 86 44"/></svg>' +
      '<h2 id="sd-cel-title">' + c.title + "</h2>" +
      c.lines.map(function (l) { return "<p>" + l + "</p>"; }).join("") +
      '<button class="sd-cel-go" type="button">' + c.btn + "</button>" +
      '<p class="sd-cel-help">Probleme? <a href="/go/wa" target="_blank" rel="noopener nofollow">WhatsApp Support</a></p>' +
      "</div>";
    el.querySelectorAll("[data-c-email]").forEach(function (b) { b.textContent = email || "Ihre E-Mail-Adresse"; });
    var go = el.querySelector(".sd-cel-go"), x = el.querySelector(".sd-cel-x");
    function close() {
      document.removeEventListener("keydown", onKey);
      el.classList.add("is-out");
      document.documentElement.classList.remove("sd-cel-lock");
      document.body.style.overflow = "";
      setTimeout(function () { el.remove(); }, 250);
      if (back && back.focus) try { back.focus({ preventScroll: true }); } catch (e) {}
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") { e.preventDefault(); (document.activeElement === go ? x : go).focus(); }
    }
    document.addEventListener("keydown", onKey);
    x.addEventListener("click", close);
    go.addEventListener("click", close);
    document.body.appendChild(el);
    document.documentElement.classList.add("sd-cel-lock");
    try { go.focus({ preventScroll: true }); } catch (e) { go.focus(); }
  }
  window.sdCelebrate = celebrate;

  function init() {
    // swap the page's plain success panel for the celebration as soon as the form's code shows it
    var panel = document.getElementById("formSuccessPanel");
    if (panel && "MutationObserver" in window) {
      new MutationObserver(function () {
        if (panel.style.display && panel.style.display !== "none") {
          panel.style.display = "none";
          var em = document.getElementById("confirmedEmail");
          celebrate(KIND, em ? em.textContent.trim() : "");
        }
      }).observe(panel, { attributes: true, attributeFilter: ["style"] });
    }
    var q = new URLSearchParams(location.search).get("celebrate");
    if (q) celebrate(q === "order" ? "order" : "free-trial", "sie@beispiel.de");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
