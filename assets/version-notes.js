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
    group.querySelectorAll('.official-note-title[data-original-title]').forEach(title => {
      title.textContent = showOriginal ? title.dataset.originalTitle : title.dataset.translatedTitle;
      title.lang = showOriginal ? title.dataset.titleLanguage : 'en';
    });
    group.querySelectorAll('.official-archive-link').forEach(link => {
      const title = link.closest('.official-note-citation').querySelector('.official-note-title').textContent;
      link.title = `Official · ${title} (${link.dataset.publisher} · Internet Archive)`;
    });
    group.querySelector('.official-note-qualifier').textContent = showOriginal
      ? 'Original' : 'Translated';
    const action = showOriginal ? 'Show English translation' : `Show original ${button.dataset.originalLanguage} text`;
    button.textContent = showOriginal ? '[English]' : `[${button.dataset.originalLanguage}]`;
    button.setAttribute('aria-pressed', String(showOriginal));
    button.setAttribute('aria-label', action);
    button.title = action;
  });
})();
