(() => {
  'use strict';
  let targets = [];
  let timer = null;

  function clear() {
    window.clearTimeout(timer);
    targets.forEach(target => target.classList.remove('navigation-target'));
    targets = [];
  }
  function highlight(elements) {
    clear();
    targets = [...new Set(elements.filter(Boolean))];
    targets.forEach(target => target.classList.add('navigation-target'));
    if (targets.length) timer = window.setTimeout(clear, 3000);
  }
  function destination(target) {
    if (!target) return null;
    if (target.matches('.card-subsection')) return target;
    const row = target.closest('tr');
    if (row) return row;
    const frame = target.closest('.table-frame') || target.querySelector('.table-frame');
    if (frame && !target.matches('section, footer')) return frame;
    return target.matches('.collapsible-card, .verification-card, .contents, header') ? target
      : target.querySelector(':scope > .collapsible-card, :scope > .verification-card, :scope > .contents')
        || target.closest('.collapsible-card, .verification-card, .contents') || target;
  }
  function fromHash(hash) {
    try { return hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; }
    catch (_) { return null; }
  }
  function filterTargets(section) {
    return [...section.querySelectorAll('.table-frame')].filter(frame => !frame.closest('[hidden]'));
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    const target = link && fromHash(link.hash);
    if (target) {
      highlight(link.hasAttribute('data-version-region') && link.getAttribute('aria-current') === 'true'
        ? filterTargets(document.getElementById('catalog')) : [destination(target)]);
    } else if (event.target.closest('#back-to-top')) highlight([document.getElementById('top')]);
    else if (!targets.some(element => element.contains(event.target))) clear();
  });
  document.addEventListener('catalogfilteractivate', event => highlight(filterTargets(event.target)));
  window.addEventListener('hashchange', () => {
    const target = fromHash(location.hash);
    if (target && !targets.some(element => element.contains(target))) highlight([destination(target)]);
  });
  const initial = fromHash(location.hash);
  if (initial && location.hash !== '#top') highlight([destination(initial)]);
})();
