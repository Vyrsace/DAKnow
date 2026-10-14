(() => {
  'use strict';

  const section = document.getElementById('catalog');
  const region = document.getElementById('region');
  const reset = document.getElementById('reset-filters');
  if (!section || !region || !reset) return;

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[data-version-region]');
    if (!link) return;

    // Reuse the existing filter controls so badges, counts and cascading choices
    // remain in sync. Their Reset does not change the table's sort priorities.
    reset.click();
    const country = link.dataset.versionRegion;
    if (country) {
      const option = [...region.querySelectorAll('input[data-filter="region"]')]
        .find(input => input.value === country);
      if (option) {
        option.checked = true;
        option.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    region.open = false;
    const card = section.querySelector(':scope > details.collapsible-card');
    if (card) card.open = true;

    // Keep native fragment navigation, including Enter and repeated clicks on
    // the current fragment. Existing navigation reveals the heading and card.
  });
})();
