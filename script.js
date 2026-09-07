const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '打开导航' : '关闭导航');
  nav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('is-menu-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', '打开导航');
    nav.classList.remove('is-open');
    document.body.classList.remove('is-menu-open');
  });
});

const heroSlides = [...document.querySelectorAll('[data-hero-slide]')];
const slideCount = document.querySelector('[data-slide-count]');
const stageProgress = document.querySelector('[data-stage-progress]');
let heroIndex = 0;
let heroTimer;

const showHeroSlide = (nextIndex) => {
  heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === heroIndex));
  if (slideCount) slideCount.textContent = `${String(heroIndex + 1).padStart(2, '0')} / ${String(heroSlides.length).padStart(2, '0')}`;
  if (stageProgress) stageProgress.style.width = `${((heroIndex + 1) / heroSlides.length) * 100}%`;
};

const restartHeroTimer = () => {
  window.clearInterval(heroTimer);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroTimer = window.setInterval(() => showHeroSlide(heroIndex + 1), 5200);
  }
};

document.querySelector('[data-slide-prev]')?.addEventListener('click', () => {
  showHeroSlide(heroIndex - 1);
  restartHeroTimer();
});
document.querySelector('[data-slide-next]')?.addEventListener('click', () => {
  showHeroSlide(heroIndex + 1);
  restartHeroTimer();
});
restartHeroTimer();

const lifeCarousel = document.querySelector('[data-life-carousel]');
const lifeSlides = [...document.querySelectorAll('[data-life-slide]')];
const lifeDots = [...document.querySelectorAll('[data-life-dot]')];
let lifeIndex = 0;
let lifeTimer;
let lifeTouchStart = null;

const showLifeSlide = (nextIndex) => {
  lifeIndex = (nextIndex + lifeSlides.length) % lifeSlides.length;
  lifeSlides.forEach((slide, index) => {
    const active = index === lifeIndex;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  lifeDots.forEach((dot, index) => {
    const active = index === lifeIndex;
    dot.classList.toggle('is-active', active);
    if (active) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
};

const stopLifeTimer = () => window.clearInterval(lifeTimer);
const startLifeTimer = () => {
  stopLifeTimer();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lifeTimer = window.setInterval(() => showLifeSlide(lifeIndex + 1), 5000);
  }
};

document.querySelector('[data-life-prev]')?.addEventListener('click', () => {
  showLifeSlide(lifeIndex - 1);
  startLifeTimer();
});
document.querySelector('[data-life-next]')?.addEventListener('click', () => {
  showLifeSlide(lifeIndex + 1);
  startLifeTimer();
});
lifeDots.forEach((dot) => dot.addEventListener('click', () => {
  showLifeSlide(Number(dot.dataset.lifeDot));
  startLifeTimer();
}));
lifeCarousel?.addEventListener('mouseenter', stopLifeTimer);
lifeCarousel?.addEventListener('mouseleave', startLifeTimer);
lifeCarousel?.addEventListener('focusin', stopLifeTimer);
lifeCarousel?.addEventListener('focusout', startLifeTimer);
lifeCarousel?.addEventListener('pointermove', (event) => {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const rect = lifeCarousel.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  lifeCarousel.style.setProperty('--life-rx', `${-y * 2.5}deg`);
  lifeCarousel.style.setProperty('--life-ry', `${x * 3}deg`);
});
lifeCarousel?.addEventListener('pointerleave', () => {
  lifeCarousel.style.setProperty('--life-rx', '0deg');
  lifeCarousel.style.setProperty('--life-ry', '0deg');
});
lifeCarousel?.addEventListener('touchstart', (event) => {
  lifeTouchStart = event.touches[0]?.clientX ?? null;
}, { passive: true });
lifeCarousel?.addEventListener('touchend', (event) => {
  if (lifeTouchStart == null) return;
  const distance = (event.changedTouches[0]?.clientX ?? lifeTouchStart) - lifeTouchStart;
  if (Math.abs(distance) > 45) showLifeSlide(lifeIndex + (distance < 0 ? 1 : -1));
  lifeTouchStart = null;
  startLifeTimer();
}, { passive: true });
startLifeTimer();

const createPages = (folder, start, end, captions = {}) =>
  Array.from({ length: end - start + 1 }, (_, offset) => {
    const page = start + offset;
    const pageLabel = String(page).padStart(2, '0');
    return [
      `assets/gallery/${folder}/page-${pageLabel}.webp`,
      captions[page] || `作品集第 ${pageLabel} 页`,
    ];
  });

const galleries = {
  iqiyi: {
    title: '爱奇艺少儿与动漫频道',
    type: '实习项目 · 多端运营视觉',
    images: createPages('iqiyi', 57, 62, {
      57: '动漫频道多入口视觉与首页资源位',
      59: '少儿频道内容焦点图与不同尺寸适配',
      60: '移动端内容入口视觉与素材分析',
      61: 'IP 内容宣发与系列焦点图',
      62: '视频剪辑与内容制作',
    }),
  },
  muchun: {
    title: '牧淳羊乳品牌',
    type: '品牌设计 · 识别系统',
    images: createPages('muchun', 4, 25, {
      4: '以牧羊形象为核心的品牌标志',
      5: '品牌背景与设计过程',
      14: '品牌 IP 角色设定与形象延展',
      16: '品牌海报与传播场景',
      17: '品牌户外广告应用',
      19: '产品包装系统',
      25: '品牌名片与办公物料',
    }),
  },
  posters: {
    title: '传统文化海报系列',
    type: '海报设计 · 文化表达',
    images: createPages('posters', 27, 39, {
      27: '妙趣横生：汉字与诗词的系列化构成',
      31: '不要忘记：传统医药典籍主题海报',
      36: '清明：以几何字形重组节气意象',
    }),
  },
  illustration: {
    title: '东方叙事视觉实验',
    type: '插画与字体 · 个人创作',
    images: createPages('illustration', 41, 55, {
      41: '中国服饰系列插画：研究、草图与设定',
      47: '角色同人插画创作',
      51: '中文字体造型与字义联想',
      53: '插画展览场景应用',
      55: '动态质感与故障风格字体实验',
    }),
  },
};

const dialog = document.querySelector('[data-gallery-dialog]');
const galleryTitle = document.querySelector('[data-gallery-title]');
const galleryType = document.querySelector('[data-gallery-type]');
const galleryScroll = document.querySelector('[data-gallery-scroll]');
const galleryPages = document.querySelector('[data-gallery-pages]');
const galleryCaption = document.querySelector('[data-gallery-caption]');
const galleryCounter = document.querySelector('[data-gallery-counter]');
let activeGallery = null;
let galleryIndex = 0;

const renderGallery = () => {
  if (!activeGallery) return;
  galleryTitle.textContent = activeGallery.title;
  galleryType.textContent = activeGallery.type;
  galleryPages.replaceChildren(
    ...activeGallery.images.map(([src, caption], index) => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      const figcaption = document.createElement('figcaption');
      const pageNumber = document.createElement('span');
      const pageCaption = document.createElement('span');

      figure.className = 'gallery-page';
      figure.dataset.galleryPage = String(index);
      image.src = src;
      image.alt = caption;
      image.loading = 'eager';
      image.width = 1600;
      image.height = 900;
      pageNumber.textContent = `${String(index + 1).padStart(2, '0')} / ${String(activeGallery.images.length).padStart(2, '0')}`;
      pageCaption.textContent = caption;
      figcaption.append(pageNumber, pageCaption);
      figure.append(image, figcaption);
      return figure;
    }),
  );
  galleryCounter.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(activeGallery.images.length).padStart(2, '0')}`;
  galleryCaption.textContent = activeGallery.images[galleryIndex][1];
};

const showGalleryPage = (nextIndex, behavior = 'smooth') => {
  if (!activeGallery) return;
  galleryIndex = (nextIndex + activeGallery.images.length) % activeGallery.images.length;
  const page = galleryPages.querySelector(`[data-gallery-page="${galleryIndex}"]`);
  galleryCounter.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(activeGallery.images.length).padStart(2, '0')}`;
  galleryCaption.textContent = activeGallery.images[galleryIndex][1];
  page.scrollIntoView({ behavior, block: 'start' });
};

const openGallery = (galleryName) => {
  activeGallery = galleries[galleryName];
  if (!activeGallery || !dialog) return;
  galleryIndex = 0;
  renderGallery();
  dialog.showModal();
  document.body.classList.add('is-dialog-open');
  requestAnimationFrame(() => {
    galleryScroll.scrollTop = 0;
    galleryScroll.focus({ preventScroll: true });
  });
};

const closeGallery = () => {
  dialog?.close();
  document.body.classList.remove('is-dialog-open');
};

document.querySelectorAll('[data-gallery]').forEach((button) => {
  button.addEventListener('click', () => openGallery(button.dataset.gallery));
});
document.querySelector('[data-gallery-close]')?.addEventListener('click', closeGallery);
document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => {
  showGalleryPage(galleryIndex - 1);
});
document.querySelector('[data-gallery-next]')?.addEventListener('click', () => {
  showGalleryPage(galleryIndex + 1);
});
let galleryScrollFrame;
galleryScroll?.addEventListener('scroll', () => {
  window.cancelAnimationFrame(galleryScrollFrame);
  galleryScrollFrame = window.requestAnimationFrame(() => {
    if (!activeGallery) return;
    const pages = [...galleryPages.querySelectorAll('[data-gallery-page]')];
    const scrollRect = galleryScroll.getBoundingClientRect();
    const readingLine = scrollRect.top + Math.min(80, galleryScroll.clientHeight * 0.15);
    galleryIndex = pages.reduce(
      (current, page, index) => (page.getBoundingClientRect().top <= readingLine ? index : current),
      0,
    );
    galleryCounter.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(activeGallery.images.length).padStart(2, '0')}`;
    galleryCaption.textContent = activeGallery.images[galleryIndex][1];
  });
}, { passive: true });
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeGallery();
});
dialog?.addEventListener('close', () => document.body.classList.remove('is-dialog-open'));

document.addEventListener('keydown', (event) => {
  if (!dialog?.open || !activeGallery) return;
  if (event.key === 'ArrowLeft') {
    showGalleryPage(galleryIndex - 1);
  }
  if (event.key === 'ArrowRight') {
    showGalleryPage(galleryIndex + 1);
  }
});
