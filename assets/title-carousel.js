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
  let gesture = null;
  let suppressClick = false;
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
    const label = first === last ? String(first) : `${first} - ${last}`;
    if (position.textContent !== label) position.textContent = label;
  }
  function settle() {
    if (gesture?.dragging) return;
    if (requested !== null && Math.abs(strip.scrollLeft - targetLeft(requested)) > 2) return;
    moving = false;
    requested = null;
    clearTimeout(timer);
    edges();
    renderPosition();
  }
  function select(index) {
    const target = Math.max(0, Math.min(lastIndex(), index));
    const left = targetLeft(target);
    if (Math.abs(strip.scrollLeft - left) < 2) { settle(); return; }
    requested = target;
    moving = true;
    strip.scrollTo({ left, behavior: reduced.matches ? 'instant' : 'smooth' });
  }
  function move(direction) {
    select((requested === null ? startIndex() : requested) + direction);
  }

  function finishGesture(event, canceled = false) {
    if (!gesture || (event && event.pointerId !== gesture.pointerId)) return;
    const ended = gesture;
    gesture = null;
    let target = ended.startIndex;
    if (ended.dragging) {
      const distance = (event?.clientX ?? ended.lastX) - ended.startX;
      const threshold = Math.max(36, Math.min(96, cards[0].getBoundingClientRect().width * 0.15));
      if (!canceled && Math.abs(distance) >= threshold) {
        const nearest = startIndex();
        target = distance < 0 ? Math.max(nearest, target + 1) : Math.min(nearest, target - 1);
      }
      suppressClick = true;
    }
    strip.classList.remove('is-dragging');
    if (strip.hasPointerCapture(ended.pointerId)) strip.releasePointerCapture(ended.pointerId);
    if (ended.dragging) select(target);
  }
  function pointerDown(event) {
    if (event.pointerType === 'touch') {
      suppressClick = false;
      return;
    }
    if (!event.isPrimary || event.button !== 0 || gesture) return;
    suppressClick = false;
    // Each image gallery owns its gesture; links and controls keep normal clicks.
    if (maximum() <= 2 || event.target.closest('a, button, input, select, textarea, summary, [contenteditable], [data-title-gallery]')) return;
    gesture = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      lastX: event.clientX, startLeft: strip.scrollLeft, startIndex: startIndex(), dragging: false };
  }
  function pointerMove(event) {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    gesture.lastX = event.clientX;
    const distance = event.clientX - gesture.startX;
    const vertical = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.max(Math.abs(distance), Math.abs(vertical)) < 8) return;
      if (Math.abs(vertical) >= Math.abs(distance)) {
        gesture = null;
        return;
      }
      gesture.startLeft = strip.scrollLeft;
      gesture.startIndex = startIndex();
      gesture.dragging = true;
      requested = null;
      clearTimeout(timer);
      strip.classList.add('is-dragging');
      strip.scrollTo({ left: gesture.startLeft, behavior: 'instant' });
      strip.setPointerCapture(event.pointerId);
      const selection = window.getSelection();
      if (selection?.anchorNode && strip.contains(selection.anchorNode)) selection.removeAllRanges();
    }
    event.preventDefault();
    strip.scrollTo({ left: Math.max(0, Math.min(maximum(), gesture.startLeft - distance)), behavior: 'instant' });
  }
  strip.addEventListener('pointerdown', pointerDown);
  strip.addEventListener('pointermove', pointerMove);
  function finishTouch() {
    strip.classList.remove('is-touch-panning');
  }
  strip.addEventListener('touchstart', event => {
    requested = null;
    strip.classList.toggle('is-touch-panning', event.touches.length === 1 && !event.target.closest('[data-title-gallery]'));
  }, { passive: true });
  strip.addEventListener('touchend', finishTouch, { passive: true });
  strip.addEventListener('touchcancel', finishTouch, { passive: true });
  strip.addEventListener('lostpointercapture', event => {
    // Ignore capture transfers from descendants during a touch/pen gesture.
    if (event.target === strip) finishGesture(event, true);
  });
  strip.addEventListener('click', event => {
    if (!suppressClick || event.detail === 0) return;
    suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  window.addEventListener('pointerup', event => finishGesture(event), true);
  window.addEventListener('pointercancel', event => finishGesture(event, true), true);
  window.addEventListener('resize', () => { finishGesture(null, true); finishTouch(); }, { passive: true });
  window.addEventListener('blur', () => { finishGesture(null, true); finishTouch(); });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  strip.addEventListener('keydown', event => {
    if (event.target !== strip) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  ['pointerdown', 'wheel'].forEach(type => strip.addEventListener(type, () => { requested = null; }, { passive: true }));
  strip.addEventListener('scroll', () => {
    moving = true;
    edges();
    if (!nativeEnd) { clearTimeout(timer); timer = setTimeout(settle, 180); }
  }, { passive: true });
  if (nativeEnd) strip.addEventListener('scrollend', settle);
  new ResizeObserver(() => {
    requested = null;
    edges();
    renderPosition();
  }).observe(strip);
  edges();
  renderPosition();
})();
