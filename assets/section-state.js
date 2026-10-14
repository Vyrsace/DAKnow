(() => {
  'use strict';

  const key = 'daknow.sections.v1';
  const ids = ['catalog', 'downloads', 'hashes', 'verification', 'research', 'sources'];
  const cards = ids.map(id => ({
    id,
    element: document.getElementById(id)?.querySelector(':scope > details.collapsible-card')
  })).filter(card => card.element);
  let saved = {};
  try {
    const value = JSON.parse(sessionStorage.getItem(key));
    if (value && typeof value === 'object' && !Array.isArray(value)) saved = value;
  } catch (_) { /* Unavailable or invalid storage leaves the initial defaults usable. */ }

  cards.forEach(card => {
    card.element.open = Object.prototype.hasOwnProperty.call(saved, card.id) && typeof saved[card.id] === 'boolean'
      ? saved[card.id]
      : card.id === 'catalog';
  });

  function save() {
    try {
      sessionStorage.setItem(key, JSON.stringify(Object.fromEntries(cards.map(card => [card.id, card.element.open]))));
    } catch (_) { /* Sections remain operable when browser storage is unavailable. */ }
  }

  cards.forEach(card => card.element.addEventListener('toggle', save));
  // Snapshot even a toggle made immediately before refresh, before its event runs.
  window.addEventListener('pagehide', save);
})();
