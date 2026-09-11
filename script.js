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
