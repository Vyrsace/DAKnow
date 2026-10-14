(() => {
  'use strict';

  const section = document.getElementById('downloads');
  const query = document.getElementById('downloads-search');
  if (!section || !query) return;
  const rows = [...section.querySelectorAll('.download-catalog-row')];
  const groups = [...section.querySelectorAll('.download-region')];
  const counter = document.getElementById('downloads-counter');
  const activeFilters = document.getElementById('downloads-active-filters');
  const empty = document.getElementById('downloads-empty');
  const collator = new Intl.Collator(document.documentElement.lang || 'en', { numeric: true });
  const sourceEntries = new Map();
  let data = {};
  try { data = JSON.parse(document.getElementById('catalog-data').textContent); }
  catch (_) { /* Rendered rows remain the fallback; malformed data invents no choices. */ }

  function indexEntries(entries, parent = {}) {
    (entries || []).forEach(entry => {
      const record = {
        ...entry,
        country: entry.country || parent.country || '',
        game_title: entry.game_title || parent.game_title || ''
      };
      sourceEntries.set(entry.id, record);
      indexEntries(entry.children, record);
    });
  }
  indexEntries(data.masters);
  indexEntries(data.unnumbered);

  const entriesByRow = new Map(rows.map(row => {
    const source = sourceEntries.get(row.dataset.entryId) || {};
    const heading = row.closest('.download-region').querySelector('h3').textContent.trim();
    const separator = heading.lastIndexOf(' — ');
    const region = source.country || (separator < 0 ? '' : heading.slice(separator + 3));
    const title = source.game_title || (separator < 0 ? heading : heading.slice(0, separator));
    const version = row.querySelector('.download-version > span').textContent.trim();
    const type = row.dataset.recordType || source.type || '';
    const filename = row.querySelector('.download-filename').textContent;
    const notes = row.querySelector('.download-notes').textContent;
    return [row, {
      region, title, version, type,
      search: [version, filename, notes, region, title, type].join(' ').toLocaleLowerCase()
    }];
  }));
  const entries = [...entriesByRow.values()];
  let renderedSearch = null;
  const facets = [
    { id: 'region', field: 'region', all: 'All Countries', empty: 'No matching countries' },
    { id: 'title', field: 'title', all: 'All Titles', empty: 'No matching titles' },
    { id: 'version', field: 'version', all: 'All versions', empty: 'No matching versions' },
    { id: 'type', field: 'type', all: 'Clients and patches', empty: 'No matching types' }
  ].map(facet => ({
    ...facet,
    element: document.getElementById(`downloads-filter-${facet.id}`),
    label: document.getElementById(`downloads-filter-${facet.id}-label`).textContent,
    selected: new Set(),
    optionIds: new Map()
  }));

  function sortValues(facet, values) {
    return values.sort((a, b) => {
      if (facet.id === 'version') {
        if (a === '?' && b !== '?') return 1;
        if (b === '?' && a !== '?') return -1;
      }
      if (facet.id === 'type') {
        const priorities = ['Client', 'Patch'];
        const difference = priorities.indexOf(a) - priorities.indexOf(b);
        if (difference) return difference;
      }
      return collator.compare(a, b);
    });
  }

  const searchText = () => query.value.trim().toLocaleLowerCase();
  const matches = (entry, text, omittedFacet) => (!text || entry.search.includes(text)) && facets.every(facet =>
    facet === omittedFacet || !facet.selected.size || facet.selected.has(entry[facet.field])
  );

  function refreshOptions(text) {
    const focused = document.activeElement;
    const focusedFilter = focused && focused.dataset.downloadFilter;
    const focusedValue = focused && focused.dataset.value;
    facets.forEach(facet => {
      const available = new Set(entries.filter(entry => matches(entry, text, facet))
        .map(entry => entry[facet.field]).filter(value => value !== ''));
      const values = sortValues(facet, [...new Set([...available, ...facet.selected])]);
      const fragment = document.createDocumentFragment();
      values.forEach(value => {
        if (!facet.optionIds.has(value)) {
          facet.optionIds.set(value, `downloads-${facet.id}-option-${facet.optionIds.size + 1}`);
        }
        const label = document.createElement('label');
        label.className = 'filter-option';
        if (!available.has(value)) label.classList.add('is-unavailable');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = facet.optionIds.get(value);
        input.name = `downloads-${facet.id}`;
        input.value = value;
        input.checked = facet.selected.has(value);
        input.dataset.downloadFilter = facet.id;
        input.dataset.value = value;
        label.htmlFor = input.id;
        const name = document.createElement('span');
        name.className = 'filter-option-label';
        name.textContent = value;
        label.append(input, name);
        if (!available.has(value)) {
          const hint = document.createElement('span');
          hint.className = 'filter-option-hint';
          hint.textContent = 'No matches';
          label.append(hint);
        }
        fragment.append(label);
      });
      if (!values.length) {
        const message = document.createElement('p');
        message.className = 'filter-empty';
        message.textContent = facet.empty;
        fragment.append(message);
      }
      facet.element.querySelector('.filter-options').replaceChildren(fragment);
      const selected = [...facet.selected];
      facet.element.querySelector('.filter-value').textContent = !selected.length ? facet.all
        : selected.length === 1 ? selected[0] : `${selected.length} selected`;
      facet.element.classList.toggle('has-selection', facet.selected.size > 0);
      facet.element.querySelector('.filter-clear').disabled = !facet.selected.size;
    });
    // Cascading option replacement must preserve keyboard checkbox focus.
    if (focusedFilter && focusedValue !== undefined) {
      const facet = facets.find(item => item.id === focusedFilter);
      const id = facet && facet.optionIds.get(focusedValue);
      const replacement = id && document.getElementById(id);
      if (replacement) replacement.focus({ preventScroll: true });
    }
  }

  function refreshBadges() {
    const focused = document.activeElement;
    const focusedFacet = focused && focused.classList.contains('filter-chip') && focused.dataset.downloadFacet;
    const focusedValue = focusedFacet && focused.dataset.value;
    const fragment = document.createDocumentFragment();
    let replacement = null;
    facets.forEach(facet => {
      sortValues(facet, [...facet.selected]).forEach(value => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'filter-chip';
        button.dataset.downloadFacet = facet.id;
        button.dataset.value = value;
        button.setAttribute('aria-label', `Remove ${facet.label} filter: ${value}`);
        const category = document.createElement('span');
        category.className = 'filter-chip-category';
        category.textContent = `${facet.label}:`;
        const name = document.createElement('span');
        name.textContent = value;
        const remove = document.createElement('span');
        remove.className = 'filter-chip-remove';
        remove.textContent = '×';
        remove.setAttribute('aria-hidden', 'true');
        button.append(category, name, remove);
        fragment.append(button);
        if (focusedFacet === facet.id && focusedValue === value) replacement = button;
      });
    });
    activeFilters.replaceChildren(fragment);
    if (replacement) replacement.focus({ preventScroll: true });
  }

  function refresh() {
    const text = searchText();
    renderedSearch = text;
    refreshOptions(text);
    let visibleCount = 0;
    rows.forEach(row => {
      row.hidden = !matches(entriesByRow.get(row), text);
      if (!row.hidden) visibleCount += 1;
    });
    groups.forEach(group => {
      group.hidden = ![...group.querySelectorAll('.download-catalog-row')].some(row => !row.hidden);
    });
    counter.textContent = `Displaying ${visibleCount} of ${rows.length} entries`;
    empty.hidden = visibleCount > 0;
    refreshBadges();
  }

  function resetFilters() {
    query.value = '';
    facets.forEach(facet => {
      facet.selected.clear();
      facet.element.open = false;
    });
    refresh();
  }

  facets.forEach(facet => {
    facet.element.addEventListener('change', event => {
      const input = event.target;
      if (input.tagName !== 'INPUT' || input.type !== 'checkbox') return;
      if (input.checked) facet.selected.add(input.value);
      else facet.selected.delete(input.value);
      refresh();
    });
    facet.element.querySelector('.filter-clear').addEventListener('click', () => {
      facet.selected.clear();
      refresh();
    });
    facet.element.addEventListener('toggle', () => {
      if (facet.element.open) facets.forEach(other => {
        if (other !== facet) other.element.open = false;
      });
    });
  });

  activeFilters.addEventListener('click', event => {
    const button = event.target.closest('.filter-chip');
    if (!button || !activeFilters.contains(button)) return;
    const facet = facets.find(item => item.id === button.dataset.downloadFacet);
    if (!facet) return;
    const index = [...activeFilters.querySelectorAll('.filter-chip')].indexOf(button);
    facet.selected.delete(button.dataset.value);
    refresh();
    const remaining = [...activeFilters.querySelectorAll('.filter-chip')];
    const target = remaining[Math.min(index, remaining.length - 1)] || facet.element.querySelector('summary');
    target.focus({ preventScroll: true });
  });
  document.getElementById('downloads-reset-filters').addEventListener('click', resetFilters);
  query.addEventListener('input', refresh);
  query.addEventListener('change', () => {
    if (searchText() !== renderedSearch) refresh();
  });
  document.addEventListener('click', event => {
    facets.forEach(facet => {
      if (!facet.element.contains(event.target)) facet.element.open = false;
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = facets.find(facet => facet.element.open);
    if (!open) return;
    open.element.open = false;
    open.element.querySelector('summary').focus();
    event.preventDefault();
  });
  document.addEventListener('focusin', event => {
    facets.forEach(facet => {
      if (facet.element.open && !facet.element.contains(event.target)) facet.element.open = false;
    });
  });

  function revealHashTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); }
    catch (_) { return; }
    const target = id && document.getElementById(id);
    if (!target || !section.contains(target)) return;
    const row = target.closest('.download-catalog-row');
    const group = target.closest('.download-region');
    if ((row && row.hidden) || (group && group.hidden)) {
      resetFilters();
      section.querySelector(':scope > details.collapsible-card').open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  }
  window.addEventListener('pageshow', refresh);
  window.addEventListener('hashchange', revealHashTarget);
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!event.defaultPrevented && anchor && anchor.hash === location.hash) revealHashTarget();
  });
  refresh();
  revealHashTarget();
})();
