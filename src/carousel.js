function initCarousels() {
  var carousels = document.querySelectorAll('.ccs-cc-fc');
  for (var c = 0; c < carousels.length; c++) {
    initOneCarousel(carousels[c]);
  }
}

function initOneCarousel(fc) {
  var itemsContainer = fc.querySelector('.ccs-cc-fc-items');
  if (!itemsContainer) return;

  var slidesArr = Array.prototype.slice.call(
    itemsContainer.querySelectorAll(':scope > .ccs-cc-inline-features-block')
  );
  var total = slidesArr.length;
  if (total === 0) return;

  var current = 0;
  var autoTimer = null;
  var SPEED = 5000;
  var autoplayEnabled = !fc.classList.contains('ccs-cc-inline-noautoplay');

  fc.style.position = 'relative';

  var list = document.createElement('div');
  list.className = 'ccs-slick-list ccs-slick-initialized';
  list.style.overflow = 'hidden';
  list.style.margin = '0';

  var track = document.createElement('div');
  track.className = 'ccs-slick-track';
  track.style.display = 'flex';
  track.style.transition = 'transform 0.5s ease';

  for (var i = 0; i < total; i++) {
    var slideWrapper = document.createElement('div');
    slideWrapper.className = 'ccs-slick-slide';
    slideWrapper.setAttribute('data-slide-index', i);
    slideWrapper.style.overflow = 'hidden';
    slideWrapper.appendChild(slidesArr[i]);
    track.appendChild(slideWrapper);
  }

  list.appendChild(track);
  itemsContainer.appendChild(list);

  function setSizes() {
    var containerWidth = fc.offsetWidth;
    if (containerWidth === 0) return;
    list.style.width = containerWidth + 'px';
    track.style.width = (containerWidth * total) + 'px';
    var allSlides = track.querySelectorAll('.ccs-slick-slide');
    for (var s = 0; s < allSlides.length; s++) {
      allSlides[s].style.width = containerWidth + 'px';
      allSlides[s].style.flex = '0 0 ' + containerWidth + 'px';
    }
  }

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      setSizes();
      goTo(0);
    });
  });
  window.addEventListener('resize', setSizes);

  var controlsContainer = fc.querySelector('.ccs-cc-fc-custom-controls');
  var dotsUl = document.createElement('ul');
  dotsUl.className = 'ccs-slick-dots';
  for (var d = 0; d < total; d++) {
    var li = document.createElement('li');
    if (d === 0) li.className = 'ccs-slick-active';
    var a = document.createElement('a');
    a.href = 'javascript:;';
    a.setAttribute('role', 'button');
    a.setAttribute('data-slide-index', d);
    /* No visible text — 1WS dots are styled entirely via CSS background */
    li.appendChild(a);
    dotsUl.appendChild(li);
  }
  controlsContainer.appendChild(dotsUl);

  function goTo(index) {
    current = ((index % total) + total) % total;
    var slideWidth = track.querySelector('.ccs-slick-slide').offsetWidth;
    track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';

    var dotItems = dotsUl.querySelectorAll('li');
    for (var i = 0; i < dotItems.length; i++) {
      dotItems[i].className = (i === current) ? 'ccs-slick-active' : '';
    }
  }

  function startAuto() {
    if (!autoplayEnabled) return;
    stopAuto();
    autoTimer = setInterval(function() { goTo(current + 1); }, SPEED);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  /* Hover-pause: pause auto-advance on mouseenter/focusin, resume on
     mouseleave/focusout. Matches 1WS Slick behavior from inline.min.js. */
  if (autoplayEnabled) {
    fc.addEventListener('mouseenter', function() { stopAuto(); });
    fc.addEventListener('focusin', function() { stopAuto(); });
    fc.addEventListener('mouseleave', function() { startAuto(); });
    fc.addEventListener('focusout', function() { startAuto(); });
  }

  dotsUl.addEventListener('click', function(e) {
    var target = e.target.closest('[data-slide-index]');
    if (!target) {
      var li = e.target.closest('li');
      if (!li) return;
      var lis = dotsUl.querySelectorAll('li');
      for (var i = 0; i < lis.length; i++) {
        if (lis[i] === li) { goTo(i); startAuto(); return; }
      }
      return;
    }
    goTo(parseInt(target.getAttribute('data-slide-index'), 10));
    startAuto();
  });

  var prevBtn = fc.querySelector('.ccs-cc-fc-arrows .ccs-slick-prev');
  var nextBtn = fc.querySelector('.ccs-cc-fc-arrows .ccs-slick-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      goTo(current - 1);
      startAuto();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      goTo(current + 1);
      startAuto();
    });
  }

  var touchStartX = 0;
  fc.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  fc.addEventListener('touchend', function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
    startAuto();
  }, { passive: true });

  goTo(0);
  startAuto();
}
