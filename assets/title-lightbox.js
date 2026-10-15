(() => {
  'use strict';
  const galleries = [...document.querySelectorAll('[data-title-gallery]')];
  if (!galleries.length || !window.HTMLDialogElement || !window.DAKnowTitleGallery) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'image-lightbox';
  dialog.id = 'title-image-lightbox';
  dialog.setAttribute('aria-labelledby', 'image-lightbox-title');
  dialog.setAttribute('aria-describedby', 'image-lightbox-caption image-lightbox-credit');
  const header = document.createElement('div');
  header.className = 'image-lightbox-header';
  const title = document.createElement('h2');
  title.id = 'image-lightbox-title';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'image-lightbox-close';
  close.setAttribute('aria-label', 'Close image');
  close.textContent = '×';
  header.append(title, close);

  const figure = document.createElement('figure');
  const viewer = document.createElement('div');
  viewer.className = 'title-gallery image-lightbox-gallery';
  viewer.dataset.titleGallery = '';
  const viewport = document.createElement('div');
  viewport.className = 'title-gallery-window';
  const track = document.createElement('div');
  track.className = 'title-gallery-track';
  viewport.append(track);
  const previous = document.createElement('button');
  const next = document.createElement('button');
  [[previous, 'previous', '‹'], [next, 'next', '›']].forEach(([button, direction, label]) => {
    button.type = 'button';
    button.className = 'title-gallery-arrow';
    button.dataset.galleryDirection = direction;
    button.textContent = label;
  });
  const count = document.createElement('span');
  count.className = 'title-gallery-count';
  const status = document.createElement('span');
  status.className = 'title-gallery-status sr-only';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  viewer.append(viewport, previous, next, count, status);

  const caption = document.createElement('figcaption');
  caption.tabIndex = 0;
  const description = document.createElement('span');
  description.id = 'image-lightbox-caption';
  const credit = document.createElement('span');
  credit.id = 'image-lightbox-credit';
  const source = document.createElement('a');
  source.target = '_blank';
  source.rel = 'noopener noreferrer';
  credit.append('Source: ', source);
  caption.append(description, credit);
  figure.append(viewer, caption);
  dialog.append(header, figure);
  document.body.append(dialog);

  let opener = null;
  let sourceGallery = null;
  let slides = [];
  let controller = null;

  function updateCaption() {
    const slide = slides[Number(viewer.dataset.galleryIndex) || 0];
    const original = slide && slide.querySelector('img');
    if (!original) return;
    description.textContent = slide.dataset.imageCaption || slide.dataset.galleryLabel || original.alt;
    source.textContent = slide.dataset.imageCredit || 'Original image';
    source.href = slide.dataset.imageSource || original.src;
    caption.scrollTop = 0;
  }
  viewer.addEventListener('title-gallery-change', updateCaption);

  function openImage(gallery, button) {
    slides = [...gallery.querySelector('.title-gallery-track').children]
      .filter(slide => slide.classList.contains('title-gallery-slide') && !slide.dataset.galleryClone);
    if (!slides.length) return;
    controller?.destroy();
    const copies = slides.map(slide => {
      const copy = slide.cloneNode(true);
      [copy, ...copy.querySelectorAll('*')].forEach(element => {
        element.removeAttribute('id');
        element.removeAttribute('aria-labelledby');
        element.removeAttribute('aria-describedby');
      });
      // Show complete original pixels even when a card uses a wallpaper logo crop.
      const original = slide.querySelector('img');
      if (original) {
        const image = original.cloneNode(true);
        image.removeAttribute('id');
        image.removeAttribute('style');
        image.loading = 'eager';
        image.decoding = 'async';
        image.draggable = false;
        copy.replaceChildren(image);
      }
      return copy;
    });
    track.replaceChildren(...copies);
    opener = button;
    sourceGallery = gallery;
    const galleryTitle = gallery.dataset.galleryTitle || 'Title image';
    title.textContent = galleryTitle;
    const heading = gallery.closest('.game-card')?.querySelector('h3');
    const native = heading?.querySelector('.title-native');
    title.removeAttribute('lang');
    let accessibleTitle = galleryTitle;
    if (native && native.textContent.trim() && !galleryTitle.includes(native.textContent.trim())) {
      const nativeTitle = document.createElement('span');
      nativeTitle.className = 'image-lightbox-native';
      nativeTitle.textContent = native.textContent;
      if (native.lang) nativeTitle.lang = native.lang;
      title.append(document.createTextNode(' '), nativeTitle);
      accessibleTitle += ` / ${native.textContent.trim()}`;
    } else if (heading?.lang) title.lang = heading.lang;
    viewer.dataset.galleryTitle = accessibleTitle;
    status.textContent = '';
    previous.setAttribute('aria-label', `Previous ${accessibleTitle} image`);
    next.setAttribute('aria-label', `Next ${accessibleTitle} image`);
    previous.disabled = next.disabled = slides.length < 2;
    controller = window.DAKnowTitleGallery.create(viewer, Number(gallery.dataset.galleryIndex) || 0);
    document.documentElement.classList.add('image-lightbox-open');
    dialog.showModal();
    close.focus({ preventScroll: true });
  }

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (!event.ctrlKey && !event.metaKey && !event.altKey &&
        (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      // Gallery-focused arrows stop bubbling in the shared carousel handler.
      event.preventDefault();
      controller?.step(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')]
      .filter(element => !element.closest('[inert]') && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    window.DAKnowTitleGallery.get(sourceGallery)?.select(Number(viewer.dataset.galleryIndex) || 0);
    controller?.destroy();
    controller = null;
    sourceGallery = null;
    document.documentElement.classList.remove('image-lightbox-open');
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });

  galleries.forEach(gallery => {
    const galleryViewport = gallery.querySelector('.title-gallery-window');
    if (!galleryViewport || galleryViewport.querySelector('.title-gallery-expand')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'title-gallery-expand';
    button.setAttribute('aria-label', `Enlarge ${gallery.dataset.galleryTitle || 'title'} image`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.title = 'View full image';
    button.addEventListener('click', event => {
      event.stopPropagation();
      openImage(gallery, button);
    });
    galleryViewport.append(button);
  });
})();
