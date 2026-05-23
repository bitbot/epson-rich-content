/**
 * Image transform function — mirrors 1WS CDN pattern.
 *
 * URL format: /img/<transforms>/<asset-path>
 * Examples:
 *   /img/width(1200)/assets/products/et-2980u/hotspot-composite.jpg
 *   /img/width(400)/assets/products/et-2980u/hotspot-popup-1.jpg
 *   /img/width(800),quality(80)/assets/products/et-2980u/hero.jpg
 *
 * Supported transforms (matches 1WS CDN conventions):
 *   width(N)    — resize to N pixels wide, maintain aspect ratio
 *   height(N)   — resize to N pixels tall, maintain aspect ratio
 *   quality(N)  — JPEG/WebP quality 1-100
 *
 * Falls back to original image if Cloudflare Image Resizing is
 * unavailable (free plan) or if no transforms are specified.
 */
export async function onRequest(context) {
  const { params, request } = context;
  const segments = params.path;

  if (!segments || segments.length < 2) {
    return new Response('Usage: /img/<transforms>/<path>', { status: 400 });
  }

  // First segment is transforms, rest is the asset path
  const transformStr = segments[0];
  const assetPath = '/' + segments.slice(1).join('/');

  // Parse transform string: "width(1200)" or "width(1200),quality(80)"
  const options = {};
  const transformPattern = /(\w+)\((\d+)\)/g;
  let match;
  while ((match = transformPattern.exec(transformStr)) !== null) {
    const [, name, value] = match;
    switch (name) {
      case 'width':  options.width = parseInt(value);   break;
      case 'height': options.height = parseInt(value);  break;
      case 'quality': options.quality = parseInt(value); break;
    }
  }

  // If no valid transforms parsed, pass through
  if (Object.keys(options).length === 0) {
    return context.env.ASSETS.fetch(new URL(assetPath, request.url));
  }

  // Maintain aspect ratio, never upscale
  options.fit = 'scale-down';

  // Build origin URL for the raw asset
  const originUrl = new URL(assetPath, request.url).toString();

  try {
    const response = await fetch(originUrl, {
      cf: { image: options }
    });

    if (response.ok) {
      return response;
    }

    // Resizing unavailable — fall back to original
    return context.env.ASSETS.fetch(new URL(assetPath, request.url));
  } catch (e) {
    return context.env.ASSETS.fetch(new URL(assetPath, request.url));
  }
}
