(() => {
  'use strict';
  const strip = document.getElementById('title-carousel');
  const cards = [...strip.querySelectorAll('.game-card')];
  const previous = document.querySelector('.title-arrow[data-direction="previous"]');
  const next = document.querySelector('.title-arrow[data-direction="next"]');
  const position = document.querySelector('.title-position');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nativeEnd = 'onscrollend' in strip;
  let timer;
  let moving = false;
  let requested = null;
  const visibleCount = () => Number(getComputedStyle(strip).getPropertyValue('--visible-titles')) || 1;
  const lastIndex = () => Math.max(0, cards.length - visibleCount());
  const maximum = () => Math.max(0, strip.scrollWidth - strip.clientWidth);
  // offsetLeft rounds each grid position. Measuring the actual card retains
  // fractional widths and avoids accumulating that rounding across the strip.
  function targetLeft(index) {
    const inset = parseFloat(getComputedStyle(strip).paddingLeft) || 0;
    const left = cards[index].getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft - inset;
    return Math.max(0, Math.min(maximum(), left));
  }
  function startIndex() {
    let closest = 0;
    let distance = Infinity;
    for (let index = 0; index <= lastIndex(); index += 1) {
      const difference = Math.abs(strip.scrollLeft - targetLeft(index));
      if (difference < distance) { closest = index; distance = difference; }
    }
    return closest;
  }
  function edges() {
    previous.disabled = strip.scrollLeft <= 2;
    next.disabled = strip.scrollLeft >= maximum() - 2;
  }
  function renderPosition() {
    const first = startIndex() + 1;
    const last = Math.min(cards.length, first + visibleCount() - 1);
    const label = `${first} - ${last}`;
    if (position.textContent !== label) position.textContent = label;
  }
  function settle() {
    if (requested !== null && Math.abs(strip.scrollLeft - targetLeft(requested)) > 2) return;
    moving = false;
    requested = null;
    clearTimeout(timer);
    edges();
    renderPosition();
  }
  function move(direction) {
    const index = requested === null ? startIndex() : requested;
    const target = Math.max(0, Math.min(lastIndex(), index + direction));
    const left = targetLeft(target);
    if (Math.abs(strip.scrollLeft - left) < 2) { settle(); return; }
    requested = target;
    moving = true;
    strip.scrollTo({ left, behavior: reduced.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  strip.addEventListener('keydown', event => {
    if (event.target !== strip) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  ['pointerdown', 'touchstart', 'wheel'].forEach(type => strip.addEventListener(type, () => { requested = null; }, { passive: true }));
  strip.addEventListener('scroll', () => {
    moving = true;
    edges();
    if (!nativeEnd) { clearTimeout(timer); timer = setTimeout(settle, 180); }
  }, { passive: true });
  if (nativeEnd) strip.addEventListener('scrollend', settle);
  new ResizeObserver(() => {
    requested = null;
    edges();
    if (!moving) renderPosition();
  }).observe(strip);
  edges();
  renderPosition();
})();
