window.addEventListener('scroll', function(){
  var h = document.querySelector('header');
  if(!h) return;
  if(window.scrollY > 40){ h.classList.add('scrolled'); }
  else { h.classList.remove('scrolled'); }
});

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
