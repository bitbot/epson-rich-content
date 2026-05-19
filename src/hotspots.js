/*
 * Hotspot initialization — uses jQuery + qTip2 (same libraries as 1WS).
 *
 * Reads hotspot data from data-hotspots-json on the composite image,
 * wraps it in the standard 1WS container structure, creates markers,
 * and binds qTip tooltips with the same options 1WS uses.
 *
 * This replaces the custom tooltip positioning code that previously
 * tried to replicate qTip behavior in vanilla JS.
 */

var HOTSPOT_CLASSES = {
  root:        'ccs-hotspots',
  iconSet:     'ccs-hotspots-default',
  point:       'ccs-hotspots-point',
  pointActive: 'ccs-hotspots-point-active',
  tooltips:    'ccs-hotspots-tooltips',
  tooltip:     'ccs-hotspots-tooltip',
  pointSize:   32
};

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
  try { points = JSON.parse(jsonStr); } catch (e) { return; }
  if (!points.length) return;

  var $img = $(img);
  var $container = $(container);

  /* Create the tooltips container (1WS appends to body; we scope to container
     so expanded view instances stay independent) */
  var $tooltipsContainer = $('<div>').addClass(HOTSPOT_CLASSES.tooltips);
  $container.append($tooltipsContainer);

  /* Wrap image in the standard 1WS hotspot root */
  $img.removeAttr('data-hotspots-json')
      .wrap($('<div>').addClass(HOTSPOT_CLASSES.root)
                      .addClass(HOTSPOT_CLASSES.iconSet));

  /* Wait for image to be loaded so dimensions are known for positioning */
  function setup() {
    points.forEach(function (pt) {
      /* Determine tooltip position relative to marker (1WS logic) */
      var position = pt.position || 'top';
      var posConfig = getPositionConfig(position);

      /* Build tooltip content */
      var $content = $('<div>');
      if (pt.popupImage) {
        $content.append($('<img>', { src: pt.popupImage, alt: pt.popupAlt || pt.heading }));
      }
      if (pt.heading) {
        $content.append($('<h4>').html(pt.heading));
      }
      if (pt.body) {
        $content.append($('<div>').html(pt.body));
      }

      /* Create marker and bind qTip — mirrors 1WS de() function */
      $('<div>')
        .addClass(HOTSPOT_CLASSES.point)
        .attr('tabindex', 0)
        .css('top',  'calc(' + (pt.y * 100) + '% - ' + (HOTSPOT_CLASSES.pointSize / 2) + 'px)')
        .css('left', 'calc(' + (pt.x * 100) + '% - ' + (HOTSPOT_CLASSES.pointSize / 2) + 'px)')
        .insertBefore($img)
        .qtip({
          prerender: true,
          content: {
            text: $content,
            button: 'Close'
          },
          show: {
            event: 'click'
          },
          hide: {
            fixed: true,
            delay: 0,
            event: 'unfocus'
          },
          style: {
            classes: 'qtip-light qtip-shadow ' + HOTSPOT_CLASSES.tooltip + ' ' +
                     HOTSPOT_CLASSES.tooltip + '-' + (pt.size || 'medium')
          },
          position: {
            my: posConfig.my,
            at: posConfig.at,
            effect: false,
            container: $tooltipsContainer,
            viewport: $(window),
            adjust: {
              method: posConfig.method
            }
          },
          events: {
            show: function (event, api) {
              /* Mark active */
              api.elements.target.addClass(HOTSPOT_CLASSES.pointActive);
            },
            hide: function (event, api) {
              /* Remove active */
              api.elements.target.removeClass(HOTSPOT_CLASSES.pointActive);
            },
            render: function (event, api) {
              /* Keyboard: Escape closes and returns focus to marker */
              api.tooltip.attr('tabindex', 0).on('keydown', function (e) {
                if (e.keyCode === 27) {
                  api.hide();
                  api.elements.target.focus();
                  e.stopPropagation();
                }
              });
            }
          }
        });
    });
  }

  /* If image already loaded, init immediately; otherwise wait */
  if (img.complete && img.naturalWidth > 0) {
    setup();
  } else {
    $img.one('load', setup);
  }
}

/* Position config — matches 1WS position logic in de() */
function getPositionConfig(position) {
  switch (position) {
    case 'left':
      return { my: 'center right', at: 'center left', method: 'flip shift' };
    case 'right':
      return { my: 'center left', at: 'center right', method: 'flip shift' };
    case 'bottom':
      return { my: 'top center', at: 'bottom center', method: 'shift flip' };
    default: /* top */
      return { my: 'bottom center', at: 'top center', method: 'shift flip' };
  }
}
