(() => {
  'use strict';

  const section = document.getElementById('research-notes');
  const query = document.getElementById('research-search');
  const counter = document.getElementById('research-counter');
  if (!section || !query || !counter) return;

  const normalize = text => text.replace(/\s+/g, ' ').trim().toLocaleLowerCase();
  const groups = [...section.querySelectorAll('.evidence-region')].map(element => ({
    element,
    bodies: [...element.querySelectorAll('tbody')].map(element => ({
      element,
      rows: [...element.querySelectorAll('.research-row')].map(element => ({
        element,
        text: normalize([...element.cells].map(cell => cell.textContent).join(' '))
      }))
    }))
  }));
  const total = groups.reduce((count, group) => count + group.bodies.reduce((sum, body) => sum + body.rows.length, 0), 0);

  function refresh() {
    const text = normalize(query.value);
    let count = 0;
    groups.forEach(group => {
      let groupCount = 0;
      group.bodies.forEach(body => {
        let bodyCount = 0;
        body.rows.forEach(row => {
          const visible = !text || row.text.includes(text);
          row.element.hidden = !visible;
          if (visible) bodyCount += 1;
        });
        body.element.hidden = bodyCount === 0;
        groupCount += bodyCount;
      });
      // Hide the title, headers and wrapper together when a table has no matches.
      group.element.hidden = groupCount === 0;
      count += groupCount;
    });
    counter.textContent = `Displaying ${count} of ${total} entries`;
  }

  function revealTarget(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); }
    catch (_) { return; }
    const target = document.getElementById(id);
    if (!target || !section.contains(target)) return;
    const group = target.closest('.evidence-region');
    const row = target.closest('.research-row');
    if ((group && group.hidden) || (row && row.hidden)) {
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
