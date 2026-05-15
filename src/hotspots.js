function initHotspots() {
  const backdrop = document.getElementById('hotspot-backdrop');
  const popup = document.getElementById('hotspot-popup');
  const closeBtn = document.getElementById('hotspot-close');
  const titleEl = document.getElementById('hotspot-title');
  const bodyEl = document.getElementById('hotspot-body');

  if (!backdrop || !popup) return;

  function open(heading, body) {
    titleEl.textContent = heading;
    bodyEl.textContent = body;
    backdrop.classList.add('visible');
    popup.classList.add('visible');
  }

  function close() {
    backdrop.classList.remove('visible');
    popup.classList.remove('visible');
  }

  document.querySelectorAll('.hotspot-marker').forEach(marker => {
    marker.addEventListener('click', () => {
      open(marker.dataset.heading, marker.dataset.body);
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}
