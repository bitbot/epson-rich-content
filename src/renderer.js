const PRODUCTS = [
  { slug: 'et-2980u', name: 'Epson EcoTank® ET-2980U', segment: 'Home' }
];

function getRoute() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const params = new URLSearchParams(window.location.search);
  const expanded = params.get('expanded') === 'all';
  return { path: path || '', expanded };
}

function navigate(href, e) {
  if (e) e.preventDefault();
  window.history.pushState(null, '', href);
  route();
}

function route() {
  const { path, expanded } = getRoute();
  const indexEl = document.getElementById('index-page');
  const productEl = document.getElementById('product-page');

  if (!path) {
    indexEl.style.display = '';
    productEl.style.display = 'none';
    renderIndex();
  } else {
    indexEl.style.display = 'none';
    productEl.style.display = '';
    loadProduct(path, expanded);
  }
}

function renderIndex() {
  const list = document.getElementById('product-list');
  list.innerHTML = PRODUCTS.map(p => `
    <a href="/${p.slug}" class="product-card" onclick="navigate('/${p.slug}', event)">
      <h2>${p.name}</h2>
      <div class="sku">${p.slug.toUpperCase()}</div>
      <span class="segment">${p.segment}</span>
    </a>
  `).join('');
}

async function loadProduct(slug, expanded) {
  const container = document.getElementById('content-container');
  container.innerHTML = '<p style="padding:40px;text-align:center;color:#999">Loading…</p>';

  const toggleInt = document.getElementById('toggle-interactive');
  const toggleExp = document.getElementById('toggle-expanded');
  toggleInt.className = expanded ? '' : 'active';
  toggleExp.className = expanded ? 'active' : '';
  toggleInt.href = `/${slug}`;
  toggleExp.href = `/${slug}?expanded=all`;
  toggleInt.onclick = (e) => navigate(`/${slug}`, e);
  toggleExp.onclick = (e) => navigate(`/${slug}?expanded=all`, e);

  try {
    const resp = await fetch(`/data/${slug}.json`);
    if (!resp.ok) throw new Error('Product not found');
    const data = await resp.json();
    document.title = `${data.product.name} — 1WS Preview`;
    renderProduct(container, data, expanded);
  } catch (err) {
    container.innerHTML = `<p style="padding:40px;text-align:center;color:#c00">${err.message}</p>`;
  }
}

function renderProduct(container, data, expanded) {
  let html = '';
  html += renderHero(data.hero);
  for (const carousel of data.carousels) {
    html += renderCarousel(carousel, expanded);
  }
  html += renderHotspots(data.hotspots, expanded);
  html += renderDisclaimers(data.disclaimers);
  container.innerHTML = html;

  if (!expanded) {
    initCarousels();
    initHotspots();
  }
}

function renderHero(hero) {
  return `
    <section class="hero">
      <picture>
        <source media="(max-width: 768px)" srcset="${hero.imageMobile}">
        <img src="${hero.image}" alt="${hero.alt}">
      </picture>
      <div class="hero-overlay">
        <h1 class="hero-headline">${hero.headline}</h1>
        <p class="hero-subheadline">${hero.subheadline}</p>
      </div>
    </section>`;
}

function renderCarousel(carousel, expanded) {
  if (expanded) {
    const slides = carousel.slides.map(s => `
      <div class="carousel-slide">
        <img src="${s.image}" alt="${s.alt}">
        <div class="carousel-card">
          <h3>${s.heading}</h3>
          <p>${s.body}</p>
        </div>
      </div>`).join('');
    return `<section class="carousel-section expanded-slides" data-carousel="${carousel.id}">${slides}</section>`;
  }

  const slides = carousel.slides.map(s => `
    <div class="carousel-slide">
      <img src="${s.image}" alt="${s.alt}">
      <div class="carousel-card">
        <h3>${s.heading}</h3>
        <p>${s.body}</p>
      </div>
    </div>`).join('');

  const dots = carousel.slides.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`
  ).join('');

  return `
    <section class="carousel-section" data-carousel="${carousel.id}">
      <div class="carousel-viewport">
        <div class="carousel-track">${slides}</div>
      </div>
      <div class="carousel-dots">${dots}</div>
    </section>`;
}

function renderHotspots(hotspots, expanded) {
  const quadrants = hotspots.images.map((img, qi) => {
    const markers = hotspots.points
      .map((pt, pi) => {
        if (pt.imageIndex !== qi) return '';
        return `<button class="hotspot-marker" data-heading="${pt.heading.replace(/"/g, '&quot;')}" data-body="${pt.body.replace(/"/g, '&quot;')}" style="left:${pt.x}%;top:${pt.y}%">+</button>`;
      }).join('');
    return `
      <div class="hotspot-quadrant">
        <img src="${img.src}" alt="${img.alt}">
        ${expanded ? '' : markers}
      </div>`;
  }).join('');

  let details = '';
  if (expanded) {
    details = '<div class="hotspot-details">' + hotspots.points.map(pt => `
      <div class="hotspot-detail-item">
        <h4>${pt.heading}</h4>
        <p>${pt.body}</p>
      </div>`).join('') + '</div>';
  }

  const popup = expanded ? '' : `
    <div class="hotspot-backdrop" id="hotspot-backdrop"></div>
    <div class="hotspot-popup" id="hotspot-popup">
      <button class="hotspot-popup-close" id="hotspot-close">&times;</button>
      <h4 id="hotspot-title"></h4>
      <p id="hotspot-body"></p>
    </div>`;

  return `
    <section class="hotspot-section">
      <div class="hotspot-grid">${quadrants}</div>
      ${details}
    </section>
    ${popup}`;
}

function renderDisclaimers(disclaimers) {
  return `<div class="disclaimers">${disclaimers.map(d => `<p>${d}</p>`).join('')}</div>`;
}

window.addEventListener('popstate', route);
window.navigate = navigate;
route();
