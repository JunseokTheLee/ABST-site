document.addEventListener('DOMContentLoaded', () => {
  initPageTransitions();
  if (typeof ABST_POSTS !== 'undefined') {
    const sorted = sortByDateDesc(ABST_POSTS);
    renderGrid('recent-posts-grid', sorted.slice(0, 3));
    renderGrid('posts-grid', sorted);
  }
  if (typeof ABST_PROJECTS !== 'undefined') {
    initProjectsMenu(ABST_PROJECTS);
  }
  initActivityCarousel();
  initHomeHero();
  initProjectHero();
  initSiteMenu();
  initSiteCursor();
});

function initProjectsMenu(projects) {
  const mount = document.getElementById('projects-menu');
  if (!mount || typeof initFlowingMenu === 'undefined') return;

  initFlowingMenu(mount, {
    items: projects.map(p => ({ link: p.url, text: p.title, tag: p.tag })),
    speed: 18,
    bgColor: '#050810',
    textColor: '#ffffff',
    marqueeBgColor: '#00c2ff',
    marqueeTextColor: '#050810',
    borderColor: 'rgba(255, 255, 255, 0.18)'
  });
}

function initActivityCarousel() {
  const viewport = document.getElementById('spotlight-carousel-track');
  if (!viewport || typeof ABST_ACTIVITIES === 'undefined' || typeof initSideCarousel === 'undefined') return;

  initSideCarousel(viewport, ABST_ACTIVITIES, {
    prevBtn: document.getElementById('spotlight-carousel-prev'),
    nextBtn: document.getElementById('spotlight-carousel-next')
  });
}

function initSiteCursor() {
  if (typeof initTargetCursor === 'undefined') return;

  initTargetCursor({
    targetSelector: '.cursor-target',
    spinDuration: 2,
    hideDefaultCursor: true,
    cursorColor: '#ffffff',
    cursorColorOnTarget: '#00c2ff'
  });
}

function initSiteMenu() {
  const mount = document.getElementById('site-menu');
  if (!mount || typeof initStaggeredMenu === 'undefined') return;

  const base = mount.dataset.base || '';

  initStaggeredMenu(mount, {
    position: 'right',
    items: [
      { label: 'Home', ariaLabel: 'Go to home page', link: base + 'index.html' },
      { label: 'About', ariaLabel: 'Learn about ABST', link: base + 'about.html' },
      { label: 'Journal', ariaLabel: 'Read the ABST journal', link: base + 'blog.html' },
      { label: 'Projects', ariaLabel: 'View ABST projects', link: base + 'projects.html' }
    ],
    socialItems: [
      { label: 'Instagram', link: 'https://www.instagram.com/abst_exhibition/' },
      { label: 'abst.space', link: 'https://abst.space/' }
    ],
    displaySocials: true,
    displayItemNumbering: true,
    colors: ['#0058ff', '#00c2ff'],
    accentColor: '#00c2ff',
    menuButtonColor: '#fff',
    openMenuButtonColor: '#fff',
    changeMenuColorOnOpen: false,
    closeOnClickAway: true
  });
}

function initHomeHero() {
  const root = document.getElementById('hero-scroll-expand');
  if (!root || typeof initScrollExpand === 'undefined') return;

  initScrollExpand(root, {
    usePlaceholderMedia: false,
    mediaType: 'image',
    src: 'images/main.jpg',
    alt: 'Visitors viewing artwork at an ABST exhibition',
    outerTiles: 0,
    outerTileImages: [
      
    ],
    useWindowScroll: true,
    title: 'ABST EXHIBITIONS',
    titleTag: 'h1',
    scrollDistance: 1.2,
    holdDistance: 0.35,
    childrenHTML: `
      <p class="eyebrow">Art Beyond Some Thresholds</p>
      <p class="hero-sub">Based in Jeju Island, ABST brings together high school art students and local autistic/disabled youth artists to build exhibitions rooted in collaboration, not just inclusion.</p>
      <a class="scroll-cue cursor-target" href="#posts">Scroll to see our journal ↓</a>
    `
  });
}

function initProjectHero() {
  const root = document.getElementById('project-hero-scroll-expand');
  if (!root || typeof initScrollExpand === 'undefined') return;

  const title = root.dataset.title || '';
  const eyebrow = root.dataset.eyebrow || '';
  const cta = root.dataset.cta || '';
  const ctaTarget = root.dataset.ctaTarget || '#project-content';

  initScrollExpand(root, {
    usePlaceholderMedia: true,
    useWindowScroll: true,
    title,
    titleTag: 'div',
    scrollDistance: 1.2,
    holdDistance: 0.35,
    childrenHTML: `
      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
      ${cta ? `<a class="scroll-cue cursor-target" href="${ctaTarget}">${cta}</a>` : ''}
    `
  });
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderGrid(gridId, items) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (!items || !items.length) {
    grid.innerHTML = '<p class="posts-empty">Nothing here yet — check back soon.</p>';
    return;
  }

  grid.innerHTML = items.map(renderCard).join('');
}

function renderCard(item) {
  const metaLine = item.date
    ? `<time datetime="${item.date}">${formatDate(item.date)}</time>`
    : (item.meta ? `<span class="post-body-meta">${item.meta}</span>` : '');

  return `
    <a class="post-card" href="${item.url}">
      <div class="post-thumb" aria-hidden="true">${item.thumb ? `<img src="${item.thumb}" alt="" loading="lazy">` : '<span>Image placeholder</span>'}</div>
      <div class="post-body">
        <span class="post-tag">${item.tag}</span>
        <h3>${item.title}</h3>
        ${metaLine}
        <span class="read-more">Read more &rarr;</span>
      </div>
    </a>
  `;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
