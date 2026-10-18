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
  const favicon = document.createElement('img');
  favicon.className = 'website-url-favicon';
  favicon.alt = '';
  favicon.setAttribute('aria-hidden', 'true');
  const url = document.createElement('a');
  const urlText = document.createElement('span');
  urlText.className = 'website-url-text';
  function icon(path) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = `<path d="${path}"></path>`;
    return svg;
  }
  url.append(urlText, icon('M6 14 15 5M7 5h8v8'));
  const copy = document.createElement('button');
  copy.type = 'button';
  const copyPath = 'M7 6V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2M4 7h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z';
  const copyIcon = icon(copyPath);
  copy.append(copyIcon);
  function copyState(label, path = copyPath) {
    copy.setAttribute('aria-label', label);
    copy.title = label;
    copyIcon.innerHTML = `<path d="${path}"></path>`;
  }
  copyState('Copy URL');
  const status = document.createElement('span');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  preview.append(favicon, url, copy, status);
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
    favicon.src = link.dataset.websiteIcon;
    url.href = link.href;
    urlText.textContent = link.href;
    url.title = link.href;
    copyState('Copy URL');
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
        copyState('URL copied', 'M3 10 8 15 17 5');
        status.textContent = 'Website URL copied';
        position();
      }
    } catch (_) {
      if (!preview.hidden && url.href === value) {
        copyState('Copy failed. Select the URL to copy it manually.', 'M10 3v8M10 16v1');
        status.textContent = 'Copy unavailable. Select the URL to copy it manually.';
      }
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
