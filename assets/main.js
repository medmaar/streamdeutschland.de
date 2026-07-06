window.addEventListener('scroll', function(){
  var h = document.querySelector('header');
  if(!h) return;
  if(window.scrollY > 40){ h.classList.add('scrolled'); }
  else { h.classList.remove('scrolled'); }
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
