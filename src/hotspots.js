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

  /* Wrap image in positioned container */
  var wrapper = document.createElement('div');
  wrapper.className = 'ccs-hotspots ccs-hotspots-default';
  img.parentNode.insertBefore(wrapper, img);
  wrapper.appendChild(img);

  /* Add markers */
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

  /* Backdrop — inside the wrapper so it overlays just the image */
  var backdrop = document.createElement('div');
  backdrop.className = 'ccs-hotspot-overlay-backdrop';
  wrapper.appendChild(backdrop);

  /* Tooltip container — inside the wrapper, absolutely positioned */
  var tooltipContainer = document.createElement('div');
  tooltipContainer.className = 'ccs-hotspots-tooltips';
  tooltipContainer.style.display = 'none';
  wrapper.appendChild(tooltipContainer);

  var activePoint = null;

  function positionTooltip(tooltipEl, markerX, markerY) {
    /* Position tooltip near the marker, within the wrapper bounds.
       Mimics 1WS qTip: tooltip appears beside the marker on the side
       with more room. Uses percentage-based positioning. */
    var tooltipW = 0.35; /* approximate tooltip width as fraction of wrapper */
    var gap = 0.02;

    /* Horizontal: place on side with more room */
    var left;
    if (markerX < 0.5) {
      left = markerX + gap;
    } else {
      left = markerX - gap - tooltipW;
    }
    /* Clamp to keep within bounds */
    left = Math.max(0.02, Math.min(left, 1 - tooltipW - 0.02));

    /* Vertical: center on marker, clamp to bounds */
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = (left * 100) + '%';
    tooltipEl.style.width = (tooltipW * 100) + '%';
    tooltipEl.style.maxWidth = '450px';

    /* Vertically center near marker — use top with transform */
    tooltipEl.style.top = (markerY * 100) + '%';
    tooltipEl.style.transform = 'translateY(-50%)';

    /* After render, check if it overflows and adjust */
    requestAnimationFrame(function() {
      var wrapperRect = wrapper.getBoundingClientRect();
      var tipRect = tooltipEl.getBoundingClientRect();

      /* Clamp vertical to stay within wrapper */
      if (tipRect.top < wrapperRect.top) {
        tooltipEl.style.top = '8px';
        tooltipEl.style.transform = 'none';
      } else if (tipRect.bottom > wrapperRect.bottom) {
        tooltipEl.style.top = 'auto';
        tooltipEl.style.bottom = '8px';
        tooltipEl.style.transform = 'none';
      }
    });
  }

  function openTooltip(index) {
    var pt = points[index];
    closeTooltip();
    activePoint = index;

    /* Highlight active marker */
    var allMarkers = wrapper.querySelectorAll('.ccs-hotspots-point');
    for (var m = 0; m < allMarkers.length; m++) {
      allMarkers[m].classList.toggle('ccs-hotspots-point-active', m === index);
      allMarkers[m].style.zIndex = (m === index) ? '8' : '';
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

    /* Position the tooltip near the marker */
    positionTooltip(tooltipContainer, pt.x, pt.y);

    backdrop.classList.add('active');

    close.addEventListener('click', function(e) {
      e.stopPropagation();
      closeTooltip();
    });
    tooltip.focus();
  }

  function closeTooltip() {
    tooltipContainer.innerHTML = '';
    tooltipContainer.style.display = 'none';
    backdrop.classList.remove('active');
    activePoint = null;
    var allMarkers = wrapper.querySelectorAll('.ccs-hotspots-point');
    for (var m = 0; m < allMarkers.length; m++) {
      allMarkers[m].classList.remove('ccs-hotspots-point-active');
      allMarkers[m].style.zIndex = '';
    }
  }

  wrapper.addEventListener('click', function(e) {
    var marker = e.target.closest('.ccs-hotspots-point');
    if (!marker) return;
    e.stopPropagation();
    var idx = parseInt(marker.getAttribute('data-point-index'), 10);
    if (activePoint === idx) {
      closeTooltip();
    } else {
      openTooltip(idx);
    }
  });

  backdrop.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTooltip();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activePoint !== null) closeTooltip();
  });
}
