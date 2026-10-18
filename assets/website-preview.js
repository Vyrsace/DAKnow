(() => {
  'use strict';
  const fields = [...document.querySelectorAll('#games .title-website')];
  if (!fields.length) return;
  const preview = document.createElement('div');
  preview.className = 'website-url-preview';
  preview.id = 'website-url-preview';
  preview.setAttribute('role', 'dialog');
  preview.setAttribute('aria-label', 'Official Website URL');
  preview.hidden = true;
  const url = document.createElement('a');
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.textContent = 'Copy URL';
  const status = document.createElement('span');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  preview.append(url, copy, status);
  document.body.append(preview);
  let active = null;
  let timer = null;

  function position() {
    if (!active || preview.hidden) return;
    const rectangle = active.getBoundingClientRect();
    const bounds = preview.getBoundingClientRect();
    preview.style.left = `${Math.max(12, Math.min(rectangle.left, document.documentElement.clientWidth - bounds.width - 12))}px`;
    const above = rectangle.top - bounds.height - 8;
    preview.style.top = `${above >= 12 ? above : Math.min(rectangle.bottom + 8, window.innerHeight - bounds.height - 12)}px`;
  }
  function hide() {
    window.clearTimeout(timer);
    active?.querySelector('button').setAttribute('aria-expanded', 'false');
    active = null;
    preview.hidden = true;
  }
  function show(field) {
    window.clearTimeout(timer);
    if (active !== field) hide();
    active = field;
    const link = field.querySelector('a');
    url.href = link.href;
    url.textContent = link.href;
    url.title = link.href;
    copy.textContent = 'Copy URL';
    copy.title = 'Copy website URL';
    status.textContent = '';
    field.querySelector('button').setAttribute('aria-expanded', 'true');
    preview.hidden = false;
    position();
  }
  function scheduleHide() {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!active?.matches(':hover') && !preview.matches(':hover') && !active?.contains(document.activeElement)
          && !preview.contains(document.activeElement)) hide();
    }, 180);
  }
  fields.forEach(field => {
    field.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch' && window.matchMedia('(hover: hover)').matches) show(field);
    });
    field.addEventListener('pointerleave', scheduleHide);
    field.addEventListener('focusin', () => show(field));
    field.addEventListener('focusout', scheduleHide);
    field.querySelector('button').addEventListener('click', () => {
      show(field);
      copy.focus({ preventScroll: true });
    });
  });
  preview.addEventListener('pointerenter', () => window.clearTimeout(timer));
  preview.addEventListener('pointerleave', scheduleHide);
  preview.addEventListener('focusout', scheduleHide);
  copy.addEventListener('click', async () => {
    const value = url.href;
    try {
      await navigator.clipboard.writeText(value);
      if (!preview.hidden && url.href === value) {
        copy.textContent = 'Copied';
        status.textContent = 'Website URL copied';
        position();
      }
    } catch (_) {
      copy.textContent = 'Copy failed';
      copy.title = 'Select the URL to copy it manually';
      status.textContent = 'Copy unavailable. Select the URL to copy it manually.';
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!preview.contains(event.target) && !active?.contains(event.target)) hide();
  });
  document.addEventListener('focusin', event => {
    if (!preview.contains(event.target) && !active?.contains(event.target)) hide();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || preview.hidden) return;
    const returnFocus = preview.contains(document.activeElement);
    const button = active?.querySelector('button');
    if (returnFocus) button?.focus({ preventScroll: true });
    hide();
    event.preventDefault();
  });
  document.addEventListener('scroll', event => {
    if (!active || event.target === preview || preview.contains(event.target)) return;
    const rectangle = active.getBoundingClientRect();
    if (rectangle.bottom < 0 || rectangle.top > window.innerHeight) hide();
    else position();
  }, true);
  window.addEventListener('resize', hide, { passive: true });
})();
