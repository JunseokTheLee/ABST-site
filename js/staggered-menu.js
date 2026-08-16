/* StaggeredMenu — vanilla JS port (from React Bits) of a GSAP-driven slide-out nav.
   Toggle button renders into `mount` (placed inside the page header); the sliding
   panel and prelayer stripes render into a fixed overlay appended to <body>. */

(function () {
  function initStaggeredMenu(mount, options) {
    if (typeof gsap === 'undefined' || !mount) return null;

    const opts = Object.assign(
      {
        position: 'right',
        colors: ['#B497CF', '#5227FF'],
        items: [],
        socialItems: [],
        displaySocials: true,
        socialsTitle: 'Socials',
        displayItemNumbering: true,
        menuButtonColor: '#fff',
        openMenuButtonColor: '#fff',
        accentColor: '#5227ff',
        changeMenuColorOnOpen: true,
        closeOnClickAway: true,
        onMenuOpen: null,
        onMenuClose: null
      },
      options || {}
    );

    const position = opts.position === 'left' ? 'left' : 'right';
    const offscreen = position === 'left' ? -100 : 100;

    function isCurrentPage(href) {
      const a = document.createElement('a');
      a.href = href;
      const target = a.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
      const current = location.pathname.replace(/\/+$/, '').split('/').pop() || 'index.html';
      return target === current;
    }

    // --- Toggle button, rendered into the page header ---

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sm-toggle cursor-target';
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'staggered-menu-panel');

    const textWrap = document.createElement('span');
    textWrap.className = 'sm-toggle-textWrap';
    textWrap.setAttribute('aria-hidden', 'true');
    const textInner = document.createElement('span');
    textInner.className = 'sm-toggle-textInner';
    textWrap.appendChild(textInner);

    const icon = document.createElement('span');
    icon.className = 'sm-icon';
    icon.setAttribute('aria-hidden', 'true');
    const plusH = document.createElement('span');
    plusH.className = 'sm-icon-line';
    const plusV = document.createElement('span');
    plusV.className = 'sm-icon-line';
    icon.appendChild(plusH);
    icon.appendChild(plusV);

    toggle.appendChild(textWrap);
    toggle.appendChild(icon);
    mount.appendChild(toggle);

    // --- Overlay: prelayer stripes + sliding panel, fixed to the viewport ---

    const overlay = document.createElement('div');
    overlay.className = 'staggered-menu-overlay';
    overlay.setAttribute('data-position', position);
    if (opts.accentColor) overlay.style.setProperty('--sm-accent', opts.accentColor);

    const preLayersWrap = document.createElement('div');
    preLayersWrap.className = 'sm-prelayers';
    preLayersWrap.setAttribute('aria-hidden', 'true');

    const rawColors = opts.colors && opts.colors.length ? opts.colors.slice(0, 4) : ['#1e1e22', '#35353c'];
    const colorArr = rawColors.slice();
    if (colorArr.length >= 3) colorArr.splice(Math.floor(colorArr.length / 2), 1);
    const preLayers = colorArr.map(c => {
      const layer = document.createElement('div');
      layer.className = 'sm-prelayer';
      layer.style.background = c;
      preLayersWrap.appendChild(layer);
      return layer;
    });

    const panel = document.createElement('aside');
    panel.id = 'staggered-menu-panel';
    panel.className = 'staggered-menu-panel';
    panel.setAttribute('aria-hidden', 'true');

    const panelInner = document.createElement('div');
    panelInner.className = 'sm-panel-inner';

    const list = document.createElement('ul');
    list.className = 'sm-panel-list';
    list.setAttribute('role', 'list');
    if (opts.displayItemNumbering) list.setAttribute('data-numbering', '');

    const itemLabelEls = [];
    if (opts.items && opts.items.length) {
      opts.items.forEach((it, idx) => {
        const li = document.createElement('li');
        li.className = 'sm-panel-itemWrap';
        const a = document.createElement('a');
        a.className = 'sm-panel-item cursor-target';
        a.href = it.link;
        if (it.ariaLabel) a.setAttribute('aria-label', it.ariaLabel);
        a.setAttribute('data-index', String(idx + 1));
        if (isCurrentPage(it.link)) a.classList.add('is-current');
        const label = document.createElement('span');
        label.className = 'sm-panel-itemLabel';
        label.textContent = it.label;
        a.appendChild(label);
        li.appendChild(a);
        list.appendChild(li);
        itemLabelEls.push(label);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'sm-panel-itemWrap';
      li.setAttribute('aria-hidden', 'true');
      li.innerHTML = '<span class="sm-panel-item"><span class="sm-panel-itemLabel">No items</span></span>';
      list.appendChild(li);
    }
    panelInner.appendChild(list);

    let socialTitle = null;
    const socialLinkEls = [];
    if (opts.displaySocials && opts.socialItems && opts.socialItems.length) {
      const socials = document.createElement('div');
      socials.className = 'sm-socials';
      socials.setAttribute('aria-label', 'Social links');
      socialTitle = document.createElement('h3');
      socialTitle.className = 'sm-socials-title';
      socialTitle.textContent = opts.socialsTitle;
      const socialList = document.createElement('ul');
      socialList.className = 'sm-socials-list';
      socialList.setAttribute('role', 'list');
      opts.socialItems.forEach(s => {
        const li = document.createElement('li');
        li.className = 'sm-socials-item';
        const a = document.createElement('a');
        a.className = 'sm-socials-link cursor-target';
        a.href = s.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = s.label;
        li.appendChild(a);
        socialList.appendChild(li);
        socialLinkEls.push(a);
      });
      socials.appendChild(socialTitle);
      socials.appendChild(socialList);
      panelInner.appendChild(socials);
    }

    panel.appendChild(panelInner);
    overlay.appendChild(preLayersWrap);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // --- Animation state ---

    let open = false;
    let busy = false;
    let openTl = null;
    let closeTween = null;
    let spinTween = null;
    let colorTween = null;
    let textCycleAnim = null;
    let textLines = ['Menu', 'Close'];

    function numberEls() {
      return list.hasAttribute('data-numbering') ? Array.from(list.querySelectorAll('.sm-panel-item')) : [];
    }

    function renderTextLines() {
      textInner.innerHTML = '';
      textLines.forEach(l => {
        const span = document.createElement('span');
        span.className = 'sm-toggle-line';
        span.textContent = l;
        textInner.appendChild(span);
      });
    }

    gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
    gsap.set(preLayersWrap, { xPercent: 0, opacity: 1 });
    gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
    gsap.set(textInner, { yPercent: 0 });
    gsap.set(toggle, { color: opts.menuButtonColor });
    renderTextLines();

    function buildOpenTimeline() {
      if (openTl) openTl.kill();
      if (closeTween) {
        closeTween.kill();
        closeTween = null;
      }

      const numEls = numberEls();

      if (itemLabelEls.length) gsap.set(itemLabelEls, { yPercent: 140, rotate: 10 });
      if (numEls.length) gsap.set(numEls, { '--sm-num-opacity': 0 });
      if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
      if (socialLinkEls.length) gsap.set(socialLinkEls, { y: 25, opacity: 0 });

      const panelStart = offscreen;
      const tl = gsap.timeline({ paused: true });

      preLayers.forEach((el, i) => {
        tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
      });
      const lastTime = preLayers.length ? (preLayers.length - 1) * 0.07 : 0;
      const panelInsertTime = lastTime + (preLayers.length ? 0.08 : 0);
      const panelDuration = 0.65;
      tl.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

      if (itemLabelEls.length) {
        const itemsStart = panelInsertTime + panelDuration * 0.15;
        tl.to(
          itemLabelEls,
          { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
          itemsStart
        );
        if (numEls.length) {
          tl.to(
            numEls,
            { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } },
            itemsStart + 0.1
          );
        }
      }

      if (socialTitle || socialLinkEls.length) {
        const socialsStart = panelInsertTime + panelDuration * 0.4;
        if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
        if (socialLinkEls.length) {
          tl.to(
            socialLinkEls,
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power3.out',
              stagger: { each: 0.08, from: 'start' },
              onComplete: () => gsap.set(socialLinkEls, { clearProps: 'opacity' })
            },
            socialsStart + 0.04
          );
        }
      }

      openTl = tl;
      return tl;
    }

    function playOpen() {
      if (busy) return;
      busy = true;
      const tl = buildOpenTimeline();
      tl.eventCallback('onComplete', () => {
        busy = false;
      });
      tl.play(0);
    }

    function playClose() {
      if (openTl) {
        openTl.kill();
        openTl = null;
      }
      const all = [...preLayers, panel];
      if (closeTween) closeTween.kill();
      closeTween = gsap.to(all, {
        xPercent: offscreen,
        duration: 0.32,
        ease: 'power3.in',
        overwrite: 'auto',
        onComplete: () => {
          if (itemLabelEls.length) gsap.set(itemLabelEls, { yPercent: 140, rotate: 10 });
          const numEls = numberEls();
          if (numEls.length) gsap.set(numEls, { '--sm-num-opacity': 0 });
          if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
          if (socialLinkEls.length) gsap.set(socialLinkEls, { y: 25, opacity: 0 });
          busy = false;
        }
      });
    }

    function animateIcon(opening) {
      if (spinTween) spinTween.kill();
      spinTween = opening
        ? gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' })
        : gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }

    function animateColor(opening) {
      if (colorTween) colorTween.kill();
      if (opts.changeMenuColorOnOpen) {
        const targetColor = opening ? opts.openMenuButtonColor : opts.menuButtonColor;
        colorTween = gsap.to(toggle, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.set(toggle, { color: opts.menuButtonColor });
      }
    }

    function animateText(opening) {
      if (textCycleAnim) textCycleAnim.kill();
      const currentLabel = opening ? 'Menu' : 'Close';
      const targetLabel = opening ? 'Close' : 'Menu';
      const cycles = 3;
      const seq = [currentLabel];
      let last = currentLabel;
      for (let i = 0; i < cycles; i++) {
        last = last === 'Menu' ? 'Close' : 'Menu';
        seq.push(last);
      }
      if (last !== targetLabel) seq.push(targetLabel);
      seq.push(targetLabel);
      textLines = seq;
      renderTextLines();

      gsap.set(textInner, { yPercent: 0 });
      const lineCount = seq.length;
      const finalShift = ((lineCount - 1) / lineCount) * 100;
      textCycleAnim = gsap.to(textInner, {
        yPercent: -finalShift,
        duration: 0.5 + lineCount * 0.07,
        ease: 'power4.out'
      });
    }

    function setOpenState(next) {
      open = next;
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      toggle.setAttribute('aria-expanded', String(open));
      panel.setAttribute('aria-hidden', String(!open));
    }

    function toggleMenu() {
      const target = !open;
      setOpenState(target);
      if (target) {
        if (opts.onMenuOpen) opts.onMenuOpen();
        playOpen();
      } else {
        if (opts.onMenuClose) opts.onMenuClose();
        playClose();
      }
      animateIcon(target);
      animateColor(target);
      animateText(target);
    }

    function closeMenu() {
      if (!open) return;
      setOpenState(false);
      if (opts.onMenuClose) opts.onMenuClose();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }

    toggle.addEventListener('click', toggleMenu);

    document.addEventListener('mousedown', e => {
      if (!opts.closeOnClickAway || !open) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && open) closeMenu();
    });

    return {
      open: () => {
        if (!open) toggleMenu();
      },
      close: closeMenu,
      toggle: toggleMenu
    };
  }

  window.initStaggeredMenu = initStaggeredMenu;
})();
