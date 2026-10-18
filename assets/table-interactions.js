(() => {
  'use strict';

  const frames = new Map();
  let pending = false;
  let gesture = null;
  let draggedWrapper = null;
  const interactive = 'a, button, input, select, textarea, summary, [contenteditable], [role="button"]';

  function clearSelection(wrapper) {
    const selection = window.getSelection();
    if (selection?.anchorNode && wrapper.contains(selection.anchorNode)) selection.removeAllRanges();
  }

  function refreshOverflow() {
    pending = false;
    frames.forEach(({ wrapper, frame }, table) => {
      wrapper.classList.toggle('is-scrollable', wrapper.clientWidth > 0 && wrapper.scrollWidth > wrapper.clientWidth + 1);
      const height = table.tHead?.getBoundingClientRect().height;
      if (height) frame.style.setProperty('--table-header-height', `${height}px`);
    });
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(refreshOverflow);
  }

  function setExpanded(table, expanded) {
    const entry = frames.get(table);
    if (!entry) return;
    entry.frame.classList.toggle('is-table-expanded', expanded);
    entry.button.setAttribute('aria-expanded', String(expanded));
    entry.button.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} ${entry.label}`);
    entry.button.title = entry.button.getAttribute('aria-label');
    entry.button.textContent = expanded ? '-' : '+';
    entry.wrapper.dispatchEvent(new Event('tabletoggle', { bubbles: true }));
    schedule();
  }

  document.querySelectorAll('.table-wrap > table').forEach((table, index) => {
    const wrapper = table.parentElement;
    const labelIds = (wrapper.getAttribute('aria-labelledby') || '').split(/\s+/);
    const label = wrapper.getAttribute('aria-label') || labelIds.map(id => document.getElementById(id)?.textContent.trim()).filter(Boolean).join(' ') || `table ${index + 1}`;
    const frame = document.createElement('div');
    frame.className = 'table-frame';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'table-toggle';
    const bodyIds = [...table.tBodies].map((body, bodyIndex) => {
      if (!body.id) body.id = `catalog-table-${index + 1}-body-${bodyIndex + 1}`;
      return body.id;
    });
    button.setAttribute('aria-controls', bodyIds.join(' '));
    wrapper.before(frame);
    frame.append(wrapper, button);
    frames.set(table, { frame, wrapper, button, label });
    button.addEventListener('click', () => setExpanded(table, button.getAttribute('aria-expanded') !== 'true'));
    setExpanded(table, false);
  });

  function revealTarget(hash) {
    let identifier;
    try { identifier = decodeURIComponent(hash.slice(1)); }
    catch (_) { return; }
    const target = identifier && document.getElementById(identifier);
    const table = target?.closest('table');
    if (table && (target === table || target.closest('tbody'))) setExpanded(table, true);
  }

  function finish(event) {
    if (!gesture || (event && event.pointerId !== gesture.pointerId)) return;
    const ended = gesture;
    gesture = null;
    if (ended.dragging) {
      draggedWrapper = ended.wrapper;
      clearSelection(ended.wrapper);
    }
    ended.wrapper.classList.remove('is-dragging');
    if (ended.wrapper.hasPointerCapture(ended.pointerId)) ended.wrapper.releasePointerCapture(ended.pointerId);
  }

  document.addEventListener('pointerdown', event => {
    draggedWrapper = null;
    if (!event.isPrimary || event.button !== 0 || event.altKey || gesture) return;
    const wrapper = event.target.closest('.table-wrap.is-scrollable');
    if (!wrapper || wrapper.scrollWidth <= wrapper.clientWidth + 1 || event.target.closest(interactive)) return;
    const bounds = wrapper.getBoundingClientRect();
    if (event.clientY >= bounds.bottom - Math.max(8, wrapper.offsetHeight - wrapper.clientHeight)) return;
    if (event.pointerType === 'mouse') {
      event.preventDefault();
      wrapper.focus({ preventScroll: true });
    }
    gesture = { wrapper, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      startLeft: wrapper.scrollLeft, dragging: false };
  });

  document.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const horizontal = event.clientX - gesture.startX;
    const vertical = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.max(Math.abs(horizontal), Math.abs(vertical)) < 8) return;
      if (Math.abs(vertical) >= Math.abs(horizontal)) { finish(event); return; }
      gesture.dragging = true;
      gesture.wrapper.classList.add('is-dragging');
      gesture.wrapper.setPointerCapture(event.pointerId);
      clearSelection(gesture.wrapper);
    }
    event.preventDefault();
    gesture.wrapper.scrollLeft = Math.max(0, Math.min(gesture.wrapper.scrollWidth - gesture.wrapper.clientWidth, gesture.startLeft - horizontal));
  }, { passive: false });

  document.addEventListener('lostpointercapture', event => {
    if (gesture && event.target === gesture.wrapper) finish(event);
  });
  document.addEventListener('click', event => {
    if (!draggedWrapper || event.detail === 0 || !draggedWrapper.contains(event.target)) return;
    clearSelection(draggedWrapper);
    draggedWrapper = null;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (link) revealTarget(link.hash);
  }, true);
  window.addEventListener('pointerup', finish, true);
  window.addEventListener('pointercancel', finish, true);
  window.addEventListener('blur', () => finish());
  window.addEventListener('resize', () => { finish(); schedule(); }, { passive: true });
  window.addEventListener('hashchange', () => revealTarget(location.hash));
  document.addEventListener('toggle', schedule, true);
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(schedule);
    frames.forEach(({ wrapper }, table) => { observer.observe(wrapper); observer.observe(table); });
  }
  new MutationObserver(schedule).observe(document.querySelector('main'), {
    subtree: true, attributes: true, attributeFilter: ['hidden', 'open']
  });
  if (document.fonts) document.fonts.ready.then(schedule);
  if (performance.getEntriesByType('navigation')[0]?.type !== 'reload') revealTarget(location.hash);
  schedule();
})();
