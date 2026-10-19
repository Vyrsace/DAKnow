(() => {
  'use strict';

  const key = 'daknow.sections.v1';
  const ids = ['catalog', 'downloads', 'research', 'hashes', 'sources'];
  const cards = ids.map(id => ({
    id,
    element: document.getElementById(id)?.querySelector(':scope > details.collapsible-card')
  })).filter(card => card.element);
  let saved = {};
  let printState = null;
  try {
    const value = JSON.parse(sessionStorage.getItem(key));
    if (value && typeof value === 'object' && !Array.isArray(value)) saved = value;
  } catch (_) { /* Unavailable or invalid storage leaves the initial defaults usable. */ }

  cards.forEach(card => {
    card.element.open = Object.prototype.hasOwnProperty.call(saved, card.id) && typeof saved[card.id] === 'boolean'
      ? saved[card.id]
      : false;
  });

  function save() {
    if (printState) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(Object.fromEntries(cards.map(card => [card.id, card.element.open]))));
    } catch (_) { /* Sections remain operable when browser storage is unavailable. */ }
  }

  cards.forEach(card => card.element.addEventListener('toggle', save));
  window.addEventListener('beforeprint', () => {
    if (printState) return;
    printState = cards.map(card => [card.element, card.element.open]);
    cards.forEach(card => { card.element.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (!printState) return;
    printState.forEach(([element, open]) => { element.open = open; });
    printState = null;
    save();
  });
  // Snapshot even a toggle made immediately before refresh, before its event runs.
  window.addEventListener('pagehide', save);
})();
