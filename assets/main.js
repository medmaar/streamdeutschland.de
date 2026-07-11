window.addEventListener('scroll', function(){
  var h = document.querySelector('header');
  if(!h) return;
  if(window.scrollY > 40){ h.classList.add('scrolled'); }
  else { h.classList.remove('scrolled'); }
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function(){
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

// Subtle parallax on hero background image
var heroEl = document.querySelector('.hero');
if(heroEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(y < window.innerHeight){
      var pos = 30 + (y * 0.04);
      heroEl.style.backgroundPosition = 'center ' + pos + '%';
    }
  }, {passive:true});
}

// Scroll-reveal for any element with class "reveal"
document.addEventListener('DOMContentLoaded', function(){
  var revealEls = document.querySelectorAll('.reveal');
  if(revealEls.length && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  // Animated counters: <span data-count-to="50000" data-count-suffix="+">
  var counters = document.querySelectorAll('[data-count-to]');
  if(counters.length && 'IntersectionObserver' in window){
    var counted = new WeakSet();
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !counted.has(entry.target)){
          counted.add(entry.target);
          animateCount(entry.target);
        }
      });
    }, {threshold:0.4});
    counters.forEach(function(el){ cio.observe(el); });
  }

  function animateCount(el){
    var to = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-count-suffix') || '';
    var decimals = el.getAttribute('data-count-decimals') ? parseInt(el.getAttribute('data-count-decimals')) : 0;
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = to * eased;
      el.textContent = (decimals ? val.toFixed(decimals).replace('.', ',') : Math.round(val).toLocaleString('de-DE')) + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }
});

// Device-tier pricing table
var PRICES = {
  '1-1':'9', '1-3':'29', '1-6':'39', '1-12':'49',
  '2-1':'18', '2-3':'50', '2-6':'69', '2-12':'89',
  '3-1':'27', '3-3':'75', '3-6':'105', '3-12':'135',
  '4-1':'36', '4-3':'99', '4-6':'140', '4-12':'180',
  '5-1':'45', '5-3':'120', '5-6':'175', '5-12':'225'
};

document.addEventListener('DOMContentLoaded', function(){
  var tabs = document.querySelectorAll('.device-tab');
  var priceEls = document.querySelectorAll('[data-price]');
  var origPriceEls = document.querySelectorAll('[data-orig-price]');
  var linkEls = document.querySelectorAll('[data-plan-link]');
  if(!tabs.length) return;

  var PERIOD_SLUG = { '1':'1-monat', '3':'3-monate', '6':'6-monate', '12':'1-jahr' };
  function deviceSlug(devices){
    return devices === '1' ? '1-geraet' : devices + '-geraete';
  }

  function applyDevices(devices){
    priceEls.forEach(function(el){
      var period = el.getAttribute('data-period');
      var key = devices + '-' + period;
      if(PRICES[key]){ el.textContent = PRICES[key]; }
    });
    origPriceEls.forEach(function(el){
      var period = el.getAttribute('data-period');
      var key = devices + '-' + period;
      if(PRICES[key]){ el.textContent = Math.round(parseFloat(PRICES[key]) * 2); }
    });
    linkEls.forEach(function(el){
      var period = el.getAttribute('data-period');
      var slug = PERIOD_SLUG[period];
      if(slug){ el.setAttribute('href', 'iptv-kaufen-' + deviceSlug(devices) + '-' + slug + '.html'); }
    });
  }

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      applyDevices(tab.getAttribute('data-devices'));
    });
  });

  var activeTab = document.querySelector('.device-tab.active') || tabs[0];
  applyDevices(activeTab.getAttribute('data-devices'));
});

// Sales alert banner: rotating "recent purchase" notifications
document.addEventListener('DOMContentLoaded', function(){
  var banner = document.getElementById('salesBanner');
  var closeBtn = document.getElementById('salesBannerClose');
  var titleEl = document.getElementById('salesBannerTitle');
  var textEl = document.getElementById('salesBannerText');
  if(!banner || !titleEl || !textEl) return;
  if(sessionStorage.getItem('sd_sales_banner_dismissed') === '1') return;

  var names = [
    'Alex','Lukas','Max','Jonas','Felix','Niklas','Tim','Leon','Julian','Finn',
    'Sarah','Lena','Julia','Laura','Anna','Nina','Sophie','Marie','Lisa','Katrin'
  ];
  var cities = [
    'München','Berlin','Hamburg','Köln','Frankfurt','Stuttgart','Düsseldorf',
    'Leipzig','Dortmund','Essen','Bremen','Dresden','Hannover','Nürnberg',
    'Duisburg','Bochum','Wuppertal','Mannheim','Karlsruhe','Münster'
  ];
  // Weighted plans: mostly 1 Jahr, a smaller share of shorter terms
  var plans = [
    '1-Jahres-Abo','1-Jahres-Abo','1-Jahres-Abo','1-Jahres-Abo','1-Jahres-Abo',
    '1-Jahres-Abo','1-Jahres-Abo',
    '6-Monats-Abo','6-Monats-Abo',
    '3-Monats-Abo',
    '1-Monats-Abo'
  ];
  var timeAgo = ['gerade eben','vor 2 Minuten','vor 5 Minuten','vor 9 Minuten'];

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  var dismissed = false;
  var lastName = null;
  var timers = [];
  function setT(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }

  function nextNotification(){
    var name = pick(names);
    // avoid showing the same name twice back-to-back
    while(name === lastName){ name = pick(names); }
    lastName = name;
    var city = pick(cities);
    var plan = pick(plans);
    titleEl.innerHTML = '<b>' + name + '</b> aus ' + city + ' hat ein ' + plan + ' gekauft';
    textEl.textContent = pick(timeAgo);
  }

  function cycle(){
    if(dismissed) return;
    nextNotification();
    banner.classList.add('show');
    setT(function(){
      if(dismissed) return;
      banner.classList.remove('show');
      setT(cycle, 3000);
    }, 5000);
  }

  // Randomized initial delay so the first name isn't predictable across visits/refreshes
  setT(cycle, 2000 + Math.floor(Math.random() * 2000));

  if(closeBtn){
    closeBtn.addEventListener('click', function(){
      dismissed = true;
      banner.classList.remove('show');
      sessionStorage.setItem('sd_sales_banner_dismissed', '1');
      timers.forEach(clearTimeout);
    });
  }
});

// ===== Customer reviews slider (Trustpilot / WhatsApp / Google) =====
document.addEventListener('DOMContentLoaded', function(){
  var tpEl = document.getElementById('tpSlide');
  if(!tpEl) return;

  var tpR = [{"t": "Bester IPTV-Service – endlich ohne Aussetzer", "x": "Ich habe mindestens vier IPTV-Anbieter getestet und keiner kam an StreamDeutschland heran. Aktivierung war schnell, Support antwortete sofort, Live-Sport läuft endlich flüssig.", "n": "Thomas R."}, {"t": "Support der wirklich hilft", "x": "Der Kundenservice hat mich bei StreamDeutschland gehalten. Ich kam von einem Anbieter, der bei Problemen verschwand. Hier hört der Support wirklich zu und antwortet schnell.", "n": "Julian M."}, {"t": "Stabil seit dem ersten Tag", "x": "Ich war skeptisch, weil IPTV-Dienste mich bereits enttäuscht haben. Der Service ist seit dem ersten Tag stabil. Live-Matches getestet – keinerlei Probleme.", "n": "Anton B."}, {"t": "Qualität weit über den anderen", "x": "Nach dem Vergleich mit zwei Anbietern war der Unterschied offensichtlich. Die anderen waren unzuverlässig. StreamDeutschland hat mir bei der Einrichtung geholfen und nachgehakt.", "n": "Peter L."}, {"t": "Meine Verbindung war nie das Problem", "x": "Mein alter Anbieter schob Einfrieren immer auf meine Verbindung. Mit diesem Service merkte ich: die Verbindung war nie das Problem. Stabile Streams, konstante HD-Qualität.", "n": "Niklas D."}, {"t": "Transparent – liefert genau was versprochen", "x": "Vor dem Abo hatte ich viele Fragen. Der Support gab ehrliche Antworten ohne zu übertreiben. Nach dem Abo stimmte alles überein.", "n": "Roman C."}, {"t": "Schnelle Aktivierung und echter Support", "x": "Ich wechselte zu streamdeutschland.de nachdem mein alter Service während eines Spiels abstürzte. Der Service aktivierte schnell und begleitete mich geduldig bei der Einrichtung.", "n": "Max P."}, {"t": "Bessere Stabilität und deutlich besserer Support", "x": "StreamDeutschland bietet bessere Stabilität als andere. Bei anderen waren Antworten langsam oder generisch. Hier liest der Support wirklich Ihre Nachricht und hilft gezielt.", "n": "Lukas F."}, {"t": "Optimiert und zuverlässig", "x": "Ich schreibe selten Bewertungen, aber dieser Service verdient es. Der Service scheint wirklich optimiert zu sein und gibt hilfreiche statt kopierte Ratschläge.", "n": "Sebastian K."}, {"t": "Beständigkeit die andere nicht erreichen", "x": "Der größte Unterschied ist die Beständigkeit. Frühere Anbieter waren unberechenbar. StreamDeutschland ist seit dem ersten Tag stabil und meldete sich nach Aktivierung von selbst.", "n": "Matthias C."}, {"t": "Der Vergleich war nicht mal knapp", "x": "StreamDeutschland eine Woche parallel zum alten Anbieter getestet – nicht mal knapp. Bessere Bildqualität, schnellerer Kanalwechsel, keine zufälligen Unterbrechungen.", "n": "Florian D."}, {"t": "Stabilster IPTV-Service den ich je hatte", "x": "Ich nutze streamdeutschland.de seit Monaten – der stabilste Service den ich je hatte. Live-Sport einwandfrei, VOD lädt schnell, Support reaktionsschnell und freundlich.", "n": "Vincent L."}, {"t": "Solide Leistung und echter Kundensupport", "x": "Nach Vergleich günstigerer Alternativen wechselte ich. Bei denen gab es immer Abstriche. Der Anbieter liefert gute Leistung und echten Kundendienst.", "n": "Alex R."}, {"t": "Hat mein Vertrauen in IPTV zurückgegeben", "x": "Nach mehreren schlechten Erfahrungen war ich bereit, IPTV aufzugeben. StreamDeutschland hat bewiesen, dass ein Service stabil, ehrlich und von echten Menschen unterstützt sein kann.", "n": "Chris A."}, {"t": "Premium und zuverlässig", "x": "Die Servicequalität ist klar überlegen. Kanäle stabil, VOD-Auswahl exzellent, Support erklärt Dinge korrekt. Das ist Premium und zuverlässig.", "n": "Stefan B."}];
  var waR = [{"x": "Hallo, wollte nur sagen, der Service funktioniert super. Sport läuft flüssig und bisher keine Unterbrechung. Danke für die schnelle Hilfe gestern.", "n": "Thomas W."}, {"x": "Danke für den Support. Die Installation war einfach. Viel besser als mein alter IPTV der ständig eingefroren ist.", "n": "Julian C."}, {"x": "Bei mir läuft alles gut. Streams sind stabil, auch bei Spielen. Großer Unterschied zum alten Anbieter.", "n": "Peter F."}, {"x": "Funktioniert jetzt einwandfrei. Kundenservice war sehr geduldig, danke. Die Qualität stimmt.", "n": "Roman M."}, {"x": "Bestätigung: alles läuft gut. Live-Sender sind flüssig, VOD lädt schnell. Bisher sehr zufrieden.", "n": "Niklas T."}, {"x": "Danke für die schnelle Antwort. Ich hätte nicht erwartet, dass der Support so schnell reagiert. Der Service ist top.", "n": "Max A."}, {"x": "Nochmals danke für die Hilfe vorhin. Viel stabiler als das IPTV das ich vorher genutzt habe.", "n": "Lukas R."}, {"x": "Alles gut jetzt. Während des Spiels getestet – absolut kein Puffern. Wirklich beeindruckt.", "n": "Anton W."}, {"x": "Der Service läuft gut. Hatte Probleme mit dem alten Anbieter aber hier bisher nichts.", "n": "Sebastian B."}, {"x": "Installation erledigt und alles funktioniert. Danke, dass ihr mich Schritt für Schritt begleitet habt.", "n": "Matthias M."}, {"x": "Wollte euch wissen lassen: alles einwandfrei. Sender laden schnell, die Qualität ist gut.", "n": "Florian H."}, {"x": "Viel besser als vorher. Der Support reagiert wirklich und hilft – das ist selten bei IPTV.", "n": "Vincent P."}, {"x": "Keine Probleme heute. Sport und Filme ohne Probleme geschaut. Guter Service.", "n": "Alex C."}, {"x": "Läuft immer noch gut. Zufrieden mit dem Abo.", "n": "Chris G."}, {"x": "Gestern Abend zu Spitzenzeiten getestet. Kein Lag überhaupt. Große Verbesserung.", "n": "Stefan S."}, {"x": "Service ist solide. Hatte eine Frage und ihr habt schnell geantwortet. Danke.", "n": "Jonathan P."}, {"x": "Streams sind klar und stabil. Die Installation war einfacher als erwartet.", "n": "Benjamin H."}, {"x": "Bestätigung: es funktioniert super. Diese Stabilität hatte ich vorher nicht.", "n": "Paul E."}, {"x": "Danke für den Support. Alles funktioniert wie versprochen. Keine Beschwerden bisher.", "n": "David M."}, {"x": "Sehr zufrieden. Ehrlich gesagt hat der Kundenservice den Unterschied gemacht.", "n": "Damian F."}];
  var gR = [{"x": "Viele IPTV-Services genutzt – StreamDeutschland ist der erste der mich nach der ersten Woche nicht enttäuscht hat. Sender laden schnell, Sport ist flüssig, Qualität konstant.", "n": "Matthias C."}, {"x": "Von einem anderen Anbieter gewechselt der ständig gepuffert hat. StreamDeutschland ist deutlich besser. Streams stabil und der Kundenservice reagiert wirklich.", "n": "Julian T."}, {"x": "Aktivierung war schnell und alles funktionierte wie erwartet. Für Sport und Filme – keine größeren Probleme. Support war höflich und hilfreich.", "n": "Anton M."}, {"x": "Nach schlechten Erfahrungen war ich zögerlich, aber streamdeutschland.de hat mich überrascht. Bildqualität gut, Sender frieren nicht ein, Support blieb verfügbar.", "n": "Roman W."}, {"x": "StreamDeutschland war bisher zuverlässig. Zu Stoßzeiten getestet und alles lief gut. Beim alten Anbieter waren Wochenenden immer problematisch.", "n": "Niklas P."}, {"x": "Was mir am meisten gefällt ist die Beständigkeit. Bei anderen änderte sich die Qualität täglich. StreamDeutschland ist seit dem Abo stabil geblieben.", "n": "Max J."}, {"x": "Schaue hauptsächlich Fußball und PPV-Events – StreamDeutschland handhabt diese gut. Kein nennenswertes Puffern. Support beantwortete Fragen klar.", "n": "Peter O."}, {"x": "Installation einfach. Support antwortete schneller als erwartet. Streams sauber und VOD funktioniert gut. Professioneller als die meisten.", "n": "Sebastian H."}, {"x": "Auf Empfehlung ausprobiert. Im Vergleich zum alten Service stabiler und einfacher. Kundenservice verschwand nicht nach der Zahlung.", "n": "Lukas C."}, {"x": "Sender wechseln schnell, Qualität konstant. Hatte ein kleines Problem und Support löste es in wenigen Minuten. Insgesamt sehr zufrieden.", "n": "Florian R."}, {"x": "streamdeutschland.de seit Monaten genutzt. Live-Sport zuverlässig, Filme laden schnell. Support war jedes Mal reaktionsschnell.", "n": "Vincent A."}, {"x": "StreamDeutschland macht was es verspricht. Keine übertriebenen Aussagen, nur stabiler Service. Beim alten Anbieter hatte ich fast täglich Pufferprobleme. Hier nicht.", "n": "Alex T."}, {"x": "Gute Stream-Qualität und schnelle Aktivierung. Kundenservice hilfreich. Im Vergleich zu anderen wirkt der Anbieter organisierter und vertrauenswürdiger.", "n": "Chris M."}, {"x": "Lasse selten Bewertungen, aber der Service war solide. Sport-Sender gut, VOD-Auswahl gut, Support antwortet schnell statt generische Nachrichten zu senden.", "n": "Stefan B."}, {"x": "Zu StreamDeutschland gewechselt nach ständigen Problemen. Der Unterschied ist spürbar. Bessere Stabilität, deutlich besserer Support.", "n": "Jonathan L."}, {"x": "Aktivierung schnell, Support verfügbar bei Fragen. Hauptsächlich Serien und Filme – alles läuft problemlos. Guter zuverlässiger Service.", "n": "Daniel L."}, {"x": "StreamDeutschland war zu Stoßzeiten stabil, was mein größtes Problem mit früheren Services war. Kundenservice reaktionsschnell und professionell.", "n": "David M."}, {"x": "Sender laden schnell, Qualität bleibt konstant. Support einmal kontaktiert – höflich gelöst. Dieser Service wirkt vertrauenswürdiger.", "n": "Damian P."}, {"x": "StreamDeutschland.de parallel zu einem anderen Anbieter getestet – StreamDeutschland hat klar besser abgeschnitten. Weniger Puffern, schnellerer Kanalwechsel.", "n": "Arndt W."}, {"x": "Zuverlässiger Service mit guter Bildqualität. Bei einer Installationsfrage war Kundenservice erreichbar. Viel flüssiger als mein letzter IPTV-Anbieter.", "n": "Benedikt T."}];


  var tpI = 0, waI = 0, gI = 0;
  var REVIEW_INTERVAL = 7000;
  var tpPause = 0, waPause = 0, gPause = 0;
  var STAR_SVG = '<svg viewBox="0 0 24 24" fill="white" width="12" height="12"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>';

  function mkDots(id, total, current, onClick){
    var el = document.getElementById(id);
    if(!el) return;
    var html = '';
    for(var i = 0; i < total; i++){
      html += '<button class="review-dot' + (i === current ? ' on' : '') + '" aria-label="Bewertung ' + (i + 1) + '" data-i="' + i + '"></button>';
    }
    el.innerHTML = html;
    el.querySelectorAll('.review-dot').forEach(function(btn){
      btn.addEventListener('click', function(){ onClick(parseInt(btn.dataset.i, 10)); });
    });
  }

  function slideTransition(elId, cb){
    var el = document.getElementById(elId);
    el.classList.add('sliding');
    setTimeout(function(){ cb(); el.classList.remove('sliding'); }, 320);
  }

  function renderTP(){
    var r = tpR[tpI];
    var starsEl = document.getElementById('tpStars');
    starsEl.innerHTML = '';
    for(var i = 0; i < 5; i++){
      var s = document.createElement('div');
      s.style.cssText = 'width:22px;height:22px;background:#00b67a;border-radius:3px;display:flex;align-items:center;justify-content:center';
      s.innerHTML = STAR_SVG;
      starsEl.appendChild(s);
    }
    document.getElementById('tpTitle').textContent = r.t;
    document.getElementById('tpText').textContent = r.x;
    document.getElementById('tpAuth').textContent = '— ' + r.n;
    mkDots('tpDots', tpR.length, tpI, function(i){
      tpPause = Date.now() + REVIEW_INTERVAL;
      slideTransition('tpSlide', function(){ tpI = i; renderTP(); });
    });
  }

  function renderWA(){
    var waPages = Math.ceil(waR.length / 2);
    var slice = waR.slice(waI * 2, waI * 2 + 2);
    document.getElementById('waCards').innerHTML = slice.map(function(r){
      return '<div class="review-card"><p style="margin-bottom:10px;">' + r.x + '</p><p class="auth">— ' + r.n + '</p></div>';
    }).join('');
    mkDots('waDots', waPages, waI, function(i){
      waPause = Date.now() + REVIEW_INTERVAL;
      slideTransition('waSlide', function(){ waI = i; renderWA(); });
    });
  }

  function renderG(){
    var gPages = Math.ceil(gR.length / 4);
    var slice = gR.slice(gI * 4, gI * 4 + 4);
    document.getElementById('gCards').innerHTML = slice.map(function(r){
      return '<div class="review-card"><div style="color:var(--accent);font-size:12px;margin-bottom:8px;">★★★★★</div><h4>' + r.n + '</h4><p>' + r.x + '</p></div>';
    }).join('');
    mkDots('gDots', gPages, gI, function(i){
      gPause = Date.now() + REVIEW_INTERVAL;
      slideTransition('gSlide', function(){ gI = i; renderG(); });
    });
  }

  renderTP();
  renderWA();
  renderG();

  setInterval(function(){
    if(Date.now() < tpPause) return;
    slideTransition('tpSlide', function(){ tpI = (tpI + 1) % tpR.length; renderTP(); });
  }, REVIEW_INTERVAL);
  setInterval(function(){
    if(Date.now() < waPause) return;
    var waPages = Math.ceil(waR.length / 2);
    slideTransition('waSlide', function(){ waI = (waI + 1) % waPages; renderWA(); });
  }, REVIEW_INTERVAL + 600);
  setInterval(function(){
    if(Date.now() < gPause) return;
    var gPages = Math.ceil(gR.length / 4);
    slideTransition('gSlide', function(){ gI = (gI + 1) % gPages; renderG(); });
  }, REVIEW_INTERVAL + 1200);

});
// How it works: auto-advancing, clickable step flow
document.addEventListener('DOMContentLoaded', function(){
  var flow = document.getElementById('stepsFlow');
  if(!flow) return;
  var steps = flow.querySelectorAll('.step-item');
  var current = 0;
  var timer = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(i){
    steps.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
    current = i;
  }

  function startAuto(){
    if(reduced) return;
    stopAuto();
    timer = setInterval(function(){
      setActive((current + 1) % steps.length);
    }, 2600);
  }

  function stopAuto(){
    if(timer){ clearInterval(timer); timer = null; }
  }

  steps.forEach(function(step, idx){
    step.addEventListener('click', function(){
      setActive(idx);
      startAuto(); // restart the cycle after a manual pick
    });
    step.addEventListener('mouseenter', stopAuto);
    step.addEventListener('mouseleave', startAuto);
  });

  startAuto();
});

// Scroll-to-top button
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('scrollTop');
  if(!btn) return;
  window.addEventListener('scroll', function(){
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
