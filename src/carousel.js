function initCarousels() {
  document.querySelectorAll('.carousel-section:not(.expanded-slides)').forEach(section => {
    const track = section.querySelector('.carousel-track');
    const dots = section.querySelectorAll('.carousel-dot');
    if (!track || dots.length === 0) return;

    let current = 0;
    let autoTimer = null;
    const total = dots.length;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index, 10));
        startAuto();
      });
    });

    let touchStartX = 0;
    section.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });

    section.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(current + (diff > 0 ? 1 : -1));
      }
      startAuto();
    }, { passive: true });

    startAuto();
  });
}
