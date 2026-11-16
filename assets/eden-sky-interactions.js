/* Eden Sky — accessible interactions shared by desktop and mobile */
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (!header || !toggle || !nav) return;

  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const focusable = () => [...nav.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length > 0);

  const setMenu = (open, returnFocus = false) => {
    const isOpen = Boolean(open && mobileQuery.matches);
    nav.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    toggle.textContent = isOpen ? '×' : '☰';
    if (isOpen) {
      const first = focusable()[0];
      if (first) first.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('pointerdown', event => {
    if (mobileQuery.matches && toggle.getAttribute('aria-expanded') === 'true' &&
        !nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false, true);
    } else if (event.key === 'Tab') {
      const items = focusable();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  const syncLayout = () => {
    if (!mobileQuery.matches) setMenu(false);
  };
  if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', syncLayout);
  else mobileQuery.addListener(syncLayout);
  window.addEventListener('orientationchange', syncLayout);

  // Small, keyboard-accessible return-to-top control for long pages.
  const topButton = document.createElement('button');
  topButton.type = 'button';
  topButton.className = 'back-to-top';
  topButton.setAttribute('aria-label', 'Voltar ao topo');
  topButton.textContent = '↑';
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(topButton);
  const updateTopButton = () => topButton.classList.toggle('visible', window.scrollY > 420);
  window.addEventListener('scroll', updateTopButton, { passive: true });
  updateTopButton();
})();
