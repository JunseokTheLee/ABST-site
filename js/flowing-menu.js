/* FlowingMenu — vanilla JS port (from React Bits) of a GSAP-driven marquee nav
   list. Mirrors the pattern in staggered-menu.js: an IIFE exposing a single
   window.initFlowingMenu(mount, options) entry point. */

(function () {
  function distMetric(x, y, x2, y2) {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  }

  function findClosestEdge(mouseX, mouseY, width, height) {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  }

  function buildMenuItem(item, opts) {
    const li = document.createElement('div');
    li.className = 'fm-item';

    if (item.image) {
      const bg = document.createElement('div');
      bg.className = 'fm-item-bg';
      bg.style.backgroundImage = `url("${item.image}")`;
      li.appendChild(bg);
    }

    const link = document.createElement('a');
    link.className = 'fm-item-link cursor-target';
    link.href = item.link || '#';
    link.textContent = item.text;
    li.appendChild(link);

    const marquee = document.createElement('div');
    marquee.className = 'fm-marquee';

    const innerWrap = document.createElement('div');
    innerWrap.className = 'fm-marquee-inner-wrap';

    const inner = document.createElement('div');
    inner.className = 'fm-marquee-inner';
    inner.setAttribute('aria-hidden', 'true');

    innerWrap.appendChild(inner);
    marquee.appendChild(innerWrap);
    li.appendChild(marquee);

    let repetitions = 4;
    let animation = null;

    function renderParts() {
      inner.innerHTML = '';
      for (let i = 0; i < repetitions; i++) {
        const part = document.createElement('div');
        part.className = 'fm-marquee-part';

        const text = document.createElement('span');
        text.className = 'fm-marquee-text';
        text.textContent = item.text;
        part.appendChild(text);

        const placeholder = document.createElement('span');
        placeholder.className = 'fm-marquee-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        const placeholderImage = item.hoverImage || item.image;
        if (placeholderImage) {
          const img = document.createElement('img');
          img.className = 'fm-marquee-placeholder-img';
          img.src = placeholderImage;
          img.alt = '';
          img.draggable = false;
          placeholder.appendChild(img);
        } else {
          placeholder.textContent = 'IMG';
        }
        part.appendChild(placeholder);

        inner.appendChild(part);
      }
    }

    function calculateRepetitions() {
      renderParts();
      const part = inner.querySelector('.fm-marquee-part');
      if (!part) return;
      const contentWidth = part.offsetWidth;
      if (!contentWidth) return;
      const needed = Math.ceil(window.innerWidth / contentWidth) + 2;
      const next = Math.max(4, needed);
      if (next !== repetitions) {
        repetitions = next;
        renderParts();
      }
    }

    function setupMarquee() {
      const part = inner.querySelector('.fm-marquee-part');
      if (!part) return;
      const contentWidth = part.offsetWidth;
      if (!contentWidth) return;

      if (animation) animation.kill();
      animation = gsap.to(inner, {
        x: -contentWidth,
        duration: opts.speed,
        ease: 'none',
        repeat: -1
      });
    }

    calculateRepetitions();
    setTimeout(setupMarquee, 50);

    window.addEventListener('resize', () => {
      calculateRepetitions();
      setupMarquee();
    });

    const animationDefaults = { duration: 0.6, ease: 'expo' };

    link.addEventListener('mouseenter', ev => {
      const rect = li.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      gsap
        .timeline({ defaults: animationDefaults })
        .set(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .set(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0)
        .to([marquee, inner], { y: '0%' }, 0);
    });

    link.addEventListener('mouseleave', ev => {
      const rect = li.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);

      gsap
        .timeline({ defaults: animationDefaults })
        .to(marquee, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .to(inner, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    });

    return li;
  }

  function initFlowingMenu(mount, options) {
    if (typeof gsap === 'undefined' || !mount) return null;

    const opts = Object.assign(
      {
        items: [],
        speed: 15,
        textColor: '#ffffff',
        bgColor: '#120F17',
        marqueeBgColor: '#ffffff',
        marqueeTextColor: '#120F17',
        borderColor: '#ffffff'
      },
      options || {}
    );

    mount.innerHTML = '';
    mount.classList.add('fm-host');
    mount.style.setProperty('--fm-bg', opts.bgColor);
    mount.style.setProperty('--fm-text', opts.textColor);
    mount.style.setProperty('--fm-marquee-bg', opts.marqueeBgColor);
    mount.style.setProperty('--fm-marquee-fg', opts.marqueeTextColor);
    mount.style.setProperty('--fm-border', opts.borderColor);

    const wrap = document.createElement('div');
    wrap.className = 'fm-wrap';

    const nav = document.createElement('nav');
    nav.className = 'fm-menu';

    opts.items.forEach(item => {
      nav.appendChild(buildMenuItem(item, opts));
    });

    wrap.appendChild(nav);
    mount.appendChild(wrap);

    return {
      destroy() {
        mount.innerHTML = '';
      }
    };
  }

  window.initFlowingMenu = initFlowingMenu;
})();
