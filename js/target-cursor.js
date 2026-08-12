/* TargetCursor — vanilla JS port (from React Bits) of a GSAP-driven cursor
   that locks onto interactive elements with animated corner brackets.
   Mirrors the pattern in staggered-menu.js: an IIFE exposing a single
   window.initTargetCursor(options) entry point. */

(function () {
  const CORNER_SIZE = 12;
  const BORDER_WIDTH = 3;

  // A position: fixed element is positioned relative to the viewport UNLESS an
  // ancestor establishes a containing block (transform, perspective, filter,
  // will-change of those, or contain). When that happens, the cursor's translate
  // no longer maps to viewport coordinates, so we measure and compensate for it.
  function getContainingBlock(element) {
    let node = element && element.parentElement;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      if (
        style.transform !== 'none' ||
        style.perspective !== 'none' ||
        style.filter !== 'none' ||
        style.willChange.includes('transform') ||
        style.willChange.includes('perspective') ||
        style.willChange.includes('filter') ||
        /paint|layout|strict|content/.test(style.contain)
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function getContainingBlockOffset(block) {
    if (!block) return { x: 0, y: 0 };
    const rect = block.getBoundingClientRect();
    return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
  }

  function isMobileDevice() {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    return (hasTouchScreen && isSmallScreen) || mobileRegex.test(userAgent.toLowerCase());
  }

  function initTargetCursor(options) {
    if (typeof gsap === 'undefined' || isMobileDevice()) return null;

    const opts = Object.assign(
      {
        targetSelector: '.cursor-target',
        spinDuration: 2,
        hideDefaultCursor: true,
        hoverDuration: 0.2,
        parallaxOn: true,
        cursorColor: '#ffffff',
        cursorColorOnTarget: undefined
      },
      options || {}
    );

    const wrapper = document.createElement('div');
    wrapper.className = 'target-cursor-wrapper';

    const dot = document.createElement('div');
    dot.className = 'target-cursor-dot';
    dot.style.backgroundColor = opts.cursorColor;
    wrapper.appendChild(dot);

    const corners = ['corner-tl', 'corner-tr', 'corner-br', 'corner-bl'].map(cls => {
      const el = document.createElement('div');
      el.className = 'target-cursor-corner ' + cls;
      el.style.borderColor = opts.cursorColor;
      wrapper.appendChild(el);
      return el;
    });

    document.body.appendChild(wrapper);

    const originalCursor = document.body.style.cursor;
    if (opts.hideDefaultCursor) document.body.style.cursor = 'none';

    let containingBlock = getContainingBlock(wrapper);
    const getOffset = () => getContainingBlockOffset(containingBlock);

    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;
    let spinTl = null;
    let targetCornerPositions = null;
    const activeStrength = { current: 0 };

    const initialOffset = getOffset();
    gsap.set(wrapper, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y
    });

    function createSpinTimeline() {
      if (spinTl) spinTl.kill();
      spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, { rotation: '+=360', duration: opts.spinDuration, ease: 'none' });
    }
    createSpinTimeline();

    function tickerFn() {
      if (!targetCornerPositions) return;
      const strength = activeStrength.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');

      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');
        const targetX = targetCornerPositions[i].x - cursorX;
        const targetY = targetCornerPositions[i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (opts.parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    }

    function moveCursor(x, y) {
      const { x: offsetX, y: offsetY } = getOffset();
      gsap.to(wrapper, { x: x - offsetX, y: y - offsetY, duration: 0.1, ease: 'power3.out' });
    }

    const moveHandler = e => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    function cleanupTarget(target) {
      if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
      currentLeaveHandler = null;
    }

    const scrollHandler = () => {
      if (!activeTarget) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = gsap.getProperty(wrapper, 'x') + offsetX;
      const mouseY = gsap.getProperty(wrapper, 'y') + offsetY;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(opts.targetSelector) === activeTarget);
      if (!isStillOverTarget && currentLeaveHandler) currentLeaveHandler();
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      gsap.to(dot, { scale: 0.7, duration: 0.3 });
      gsap.to(wrapper, { scale: 0.9, duration: 0.2 });
    };
    const mouseUpHandler = () => {
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(wrapper, { scale: 1, duration: 0.2 });
    };
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = e => {
      let current = e.target;
      let target = null;
      while (current && current !== document.body) {
        if (current.matches && current.matches(opts.targetSelector)) {
          target = current;
          break;
        }
        current = current.parentElement;
      }
      if (!target || target === activeTarget) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      corners.forEach(corner => gsap.killTweensOf(corner, 'x,y'));
      gsap.killTweensOf(wrapper, 'rotation');
      if (spinTl) spinTl.pause();
      gsap.set(wrapper, { rotation: 0 });

      if (opts.cursorColorOnTarget) {
        gsap.to(corners, { borderColor: opts.cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });
        gsap.to(dot, { backgroundColor: opts.cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });
      }

      const rect = target.getBoundingClientRect();
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(wrapper, 'x');
      const cursorY = gsap.getProperty(wrapper, 'y');

      targetCornerPositions = [
        { x: rect.left - BORDER_WIDTH - offsetX, y: rect.top - BORDER_WIDTH - offsetY },
        { x: rect.right + BORDER_WIDTH - CORNER_SIZE - offsetX, y: rect.top - BORDER_WIDTH - offsetY },
        { x: rect.right + BORDER_WIDTH - CORNER_SIZE - offsetX, y: rect.bottom + BORDER_WIDTH - CORNER_SIZE - offsetY },
        { x: rect.left - BORDER_WIDTH - offsetX, y: rect.bottom + BORDER_WIDTH - CORNER_SIZE - offsetY }
      ];

      activeStrength.current = 0;
      gsap.ticker.add(tickerFn);
      gsap.to(activeStrength, { current: 1, duration: opts.hoverDuration, ease: 'power2.out' });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositions[i].x - cursorX,
          y: targetCornerPositions[i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFn);
        targetCornerPositions = null;
        gsap.set(activeStrength, { current: 0, overwrite: true });
        activeTarget = null;

        if (opts.cursorColorOnTarget) {
          gsap.to(corners, { borderColor: opts.cursorColor, duration: 0.15, ease: 'power2.out' });
          gsap.to(dot, { backgroundColor: opts.cursorColor, duration: 0.15, ease: 'power2.out' });
        }

        gsap.killTweensOf(corners, 'x,y');
        const positions = [
          { x: -CORNER_SIZE * 1.5, y: -CORNER_SIZE * 1.5 },
          { x: CORNER_SIZE * 0.5, y: -CORNER_SIZE * 1.5 },
          { x: CORNER_SIZE * 0.5, y: CORNER_SIZE * 0.5 },
          { x: -CORNER_SIZE * 1.5, y: CORNER_SIZE * 0.5 }
        ];
        const tl = gsap.timeline();
        corners.forEach((corner, index) => {
          tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
        });

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && spinTl) {
            const currentRotation = gsap.getProperty(wrapper, 'rotation');
            const normalizedRotation = currentRotation % 360;
            spinTl.kill();
            spinTl = gsap.timeline({ repeat: -1 }).to(wrapper, { rotation: '+=360', duration: opts.spinDuration, ease: 'none' });
            gsap.to(wrapper, {
              rotation: normalizedRotation + 360,
              duration: opts.spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => spinTl && spinTl.restart()
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    const resizeHandler = () => {
      containingBlock = getContainingBlock(wrapper);
    };
    window.addEventListener('resize', resizeHandler);

    return {
      destroy: function () {
        gsap.ticker.remove(tickerFn);
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseover', enterHandler);
        window.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', resizeHandler);
        window.removeEventListener('mousedown', mouseDownHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        if (activeTarget) cleanupTarget(activeTarget);
        if (spinTl) spinTl.kill();
        document.body.style.cursor = originalCursor;
        wrapper.remove();
      }
    };
  }

  window.initTargetCursor = initTargetCursor;
})();
