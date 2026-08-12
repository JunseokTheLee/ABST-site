/* PageTransitions — intercepts internal link clicks just long enough for
   the CSS .ptx-out fade (see page-transitions.css) to play before the
   browser actually navigates. The entrance fade needs no JS at all — it's
   a plain CSS animation that runs the instant <main class="ptx-content">
   paints. Mirrors the pattern in staggered-menu.js: an IIFE exposing a
   single window.initPageTransitions() entry point, called from main.js. */

(function () {
  const EXIT_FALLBACK_MS = 300;

  function isSameOrigin(url) {
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function shouldIntercept(link, event) {
    if (!link || !link.getAttribute('href')) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (link.dataset.noTransition !== undefined) return false;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (!isSameOrigin(link.href)) return false;

    const target = new URL(link.href, window.location.href);
    const isSamePage = target.pathname === window.location.pathname && target.search === window.location.search;
    if (isSamePage && target.hash) return false;

    return true;
  }

  function initPageTransitions() {
    const content = document.querySelector('main.ptx-content');
    if (!content) return null;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let navigating = false;

    document.addEventListener('click', event => {
      if (navigating) return;
      const link = event.target.closest('a[href]');
      if (!shouldIntercept(link, event)) return;

      event.preventDefault();
      navigating = true;
      const href = link.href;

      if (reduced) {
        window.location.href = href;
        return;
      }

      let left = false;
      const go = () => {
        if (left) return;
        left = true;
        window.location.href = href;
      };

      content.addEventListener('animationend', go, { once: true });
      setTimeout(go, EXIT_FALLBACK_MS);
      content.classList.add('ptx-out');
    });

    window.addEventListener('pageshow', event => {
      if (!event.persisted) return;
      content.classList.remove('ptx-out');
      navigating = false;
    });

    return { content };
  }

  window.initPageTransitions = initPageTransitions;
})();
