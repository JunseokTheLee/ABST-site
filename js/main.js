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
  initProjectGallery();
  initArtworkLightbox();
  initSiteMenu();
  initSiteCursor();
});

function isKoPage() {
  return document.documentElement.lang === 'ko';
}

function initProjectsMenu(projects) {
  const mount = document.getElementById('projects-menu');
  if (!mount || typeof initFlowingMenu === 'undefined') return;

  const ko = isKoPage();

  initFlowingMenu(mount, {
    items: projects.map(p => ({
      link: ko ? p.url.replace('.html', '-ko.html') : p.url,
      text: ko ? (p.titleKo || p.title) : p.title,
      tag: ko ? (p.tagKo || p.tag) : p.tag,
      image: p.image,
      hoverImage: p.hoverImage
    })),
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
  const ko = isKoPage();

  const items = ko ? [
    { label: '홈', ariaLabel: '홈으로 이동', link: base + 'index-ko.html' },
    { label: '소개', ariaLabel: 'ABST 소개 보기', link: base + 'about-ko.html' },
    { label: '저널', ariaLabel: 'ABST 저널 읽기', link: base + 'blog-ko.html' },
    { label: '프로젝트', ariaLabel: 'ABST 프로젝트 보기', link: base + 'projects-ko.html' }
  ] : [
    { label: 'Home', ariaLabel: 'Go to home page', link: base + 'index.html' },
    { label: 'About', ariaLabel: 'Learn about ABST', link: base + 'about.html' },
    { label: 'Journal', ariaLabel: 'Read the ABST journal', link: base + 'blog.html' },
    { label: 'Projects', ariaLabel: 'View ABST projects', link: base + 'projects.html' }
  ];

  initStaggeredMenu(mount, {
    position: 'right',
    items,
    socialsTitle: ko ? 'SNS' : 'Socials',
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

  const ko = isKoPage();
  const title = ko ? 'ABST' : 'ABST EXHIBITIONS';
  const eyebrow = ko ? '문턱 너머의 예술' : 'Art Beyond Some Thresholds';
  const sub = ko
    ? '제주도를 기반으로 한 ABST는 고등학생 미술 작가와 지역의 자폐성·발달장애 청소년 작가들이 만나, \'포함\'을 넘어 진정한 협업에 뿌리내린 전시를 만들어갑니다.'
    : 'Based in Jeju Island, ABST brings together high school art students and local autistic/disabled youth artists to build exhibitions rooted in collaboration, not just inclusion.';
  const cta = ko ? '저널 보러 스크롤하기 ↓' : 'Scroll to see our journal ↓';
  const alt = ko ? 'ABST 전시에서 작품을 관람하는 방문객들' : 'Visitors viewing artwork at an ABST exhibition';

  initScrollExpand(root, {
    usePlaceholderMedia: false,
    mediaType: 'image',
    src: 'images/main.jpg',
    srcColor: 'images/main-color.jpg',
    alt,
    outerTiles: 0,
    outerTileImages: [

    ],
    useWindowScroll: true,
    title,
    titleTag: 'h1',
    scrollDistance: 1.2,
    holdDistance: 0.35,
    childrenHTML: `
      <p class="eyebrow">${eyebrow}</p>
      <p class="hero-sub">${sub}</p>
      <a class="scroll-cue cursor-target" href="#posts">${cta}</a>
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
  const image = root.dataset.image || '';

  initScrollExpand(root, {
    usePlaceholderMedia: !image,
    mediaType: 'image',
    src: image,
    alt: title,
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

function initProjectGallery() {
  const root = document.querySelector('[data-project-gallery]');
  if (!root || typeof ABST_PROJECT_GALLERIES === 'undefined') return;

  const data = ABST_PROJECT_GALLERIES[root.dataset.projectGallery];
  if (!data) return;

  const viewport = document.getElementById('project-carousel-track');
  if (viewport && typeof initSideCarousel !== 'undefined') {
    initSideCarousel(viewport, data.carousel || [], {
      prevBtn: document.getElementById('project-carousel-prev'),
      nextBtn: document.getElementById('project-carousel-next')
    });
  }

  const grid = document.getElementById('project-artworks-grid');
  renderGrid('project-artworks-grid', data.artworks, renderArtworkCard);
  if (grid) grid.artworkItems = data.artworks;
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderGrid(gridId, items, renderFn) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (!items || !items.length) {
    grid.innerHTML = `<p class="posts-empty">${isKoPage() ? '아직 게시물이 없습니다 — 곧 다시 확인해 주세요.' : 'Nothing here yet — check back soon.'}</p>`;
    return;
  }

  grid.innerHTML = items.map(renderFn || renderCard).join('');
}

function renderCard(item) {
  const ko = isKoPage();
  const metaLine = item.date
    ? `<time datetime="${item.date}">${formatDate(item.date)}</time>`
    : (item.meta ? `<span class="post-body-meta">${item.meta}</span>` : '');

  return `
    <a class="post-card" href="${item.url}">
      <div class="post-thumb" aria-hidden="true">${item.thumb ? `<img src="${item.thumb}" alt="" loading="lazy">` : `<span>${ko ? '이미지 준비 중' : 'Image placeholder'}</span>`}</div>
      <div class="post-body">
        <span class="post-tag">${item.tag}</span>
        <h3>${item.title}</h3>
        ${metaLine}
        <span class="read-more">${ko ? '더 보기 &rarr;' : 'Read more &rarr;'}</span>
      </div>
    </a>
  `;
}

function renderArtworkCard(item, index) {
  const ko = isKoPage();
  return `
    <button type="button" class="post-card artwork-card cursor-target" data-artwork-index="${index}">
      <div class="post-thumb" aria-hidden="true">${item.thumb ? `<img src="${item.thumb}" alt="" loading="lazy">` : `<span>${ko ? '이미지 준비 중' : 'Image placeholder'}</span>`}</div>
      <div class="post-body">
        <span class="post-tag">${ko ? '작품' : 'Artwork'}</span>
        <h3>${item.title}</h3>
        ${item.artist ? `<span class="post-body-meta">${item.artist}</span>` : ''}
        <span class="read-more">${ko ? '작품 보기 &rarr;' : 'View artwork &rarr;'}</span>
      </div>
    </button>
  `;
}

function initArtworkLightbox() {
  const grids = document.querySelectorAll('.posts-grid');
  if (!grids.length) return;

  let overlay = null;
  let mediaCarousel = null;

  function closeLightbox() {
    if (!overlay) return;
    if (mediaCarousel) {
      mediaCarousel.destroy();
      mediaCarousel = null;
    }
    overlay.remove();
    overlay = null;
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  function youtubeEmbedUrl(video) {
    if (!video) return '';
    const match = video.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
    const id = match ? match[1] : video;
    // youtube-nocookie.com throws error 153 ("video player configuration
    // error") for some videos/origins — the plain embed domain doesn't.
    return `https://www.youtube.com/embed/${id}`;
  }

  function openLightbox({ title, artist, image, images, video, description, artistPhotos }) {
    closeLightbox();

    const ko = isKoPage();
    const artistNames = (artist || '').split(',').map(n => n.trim()).filter(Boolean);
    const photos = artistPhotos && artistPhotos.length ? artistPhotos : [''];
    const photosHTML = photos.map((photo, i) => `
      <div class="artwork-lightbox-artist-photo">
        ${photo ? `<img src="${photo}" alt="${artistNames[i] || ''}">` : '<span>Artist photo placeholder</span>'}
      </div>
    `).join('');

    const slides = images && images.length ? images : (image ? [image] : []);
    const isCarousel = slides.length > 1;
    const mediaHTML = slides.length
      ? (isCarousel
        ? `
          <div class="artwork-lightbox-carousel">
            <div id="artwork-lightbox-carousel-track" class="artwork-lightbox-carousel-track"></div>
            <button type="button" id="artwork-lightbox-carousel-prev" class="artwork-lightbox-carousel-arrow artwork-lightbox-carousel-prev cursor-target" aria-label="${ko ? '이전 이미지' : 'Previous image'}">&larr;</button>
            <button type="button" id="artwork-lightbox-carousel-next" class="artwork-lightbox-carousel-arrow artwork-lightbox-carousel-next cursor-target" aria-label="${ko ? '다음 이미지' : 'Next image'}">&rarr;</button>
          </div>
        `
        : `<img src="${slides[0]}" alt="${title}">`)
      : '<span>Image placeholder</span>';

    const embedUrl = youtubeEmbedUrl(video);
    const videoHTML = embedUrl
      ? `
        <div class="artwork-lightbox-video">
          <iframe src="${embedUrl}" title="${title} — video" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `
      : '';

    overlay = document.createElement('div');
    overlay.className = 'artwork-lightbox';
    overlay.innerHTML = `
      <div class="artwork-lightbox-panel">
        <button type="button" class="artwork-lightbox-close cursor-target" aria-label="${ko ? '닫기' : 'Close'}">&times;</button>
        <div class="artwork-lightbox-media">${mediaHTML}</div>
        <div class="artwork-lightbox-sidebar">
          <div class="artwork-lightbox-body">
            <h3>${title}</h3>
            ${artist ? `<p class="artwork-lightbox-artist">${artist}</p>` : ''}
            ${description ? `<p class="artwork-lightbox-desc">${description}</p>` : ''}
          </div>
          ${videoHTML}
          <div class="artwork-lightbox-artist-photos">${photosHTML}</div>
        </div>
      </div>
    `;
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeLightbox();
    });
    overlay.querySelector('.artwork-lightbox-close').addEventListener('click', closeLightbox);

    document.body.appendChild(overlay);
    document.body.classList.add('lightbox-open');
    document.addEventListener('keydown', onKeydown);

    // Initialized only after the overlay is attached — initSideCarousel
    // reads viewport.clientWidth immediately to set the starting scroll
    // position, which is 0 (and so scrolls to the wrong slide) on a
    // detached element.
    if (isCarousel && typeof initSideCarousel !== 'undefined') {
      mediaCarousel = initSideCarousel(
        overlay.querySelector('#artwork-lightbox-carousel-track'),
        slides.map(src => ({ src, alt: title })),
        {
          prevBtn: overlay.querySelector('#artwork-lightbox-carousel-prev'),
          nextBtn: overlay.querySelector('#artwork-lightbox-carousel-next')
        }
      );
    }
  }

  grids.forEach(grid => {
    grid.addEventListener('click', e => {
      const card = e.target.closest('.artwork-card');
      if (!card) return;
      const items = grid.artworkItems;
      const item = items && items[card.dataset.artworkIndex];
      if (!item) return;
      openLightbox(item);
    });
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  return isKoPage()
    ? d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
