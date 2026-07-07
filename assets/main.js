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

  // Animated counters: <span data-count-to="20000" data-count-suffix="+">
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
  if(!tabs.length) return;

  function applyDevices(devices){
    priceEls.forEach(function(el){
      var period = el.getAttribute('data-period');
      var key = devices + '-' + period;
      if(PRICES[key]){ el.textContent = PRICES[key]; }
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
