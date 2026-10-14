(() => {
  'use strict';

  const button = document.getElementById('back-to-top');
  if (!button) return;
  const header = document.getElementById('top');
  const reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  function focusHeader() {
    if (header) header.focus({ preventScroll: true });
    if (button.contains(document.activeElement)) button.blur();
  }

  function refresh() {
    const hidden = window.scrollY <= 24;
    if (hidden && button.contains(document.activeElement)) focusHeader();
    button.hidden = hidden;
  }

  button.addEventListener('click', () => {
    focusHeader();
    window.scrollTo({
      top: 0,
      behavior: reducedMotion && reducedMotion.matches ? 'instant' : 'smooth'
    });
    refresh();
  });
  window.addEventListener('scroll', refresh, { passive: true });
  window.addEventListener('pageshow', refresh);
  refresh();
})();
