function initHotspots() {
  var containers = document.querySelectorAll('.ccs-hotspots-container');

  for (var c = 0; c < containers.length; c++) {
    initOneHotspot(containers[c]);
  }
}

function initOneHotspot(container) {
  var img = container.querySelector('.ccs-hotspots-image');
  if (!img) return;

  var jsonStr = img.getAttribute('data-hotspots-json');
  if (!jsonStr) return;

  var points;
  try { points = JSON.parse(jsonStr); } catch(e) { return; }

  var wrapper = document.createElement('div');
  wrapper.className = 'ccs-hotspots ccs-hotspots-default';
  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var marker = document.createElement('button');
    marker.className = 'ccs-hotspots-point';
    marker.setAttribute('type', 'button');
    marker.setAttribute('aria-label', pt.heading);
    marker.setAttribute('data-point-index', i);
    marker.style.left = (pt.x * 100) + '%';
    marker.style.top = (pt.y * 100) + '%';
    marker.style.transform = 'translate(-50%, -50%)';
    wrapper.appendChild(marker);
  }

  var tooltipContainer = document.createElement('div');
  tooltipContainer.className = 'ccs-hotspots-tooltips';
  container.appendChild(tooltipContainer);

  var backdrop = document.createElement('div');
  backdrop.className = 'ccs-hotspot-overlay-backdrop';
  container.appendChild(backdrop);

  var activePoint = null;

  function openTooltip(index) {
    var pt = points[index];
    closeTooltip();
    activePoint = index;

    var allMarkers = wrapper.querySelectorAll('.ccs-hotspots-point');
    for (var m = 0; m < allMarkers.length; m++) {
      allMarkers[m].classList.toggle('ccs-hotspots-point-active', m === index);
    }

    var tooltip = document.createElement('div');
    tooltip.className = 'ccs-hotspots-tooltip ccs-hotspots-tooltip-medium';
    tooltip.setAttribute('tabindex', '-1');

    var close = document.createElement('button');
    close.className = 'qtip-close';
    close.setAttribute('type', 'button');
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" fill="none"/></svg>';

    var content = document.createElement('div');
    content.className = 'qtip-content';
    var inner = document.createElement('div');

    if (pt.popupImage) {
      var popupImg = document.createElement('img');
      popupImg.src = pt.popupImage;
      popupImg.alt = pt.popupAlt || pt.heading;
      inner.appendChild(popupImg);
    }

    var h4 = document.createElement('h4');
    h4.innerHTML = pt.heading;
    inner.appendChild(h4);

    var desc = document.createElement('p');
    desc.innerHTML = pt.body;
    inner.appendChild(desc);

    content.appendChild(inner);
    tooltip.appendChild(close);
    tooltip.appendChild(content);
    tooltipContainer.innerHTML = '';
    tooltipContainer.appendChild(tooltip);
    tooltipContainer.style.display = '';
    backdrop.classList.add('active');

    close.addEventListener('click', closeTooltip);
    tooltip.focus();
  }

  function closeTooltip() {
    tooltipContainer.innerHTML = '';
    backdrop.classList.remove('active');
    activePoint = null;
    var allMarkers = wrapper.querySelectorAll('.ccs-hotspots-point');
    for (var m = 0; m < allMarkers.length; m++) {
      allMarkers[m].classList.remove('ccs-hotspots-point-active');
    }
  }

  wrapper.addEventListener('click', function(e) {
    var marker = e.target.closest('.ccs-hotspots-point');
    if (!marker) return;
    var idx = parseInt(marker.getAttribute('data-point-index'), 10);
    if (activePoint === idx) {
      closeTooltip();
    } else {
      openTooltip(idx);
    }
  });

  backdrop.addEventListener('click', closeTooltip);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activePoint !== null) closeTooltip();
  });
}
