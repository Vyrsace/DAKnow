(() => {
  const catalog = document.getElementById('catalog');
  if (!catalog) return;

  catalog.addEventListener('click', event => {
    const button = event.target.closest('[data-note-language-toggle]');
    if (!button) return;
    const group = button.closest('[data-official-notes]');
    const original = group.querySelector('[data-note-original]');
    const translated = group.querySelector('[data-note-translation]');
    const showOriginal = original.hidden;
    original.hidden = !showOriginal;
    translated.hidden = showOriginal;
    group.querySelector('[data-official-label]').textContent = showOriginal
      ? 'Official (Original)' : 'Official (Translated)';
    const action = showOriginal ? 'Show English translation' : `Show original ${button.dataset.originalLanguage} text`;
    button.setAttribute('aria-pressed', String(showOriginal));
    button.setAttribute('aria-label', action);
    button.title = action;
  });
})();
