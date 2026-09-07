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

const galleries = {
  iqiyi: {
    title: '爱奇艺少儿与动漫频道',
    type: '实习项目 · 多端运营视觉',
    images: [
      ['assets/work/iqiyi-channels.webp', '动漫频道多入口视觉与首页资源位'],
      ['assets/work/iqiyi-kids.webp', '少儿频道内容焦点图与不同尺寸适配'],
      ['assets/work/iqiyi-mobile.webp', '移动端内容入口视觉与素材分析'],
      ['assets/work/iqiyi-ip.webp', 'IP 内容宣发与系列焦点图'],
    ],
  },
  muchun: {
    title: '牧淳羊乳品牌',
    type: '品牌设计 · 识别系统',
    images: [
      ['assets/work/muchun-cover.webp', '以牧羊形象为核心的品牌标志'],
      ['assets/work/muchun-ip.webp', '品牌 IP 角色设定与形象延展'],
      ['assets/work/muchun-poster.webp', '品牌海报与传播场景'],
      ['assets/work/muchun-outdoor.webp', '品牌户外广告应用'],
    ],
  },
  posters: {
    title: '传统文化海报系列',
    type: '海报设计 · 文化表达',
    images: [
      ['assets/work/poster-miaoheng.webp', '妙趣横生：汉字与诗词的系列化构成'],
      ['assets/work/poster-medicine.webp', '不要忘记：传统医药典籍主题海报'],
      ['assets/work/poster-qingming.webp', '清明：以几何字形重组节气意象'],
    ],
  },
  illustration: {
    title: '东方叙事视觉实验',
    type: '插画与字体 · 个人创作',
    images: [
      ['assets/work/illustration-concept.webp', '中国服饰系列插画：研究、草图与设定'],
      ['assets/work/illustration-aobi.webp', '角色同人插画与展览场景'],
      ['assets/work/typeface-set-a.webp', '中文字体造型与字义联想'],
      ['assets/work/typeface-set-b.webp', '动态质感与故障风格字体实验'],
    ],
  },
};

const dialog = document.querySelector('[data-gallery-dialog]');
const galleryTitle = document.querySelector('[data-gallery-title]');
const galleryType = document.querySelector('[data-gallery-type]');
const galleryImage = document.querySelector('[data-gallery-image]');
const galleryCaption = document.querySelector('[data-gallery-caption]');
const galleryCounter = document.querySelector('[data-gallery-counter]');
let activeGallery = null;
let galleryIndex = 0;

const renderGallery = () => {
  if (!activeGallery) return;
  const [src, caption] = activeGallery.images[galleryIndex];
  galleryTitle.textContent = activeGallery.title;
  galleryType.textContent = activeGallery.type;
  galleryImage.src = src;
  galleryImage.alt = caption;
  galleryCaption.textContent = caption;
  galleryCounter.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(activeGallery.images.length).padStart(2, '0')}`;
};

const openGallery = (galleryName) => {
  activeGallery = galleries[galleryName];
  if (!activeGallery || !dialog) return;
  galleryIndex = 0;
  renderGallery();
  dialog.showModal();
  document.body.classList.add('is-dialog-open');
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
  galleryIndex = (galleryIndex - 1 + activeGallery.images.length) % activeGallery.images.length;
  renderGallery();
});
document.querySelector('[data-gallery-next]')?.addEventListener('click', () => {
  galleryIndex = (galleryIndex + 1) % activeGallery.images.length;
  renderGallery();
});
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeGallery();
});
dialog?.addEventListener('close', () => document.body.classList.remove('is-dialog-open'));

document.addEventListener('keydown', (event) => {
  if (!dialog?.open || !activeGallery) return;
  if (event.key === 'ArrowLeft') {
    galleryIndex = (galleryIndex - 1 + activeGallery.images.length) % activeGallery.images.length;
    renderGallery();
  }
  if (event.key === 'ArrowRight') {
    galleryIndex = (galleryIndex + 1) % activeGallery.images.length;
    renderGallery();
  }
});
