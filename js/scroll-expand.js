/* ScrollExpand — vanilla JS port (from React Bits) for scroll-driven media reveal */

(function () {
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
    return t * t * (3 - 2 * t);
  };

  // Scroll-drift direction per outer tile (px at full drift), matching each tile's
  // corner so it scatters outward as the frame expands over it.
  const OUTER_TILE_DRIFT = [
    [-52, -40], // top-left
    [-52, 44],  // bottom-left
    [52, -40],  // top-right
    [52, 44],   // bottom-right
    [0, 48]     // bottom-center
  ];

  function initScrollExpand(root, options) {
    const opts = Object.assign(
      {
        mediaType: 'image',
        src: '',
        poster: '',
        alt: '',
        title: '',
        titleTag: 'div',
        scrollHintHTML: '',
        startWidth: 42,
        startHeight: 58,
        startRadius: 24,
        endRadius: 0,
        mediaZoom: 1.35,
        scrollDistance: 1.2,
        holdDistance: 0.35,
        smoothing: 0.1,
        overlayScrim: 0.65,
        useWindowScroll: false,
        enabled: true,
        usePlaceholderMedia: false,
        outerTiles: 0,
        outerTileImages: [],
        childrenHTML: ''
      },
      options || {}
    );

    root.classList.add('scroll-expand');
    if (!opts.useWindowScroll) root.classList.add('scroll-expand--scroller');

    const track = document.createElement('div');
    track.className = 'scroll-expand__track';

    const stage = document.createElement('div');
    stage.className = 'scroll-expand__stage';

    const frame = document.createElement('div');
    frame.className = 'scroll-expand__frame';

    let media;
    if (opts.usePlaceholderMedia) {
      media = document.createElement('div');
      media.className = 'scroll-expand__media placeholder-media';
      media.setAttribute('aria-hidden', 'true');
    } else if (opts.mediaType === 'video') {
      media = document.createElement('video');
      media.className = 'scroll-expand__media';
      media.src = opts.src;
      if (opts.poster) media.poster = opts.poster;
      media.autoplay = true;
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
    } else {
      media = document.createElement('img');
      media.className = 'scroll-expand__media';
      media.src = opts.src;
      media.alt = opts.alt;
      media.draggable = false;
    }
    frame.appendChild(media);

    const scrim = document.createElement('div');
    scrim.className = 'scroll-expand__scrim';
    frame.appendChild(scrim);

    let overlay = null;
    if (opts.childrenHTML) {
      overlay = document.createElement('div');
      overlay.className = 'scroll-expand__overlay';
      overlay.innerHTML = opts.childrenHTML;
      frame.appendChild(overlay);
    }

    stage.appendChild(frame);

    const outerTileEls = [];
    const tileCount = Math.max(0, opts.outerTiles);
    for (let i = 1; i <= tileCount; i++) {
      const tile = document.createElement('div');
      tile.className = `scroll-expand__outer-tile scroll-expand__outer-tile--${i}`;

      const tileImage = opts.outerTileImages[i - 1];
      if (tileImage) {
        const img = document.createElement('img');
        img.className = 'scroll-expand__outer-tile-img';
        img.src = typeof tileImage === 'string' ? tileImage : tileImage.src;
        img.alt = '';
        img.draggable = false;
        tile.appendChild(img);
      } else {
        tile.innerHTML = `<span class="scroll-expand__outer-tile-label">IMG 0${i}</span>`;
      }

      stage.appendChild(tile);
      outerTileEls.push(tile);
    }

    let titleEl = null;
    if (opts.title) {
      titleEl = document.createElement(opts.titleTag);
      titleEl.className = 'scroll-expand__title';
      titleEl.textContent = opts.title;
      stage.appendChild(titleEl);
    }

    let hintEl = null;
    if (opts.scrollHintHTML) {
      hintEl = document.createElement('div');
      hintEl.className = 'scroll-expand__hint';
      hintEl.innerHTML = opts.scrollHintHTML;
      stage.appendChild(hintEl);
    }

    track.appendChild(stage);
    root.appendChild(track);

    const applyProgress = p => {
      const e = smoothstep(0, 1, p);

      const w = opts.startWidth + (100 - opts.startWidth) * e;
      const h = opts.startHeight + (100 - opts.startHeight) * e;
      const ix = Math.max(0, (100 - w) / 2);
      const iy = Math.max(0, (100 - h) / 2);
      const r = opts.startRadius + (opts.endRadius - opts.startRadius) * e;
      frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

      media.style.transform = `scale(${opts.mediaZoom + (1 - opts.mediaZoom) * e})`;

      scrim.style.opacity = `${opts.overlayScrim * e}`;

      if (titleEl) {
        const out = smoothstep(0.4, 0.88, p);
        titleEl.style.opacity = `${1 - out}`;
        titleEl.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
      }

      if (hintEl) {
        const gone = smoothstep(0, 0.12, p);
        hintEl.style.opacity = `${1 - gone}`;
        hintEl.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
      }

      if (overlay) {
        const inn = smoothstep(0.68, 1, p);
        overlay.style.opacity = `${inn}`;
        overlay.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
      }

      if (outerTileEls.length) {
        outerTileEls.forEach((tile, idx) => {
          const start = idx * 0.035;
          const gone = smoothstep(start, start + 0.28, p);
          const [dx, dy] = OUTER_TILE_DRIFT[idx % OUTER_TILE_DRIFT.length];
          tile.style.opacity = `${1 - gone}`;
          tile.style.scale = `${1 - 0.12 * gone}`;
          tile.style.translate = `${dx * gone}px ${dy * gone}px`;
        });
      }
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      stageH = opts.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, opts.scrollDistance) + Math.max(0, opts.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      if (!opts.enabled) return 1;
      const span = stageH * Math.max(0.01, opts.scrollDistance);
      if (opts.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const k = opts.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * opts.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (opts.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = opts.useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return {
      destroy() {
        if (raf) cancelAnimationFrame(raf);
        scroller.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        ro.disconnect();
      }
    };
  }

  window.initScrollExpand = initScrollExpand;
})();
