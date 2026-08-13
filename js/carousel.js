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

    items.forEach((item) => viewport.appendChild(buildItem(item)));

    let index = 0;
    let autoplayTimer = null;

    function goTo(i) {
      index = (i + slideCount) % slideCount;
      viewport.scrollTo({ left: index * viewport.clientWidth, behavior: 'smooth' });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

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

    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    window.addEventListener('resize', () => goTo(index));

    startAutoplay();
  };
})();
