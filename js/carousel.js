/* Side-scrolling carousel — minimalist single-image slider. Mirrors the
   pattern in flowing-menu.js / staggered-menu.js: an IIFE exposing a
   single window.initSideCarousel(viewport, items, options) entry point.
   Items are { src, alt } — an empty src renders a placeholder tile.
   Navigation is button-driven (prev/next) plus autoplay; scroll-snap
   just settles each index into place. */

(function () {
  function buildItem(item) {
    const el = document.createElement('figure');
    el.className = 'carousel-item';

    const thumb = document.createElement('div');
    thumb.className = 'carousel-thumb';

    if (item.src) {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      img.loading = 'lazy';
      thumb.appendChild(img);
    } else {
      thumb.classList.add('carousel-thumb-placeholder');
      const label = document.createElement('span');
      label.className = 'placeholder-label';
      label.textContent = 'Image coming soon';
      thumb.appendChild(label);
    }

    el.appendChild(thumb);
    return el;
  }

  window.initSideCarousel = function initSideCarousel(viewport, items, options) {
    if (!viewport || !items || !items.length) return;
    const opts = options || {};
    const autoplayDelay = opts.autoplayDelay || 5000;
    const slideCount = items.length;
    // With >1 slide, pad a clone of the last item before the first and a
    // clone of the first item after the last, so wrapping past either end
    // scrolls one slide into a look-alike clone instead of animating back
    // across the whole track — then snaps instantly to the real slide.
    const loop = slideCount > 1;

    const renderItems = loop ? [items[slideCount - 1]].concat(items, [items[0]]) : items;
    renderItems.forEach((item) => viewport.appendChild(buildItem(item)));

    let index = loop ? 1 : 0;
    let autoplayTimer = null;
    let settleTimer = null;

    function scrollToIndex(i, smooth) {
      viewport.scrollTo({ left: i * viewport.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    }

    scrollToIndex(index, false);

    // If index is currently sitting on a clone (because a prior transition's
    // async settle hasn't run yet — e.g. clicks fired faster than the
    // scroll-end debounce), resolve it to the real slide right now, instantly,
    // before anything else moves. Without this, index and the physical scroll
    // position can drift apart after a couple of quick clicks, the browser
    // clamps scrollLeft at the track's edge, and the carousel appears stuck.
    function collapse() {
      if (!loop) return;
      if (index === 0) {
        index = slideCount;
        scrollToIndex(index, false);
      } else if (index === slideCount + 1) {
        index = 1;
        scrollToIndex(index, false);
      }
    }

    function settleLoop() {
      collapse();
    }

    function goTo(delta) {
      collapse();
      index = loop ? index + delta : (index + delta + slideCount) % slideCount;
      scrollToIndex(index, true);
    }

    function next() { goTo(1); }
    function prev() { goTo(-1); }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (slideCount <= 1) return;
      autoplayTimer = setInterval(next, autoplayDelay);
    }

    if (opts.prevBtn) {
      opts.prevBtn.addEventListener('click', () => {
        prev();
        startAutoplay();
      });
    }

    if (opts.nextBtn) {
      opts.nextBtn.addEventListener('click', () => {
        next();
        startAutoplay();
      });
    }

    viewport.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settleLoop, 120);
    });

    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    window.addEventListener('resize', () => scrollToIndex(index, false));

    startAutoplay();
  };
})();
