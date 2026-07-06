window.addEventListener('scroll', function(){
  var h = document.querySelector('header');
  if(!h) return;
  if(window.scrollY > 40){ h.classList.add('scrolled'); }
  else { h.classList.remove('scrolled'); }
});
