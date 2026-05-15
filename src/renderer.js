var PRODUCTS = [
  { slug: 'et-2980u', name: 'ET-2980U' }
];

function getRoute() {
  var path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  var params = new URLSearchParams(window.location.search);
  return { path: path || '', expanded: params.get('expand') === 'all' || params.get('expanded') === 'all' };
}

function route() {
  var r = getRoute();
  var app = document.getElementById('app');

  if (!r.path) {
    app.innerHTML = '<div style="padding:40px;font-family:sans-serif;font-size:14px">' +
      PRODUCTS.map(function(p) {
        return '<a href="/' + p.slug + '">' + p.name + '</a>';
      }).join(' | ') + '</div>';
    return;
  }

  app.innerHTML = '<div style="padding:40px;text-align:center;color:#999;font-family:sans-serif">Loading…</div>';
  loadProduct(r.path, r.expanded);
}

function loadProduct(slug, expanded) {
  fetch('/data/' + slug + '.json')
    .then(function(r) { if (!r.ok) throw new Error('Not found'); return r.json(); })
    .then(function(data) { renderProduct(data, expanded); })
    .catch(function(err) {
      document.getElementById('app').innerHTML =
        '<div style="padding:40px;text-align:center;color:#c00;font-family:sans-serif">' + err.message + '</div>';
    });
}

function renderProduct(data, expanded) {
  var cls = 'ccs-cc-inline ccs-cc-inline-eps ccs-cc-lang-enusa ccs-cc-lightbox-disabled ccs-cc-block-inline';
  if (expanded) cls += ' preview-expanded';

  var html = '<div class="' + cls + '">';
  html += '<div class="ccs-clear"></div>';
  html += renderHero(data.hero);
  for (var i = 0; i < data.carousels.length; i++) {
    html += renderCarouselSection(data.carousels[i], expanded);
  }
  html += renderHotspotsSection(data.hotspots, expanded);
  html += renderDisclaimersSection(data.disclaimers);
  html += '</div>';

  document.getElementById('app').innerHTML = html;
  document.title = data.product.name + ' — 1WS Preview';

  initElementQueries();

  if (!expanded) {
    initCarousels();
    initHotspots();
  }
}

function renderHero(hero) {
  return '<div class="ccs-cc-inline-section ccs-cc-inline-features" data-display-mode="noheader">' +
    '<div class="ccs-cc-inline-features-block ccs-cc-inline-overlay ccs-cc-aspect-ratio" data-background="image" style="--ratio:' + hero.ratio + '">' +
      '<div class="ccs-cc-inline-feature-background-mobile">' +
        '<img src="' + hero.image + '" alt="' + hero.alt + '"/>' +
      '</div>' +
      '<div class="ccs-cc-inline-feature-background" style="background-color:#ffffff; padding-top:' + hero.paddingTop + '; background-image:url(\'' + hero.image + '\'); background-size:cover; background-repeat:no-repeat; background-position:' + hero.bgPosition + '; background-attachment:scroll"></div>' +
      '<div class="ccs-cc-inline-overlay-outer">' +
        '<div class="ccs-cc-inline-overlay-inner ccs-cc-inline-feature" data-type="" data-desktop-media="false" data-text-row-position="center" data-text-column-position="left" data-media-row-position="center" data-media-column-position="right" data-text-width-unlimited="false" data-media-size-unlimited="false">' +
          '<div class="ccs-cc-inline-feature-content ccs-cc-inline-feature-media-container"></div>' +
          '<div class="ccs-cc-inline-feature-content ccs-cc-inline-feature-description-container" style="width:45%">' +
            '<div class="ccs-cc-inline-feature-content ccs-cc-inline-feature-description"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderSlide(slide) {
  return '<div class="ccs-cc-inline-features-block ccs-cc-inline-overlay ccs-cc-aspect-ratio" data-background="image" style="--ratio:' + slide.ratio + '">' +
    '<div class="ccs-cc-inline-feature-background-mobile">' +
      '<img src="' + slide.image + '" alt="' + (slide.alt || '') + '"/>' +
    '</div>' +
    '<div class="ccs-cc-inline-feature-background" style="background-color:#ffffff; padding-top:' + slide.paddingTop + '; background-image:url(\'' + slide.image + '\'); background-size:cover; background-repeat:no-repeat; background-position:' + slide.bgPosition + '; background-attachment:scroll"></div>' +
    '<div class="ccs-cc-inline-overlay-outer">' +
      '<div class="ccs-cc-inline-overlay-inner ccs-cc-inline-feature" data-type="text" data-desktop-media="false" data-text-row-position="center" data-text-column-position="left" data-media-row-position="center" data-media-column-position="right" data-text-width-unlimited="true" data-media-size-unlimited="false">' +
        '<div class="ccs-cc-inline-feature-content ccs-cc-inline-feature-media-container"></div>' +
        '<div class="ccs-cc-inline-feature-content ccs-cc-inline-feature-description-container" style="width:100%">' +
          '<div class="ccs-cc-inline-feature-content ccs-cc-inline-feature-description" style="color:#ffffff; background-color:rgba(0, 0, 0, 0.7);">' +
            '<span style="font-size: 1.44em;"><b>' + slide.heading + '</b></span>' +
            '<div><br></div><div>' + slide.body + '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderCarouselSection(carousel, expanded) {
  var slidesHtml = '';
  for (var i = 0; i < carousel.slides.length; i++) {
    slidesHtml += renderSlide(carousel.slides[i]);
  }

  if (expanded) {
    return '<div class="ccs-cc-inline-section ccs-cc-inline-features" data-display-mode="noheader">' +
      slidesHtml +
    '</div>';
  }

  return '<div class="ccs-cc-inline-section ccs-cc-inline-features" data-display-mode="noheader">' +
    '<div class="ccs-cc-inline-features-block ccs-cc-fc ccs-cc-inline-noautoplay" data-carousel-id="' + carousel.id + '">' +
      '<div class="ccs-cc-fc-items" tabindex="0">' +
        slidesHtml +
      '</div>' +
      '<div class="ccs-cc-fc-custom-controls"></div>' +
      '<div class="ccs-cc-fc-arrows">' +
        '<a class="ccs-cc-fc-arrow ccs-slick-arrow ccs-slick-prev" href="javascript:;" role="button" aria-label="show previous slide"><span></span></a>' +
        '<a class="ccs-cc-fc-arrow ccs-slick-arrow ccs-slick-next" href="javascript:;" role="button" aria-label="show next slide"><span></span></a>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function getExpandedPopupStyle(mx, my) {
  /* Position the popup card near its marker but clamped within the image.
     Popup is ~23% of container width (280px in a ~1200px container).
     We leave ~2% padding from edges. */
  var popupW = 0.24;  /* popup width as fraction of container */
  var pad = 0.02;     /* edge padding */
  var markerGap = 0.03; /* gap between marker and popup edge */

  /* Horizontal: try to center on marker, clamp to [pad, 1-pad-popupW] */
  var left = mx - popupW / 2;
  left = Math.max(pad, Math.min(left, 1 - pad - popupW));

  /* Vertical: place below marker if there's room, otherwise above.
     Estimate popup height as ~35% of container height. */
  var popupH = 0.40;
  var top;
  if (my + markerGap + popupH <= 1 - pad) {
    top = my + markerGap;
  } else {
    top = my - markerGap - popupH;
    top = Math.max(pad, top);
  }

  return 'left:' + (left * 100).toFixed(1) + '%; top:' + (top * 100).toFixed(1) + '%';
}

function renderHotspotsSection(hotspots, expanded) {
  var pointsData = JSON.stringify(hotspots.points).replace(/'/g, '&#39;');

  if (!expanded) {
    return '<div class="ccs-cc-inline-section ccs-cc-inline-hotspots" data-display-mode="noheader">' +
      '<div class="ccs-hotspots-container">' +
        '<img loading="lazy" src="' + hotspots.compositeImage + '" alt="' + hotspots.compositeAlt + '" class="ccs-hotspots-image" data-hotspots-json=\'' + pointsData + '\' />' +
      '</div>' +
    '</div>';
  }

  /* Expanded view: render composite image once per hotspot with that hotspot's
     popup "forced open" — the interactive state rendered statically. Shows the
     dimmed backdrop, active marker, and floating popup card in position.
     Matches C2's A+ Premium and Hybris expanded preview pattern for Pastel. */
  var html = '';
  for (var i = 0; i < hotspots.points.length; i++) {
    var pt = hotspots.points[i];
    html += '<div class="ccs-cc-inline-section ccs-cc-inline-hotspots" data-display-mode="noheader">' +
      '<div class="ccs-hotspots-container ccs-hotspots-expanded-instance">' +
        '<div class="ccs-hotspots ccs-hotspots-default" style="position:relative; display:inline-block; width:100%">' +
          /* Dimmed backdrop overlay */
          '<div class="ccs-hotspot-expanded-dim"></div>' +
          /* Composite image */
          '<img loading="lazy" src="' + hotspots.compositeImage + '" alt="' + hotspots.compositeAlt + '" class="ccs-hotspots-image" style="display:block; width:100%" />' +
          /* Active marker */
          '<div class="ccs-hotspots-point ccs-hotspots-point-active" style="position:absolute; left:' + (pt.x * 100) + '%; top:' + (pt.y * 100) + '%; transform:translate(-50%,-50%); pointer-events:none; z-index:3"></div>' +
          /* Static popup card, clamped within the composite image bounds.
             The popup is ~23% wide (280px / ~1200px). Position it near the marker
             but clamp so it stays fully inside the image area. */
          '<div class="ccs-hotspot-expanded-popup" style="' + getExpandedPopupStyle(pt.x, pt.y) + '">' +
            '<div class="ccs-hotspots-tooltip ccs-hotspots-tooltip-medium">' +
              '<div class="qtip-content"><div>' +
                (pt.popupImage ? '<img src="' + pt.popupImage + '" alt="' + (pt.popupAlt || pt.heading) + '" />' : '') +
                '<h4>' + pt.heading + '</h4>' +
                '<p>' + pt.body + '</p>' +
              '</div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  return html;
}

function renderDisclaimersSection(disclaimers) {
  return '<div class="ccs-cc-inline-section ccs-cc-inline-features" data-display-mode="noheader">' +
    '<div class="ccs-cc-inline-features-block ccs-cc-inline-single-feature">' +
      '<div class="ccs-cc-inline-feature" data-type="text">' +
        '<div class="ccs-cc-inline-feature-content ccs-cc-inline-feature-description">' +
          disclaimers +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function initElementQueries() {
  var el = document.querySelector('.ccs-cc-inline');
  if (!el) return;

  var breakpoints = [570, 680, 790, 900];

  function update() {
    var w = el.offsetWidth;
    var vals = [];
    for (var i = 0; i < breakpoints.length; i++) {
      if (w <= breakpoints[i]) vals.push(breakpoints[i] + 'px');
    }
    el.setAttribute('max-width', vals.join(' '));
  }

  if (window.ResizeObserver) {
    new ResizeObserver(update).observe(el);
  } else {
    window.addEventListener('resize', update);
  }
  update();
}

window.addEventListener('popstate', route);
route();
