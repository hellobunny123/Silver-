const TEMP_CA = '0x5D375C4c3809E8BAda0b8D818B359231384016dF';

const formatUsd = (value) => {
  if (!Number.isFinite(value)) return 'Unavailable';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const updateDexStats = async () => {
  const targets = {
    marketCap: document.querySelector('[data-dex-market-cap]'),
    liquidity: document.querySelector('[data-dex-liquidity]'),
    volume: document.querySelector('[data-dex-volume]'),
  };
  if (!targets.marketCap && !targets.liquidity && !targets.volume) return;

  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TEMP_CA}`);
    if (!response.ok) throw new Error('Dexscreener unavailable');
    const { pairs = [] } = await response.json();
    const pair = pairs.find((item) => item.chainId === 'robinhood') || pairs[0];
    if (!pair) throw new Error('Pair unavailable');
    if (targets.marketCap) targets.marketCap.textContent = formatUsd(Number(pair.marketCap ?? pair.fdv));
    if (targets.liquidity) targets.liquidity.textContent = formatUsd(Number(pair.liquidity?.usd));
    if (targets.volume) targets.volume.textContent = formatUsd(Number(pair.volume?.h24));
  } catch {
    Object.values(targets).forEach((target) => {
      if (target) target.textContent = 'View live ↗';
    });
  }
};

updateDexStats();

document.querySelectorAll('[data-copy-ca]').forEach((button) => {
  button.addEventListener('click', async () => {
    const toast = document.querySelector('.toast');
    try {
      await navigator.clipboard.writeText(TEMP_CA);
      toast.textContent = 'Contract copied.';
    } catch {
      toast.textContent = 'Contract copied.';
    }
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
  });
});

document.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
});

const menu = document.querySelector('.menu-button');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('.desktop-nav')?.classList.toggle('mobile-open', !expanded);
});

const mainVideo = document.querySelector('#main-video');
const soundToggle = document.querySelector('.sound-toggle');

soundToggle?.addEventListener('click', () => {
  if (!mainVideo) return;
  mainVideo.muted = !mainVideo.muted;
  mainVideo.volume = 0.75;
  soundToggle.setAttribute('aria-pressed', String(!mainVideo.muted));
  soundToggle.setAttribute('aria-label', mainVideo.muted ? 'Enable video sound' : 'Disable video sound');
  soundToggle.querySelector('span:last-child').textContent = mainVideo.muted ? 'Sound off' : 'Sound on';
  mainVideo.play().catch(() => {});
});

document.querySelectorAll('.reel-card').forEach((card) => {
  card.addEventListener('click', () => {
    if (!mainVideo) return;
    const source = mainVideo.querySelector('source');
    const preview = card.querySelector('img');
    const previousSource = mainVideo.dataset.src;
    const previousPoster = mainVideo.poster;
    const nextSource = card.dataset.videoSrc;
    const nextPoster = card.dataset.poster;

    mainVideo.pause();
    source.src = nextSource;
    mainVideo.dataset.src = nextSource;
    mainVideo.poster = nextPoster;
    card.dataset.videoSrc = previousSource;
    card.dataset.poster = previousPoster;
    preview.src = previousPoster;
    mainVideo.load();
    mainVideo.play().catch(() => {});
    mainVideo.closest('.video-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

const marquee = document.querySelector('.marquee-track');
const lightbox = document.querySelector('.image-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const closeLightbox = () => {
  lightbox?.classList.remove('open');
  lightbox?.setAttribute('aria-hidden', 'true');
  marquee?.classList.remove('is-paused');
};

document.querySelectorAll('.marquee-track img').forEach((image) => {
  image.setAttribute('tabindex', '0');
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', 'Open image');
  const openImage = () => {
    if (!lightbox || !lightboxImage) return;
    marquee?.classList.add('is-paused');
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.querySelector('.lightbox-close')?.focus();
  };
  image.addEventListener('click', openImage);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openImage();
    }
  });
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
});
