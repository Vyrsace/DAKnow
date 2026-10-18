(() => {
  'use strict';

  const section = document.getElementById('catalog');
  const region = document.getElementById('region');
  const reset = document.getElementById('reset-filters');
  if (!section || !region || !reset) return;
  const shortcuts = [...section.querySelectorAll('a[data-version-region]')];

  function clearActiveRegion() {
    shortcuts.forEach(link => link.removeAttribute('aria-current'));
  }

  section.addEventListener('versionfilterschange', clearActiveRegion);

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[data-version-region]');
    if (!link) return;

    const deactivate = link.getAttribute('aria-current') === 'true';
    reset.click();
    const country = link.dataset.versionRegion;
    if (country && !deactivate) {
      const option = [...region.querySelectorAll('input[data-filter="region"]')]
        .find(input => input.value === country);
      if (option) {
        option.checked = true;
        option.dispatchEvent(new Event('change', { bubbles: true }));
        link.setAttribute('aria-current', 'true');
      }
    }
    region.open = false;
    const card = section.querySelector(':scope > details.collapsible-card');
    if (card) card.open = true;

    // Keep native fragment navigation, including Enter and repeated clicks on
    // the current fragment. Existing navigation reveals the heading and card.
  });
})();
