const TEMP_CA = 'CA coming soon';

document.querySelectorAll('[data-copy-ca]').forEach((button) => {
  button.addEventListener('click', async () => {
    const toast = document.querySelector('.toast');
    try {
      await navigator.clipboard.writeText(TEMP_CA);
      toast.textContent = 'Contract address is coming soon.';
    } catch {
      toast.textContent = 'Contract address is coming soon.';
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
