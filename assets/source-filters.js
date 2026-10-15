(() => {
  'use strict';
  const section = document.getElementById('sources');
  const query = document.getElementById('sources-search');
  const counter = document.getElementById('sources-counter');
  if (!section || !query || !counter) return;
  const normalize = text => text.replace(/\s+/g, ' ').trim().toLocaleLowerCase();
  const rows = [...section.querySelectorAll('.source-row')].map(element => ({
    element, text: normalize([...element.cells].map(cell => cell.textContent).join(' '))
  }));

  function refresh() {
    const text = normalize(query.value);
    let count = 0;
    rows.forEach(row => {
      row.element.hidden = Boolean(text) && !row.text.includes(text);
      if (!row.element.hidden) count += 1;
    });
    counter.textContent = `Displaying ${count} of ${rows.length} entries`;
  }
  // Citations must remain reachable even when Sources has an unrelated search.
  function revealTarget(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); }
    catch (_) { return; }
    const target = document.getElementById(id);
    const row = target?.closest('.source-row');
    if (row && section.contains(row) && row.hidden) {
      query.value = '';
      refresh();
    }
  }
  query.addEventListener('input', refresh);
  query.addEventListener('change', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('hashchange', () => revealTarget(location.hash));
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (link) revealTarget(link.hash);
  });
  refresh();
  revealTarget(location.hash);
})();
