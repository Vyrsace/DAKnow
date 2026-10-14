/* Match Filename, Size and Notes lines when file-specific notes wrap. */
(() => {
  'use strict';
  const section = document.getElementById('downloads');
  if (!section) return;
  let pending = false;
  const align = () => {
    pending = false;
    section.querySelectorAll('.download-catalog-row').forEach(row => {
      if (!row.getClientRects().length) return;
      const groups = new Map();
      row.querySelectorAll('[data-download-line]').forEach(line => {
        line.style.minHeight = '';
        const key = line.dataset.downloadLine;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(line);
      });
      groups.forEach(lines => {
        const height = Math.max(...lines.map(line => line.getBoundingClientRect().height));
        lines.forEach(line => { line.style.minHeight = `${height}px`; });
      });
    });
  };
  const schedule = () => {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(align);
  };
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(section);
  new MutationObserver(schedule).observe(section, {
    subtree: true, attributes: true, attributeFilter: ['hidden', 'open']
  });
  window.addEventListener('resize', schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
  schedule();
})();
