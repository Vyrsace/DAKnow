(() => {
  'use strict';

  const galleries = [...document.querySelectorAll('[data-title-gallery]')];
  if (!galleries.length || !window.HTMLDialogElement) return;

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
  const imageWrap = document.createElement('div');
  imageWrap.className = 'image-lightbox-image-wrap';
  const image = document.createElement('img');
  image.decoding = 'async';
  imageWrap.append(image);
  const caption = document.createElement('figcaption');
  const description = document.createElement('span');
  description.id = 'image-lightbox-caption';
  const credit = document.createElement('span');
  credit.id = 'image-lightbox-credit';
  const source = document.createElement('a');
  source.target = '_blank';
  source.rel = 'noopener noreferrer';
  credit.append('Source: ', source);
  caption.append(description, credit);
  figure.append(imageWrap, caption);
  dialog.append(header, figure);
  document.body.append(dialog);

  let opener = null;

  function openImage(gallery, button) {
    const slides = [...gallery.querySelector('.title-gallery-track').children]
      .filter(slide => slide.classList.contains('title-gallery-slide') && !slide.dataset.galleryClone);
    const slide = slides[Number(gallery.dataset.galleryIndex) || 0];
    const original = slide && slide.querySelector('img');
    if (!original) return;

    opener = button;
    image.src = original.currentSrc || original.src;
    image.alt = original.alt;
    title.textContent = gallery.dataset.galleryTitle || 'Title image';
    description.textContent = slide.dataset.imageCaption || slide.dataset.galleryLabel || original.alt;
    source.textContent = slide.dataset.imageCredit || 'Original image';
    source.href = slide.dataset.imageSource || original.src;
    document.documentElement.classList.add('image-lightbox-open');
    dialog.showModal();
    close.focus({ preventScroll: true });
  }

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === close) {
      event.preventDefault();
      source.focus();
    } else if (!event.shiftKey && document.activeElement === source) {
      event.preventDefault();
      close.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('image-lightbox-open');
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });

  galleries.forEach(gallery => {
    const viewport = gallery.querySelector('.title-gallery-window');
    if (!viewport || viewport.querySelector('.title-gallery-expand')) return;
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
    viewport.append(button);
  });
})();
