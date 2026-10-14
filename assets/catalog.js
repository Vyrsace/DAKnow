(() => {
  document.querySelectorAll('a[data-hosted-placeholder="true"]').forEach(link => {
    link.addEventListener('click', event => {
      if (link.getAttribute('href') !== '#downloads') return;
      event.preventDefault();
      event.stopPropagation();
    });
  });
  const table = document.getElementById('master-catalog');
  const body = table.tBodies[0];
  const originalRows = [...body.querySelectorAll('.master-row')];
  const originalOrder = new Map(originalRows.map((row, index) => [row, index]));
  const buttons = [...table.querySelectorAll('.sort-button')];
  const status = document.getElementById('sort-status');
  const reset = document.getElementById('reset-sort');
  const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  const labels = { version: 'Version', region: 'Region', title: 'Title', date: 'Release Date' };
  let levels = [];

  function value(row, key) {
    if (key === 'date') return row.dataset.sortDate || '';
    if (key === 'region') return row.dataset.region || '';
    if (key === 'title') return row.dataset.title || '';
    const version = row.querySelector('td.version').textContent.trim();
    return /^\d/.test(version) ? version : '';
  }

  function compare(a, b) {
    for (const level of levels) {
      const left = value(a, level.key);
      const right = value(b, level.key);
      // Undocumented dates and unnumbered versions stay at the end in either direction.
      if (!left && right) return 1;
      if (left && !right) return -1;
      const difference = collator.compare(left, right);
      if (difference) return difference * (level.direction === 'asc' ? 1 : -1);
    }
    return originalOrder.get(a) - originalOrder.get(b);
  }

  function render() {
    const fragment = document.createDocumentFragment();
    [...originalRows].sort(compare).forEach(row => fragment.append(row));
    body.append(fragment);
    buttons.forEach(button => {
      const index = levels.findIndex(level => level.key === button.dataset.sort);
      const level = levels[index];
      const heading = button.closest('th');
      heading.setAttribute('aria-sort', index < 0 ? 'none' : index > 0 ? 'other' : level.direction === 'asc' ? 'ascending' : 'descending');
      button.querySelector('.sort-indicator').textContent = index < 0 ? '↕' : `${index + 1} ${level.direction === 'asc' ? '↑' : '↓'}`;
      const next = !level ? 'add ascending sort' : level.direction === 'asc' ? 'sort descending' : 'remove sort';
      button.setAttribute('aria-label', `${labels[button.dataset.sort]}${level ? `, priority ${index + 1}, ${level.direction === 'asc' ? 'ascending' : 'descending'}` : ''}; ${next}`);
    });
    status.textContent = levels.length
      ? `Sort: ${levels.map((level, index) => `${index + 1}. ${labels[level.key]} ${level.direction === 'asc' ? '↑' : '↓'}`).join(' → ')}`
      : 'Sort: original catalog order';
    reset.disabled = levels.length === 0;
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.sort;
    const level = levels.find(item => item.key === key);
    if (!level) levels.push({ key, direction: 'asc' });
    else if (level.direction === 'asc') level.direction = 'desc';
    else levels = levels.filter(item => item.key !== key);
    render();
  }));
  reset.addEventListener('click', () => { levels = []; render(); });
  render();
})();
