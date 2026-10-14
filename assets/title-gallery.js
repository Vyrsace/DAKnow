(() => {
  'use strict';

  const controllers = new WeakMap();

  function create(gallery, initialIndex = 0) {
    if (controllers.has(gallery)) return controllers.get(gallery);
    const viewport = gallery.querySelector('.title-gallery-window');
    const track = gallery.querySelector('.title-gallery-track');
    if (!viewport || !track) return null;
    const slides = [...track.children].filter(slide => slide.classList.contains('title-gallery-slide'));
    if (!slides.length) return null;

    const status = gallery.querySelector('.title-gallery-status');
    const count = gallery.querySelector('.title-gallery-count');
    const motion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const reduced = () => Boolean(motion && motion.matches);
    const modulo = value => (value % slides.length + slides.length) % slides.length;
    let current = modulo(initialIndex);
    let position = current + 1;
    let moving = false;
    let settling = false;
    let pending = 0;
    let safetyTimer = null;
    let destroyed = false;

    function setInert(element, inert) {
      if (inert) element.setAttribute('inert', '');
      else element.removeAttribute('inert');
    }

    function visualClone(slide) {
      const clone = slide.cloneNode(true);
      clone.dataset.galleryClone = 'true';
      [clone, ...clone.querySelectorAll('*')].forEach(element => {
        element.removeAttribute('id');
        element.removeAttribute('aria-labelledby');
        element.removeAttribute('aria-describedby');
        element.removeAttribute('aria-current');
      });
      clone.setAttribute('aria-hidden', 'true');
      setInert(clone, true);
      clone.querySelectorAll('a[href], button, input, select, textarea, [tabindex]').forEach(element => {
        element.setAttribute('tabindex', '-1');
      });
      clone.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
      return clone;
    }

    track.prepend(visualClone(slides[slides.length - 1]));
    track.append(visualClone(slides[0]));

    function transform() {
      track.style.transform = `translateX(${-position * 100}%)`;
    }

    function render(announce) {
      gallery.dataset.galleryIndex = String(current);
      slides.forEach((slide, index) => {
        const active = index === current;
        slide.setAttribute('aria-hidden', String(!active));
        setInert(slide, !active);
      });
      if (count) count.textContent = `${current + 1} / ${slides.length}`;
      if (announce && status) {
        const title = gallery.dataset.galleryTitle;
        const label = slides[current].dataset.galleryLabel || 'Image';
        status.textContent = `${title ? `${title}: ` : ''}${label}, ${current + 1} of ${slides.length}`;
      }
      gallery.dispatchEvent(new CustomEvent('title-gallery-change', { detail: { index: current } }));
    }

    function finish() {
      if (destroyed || !moving) return;
      moving = false;
      window.clearTimeout(safetyTimer);
      safetyTimer = null;
      gallery.classList.remove('is-moving');
      position = current + 1;
      transform();
      // Commit the identical real slide without a transition before another
      // queued move; otherwise browsers can animate the invisible wrap reset.
      settling = true;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (destroyed) return;
          settling = false;
          drain();
        });
      });
    }

    function drain() {
      if (destroyed || moving || settling || !pending) return;
      const direction = Math.sign(pending);
      pending -= direction;
      current = modulo(current + direction);
      render(true);
      if (reduced()) {
        position = current + 1;
        gallery.classList.remove('is-moving');
        transform();
        drain();
        return;
      }
      position += direction;
      moving = true;
      gallery.classList.add('is-moving');
      transform();
      // Only a safety net for canceled/absent transform transitions; normal
      // completion uses transitionend and clears this timer immediately.
      safetyTimer = window.setTimeout(finish, 400);
    }

    function step(direction) {
      if (destroyed) return;
      // Coalesce complete queued cycles so repeated input cannot build a long
      // animation backlog, while retaining the requested final logical image.
      pending = (pending + direction) % slides.length;
      drain();
    }

    const arrowHandlers = [...gallery.querySelectorAll('.title-gallery-arrow[data-gallery-direction]')].map(button => {
      const handler = event => {
        event.stopPropagation();
        step(button.dataset.galleryDirection === 'previous' ? -1 : 1);
      };
      button.addEventListener('click', handler);
      return [button, handler];
    });
    const keydown = event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      event.stopPropagation();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    };
    gallery.addEventListener('keydown', keydown);
    const transitionEnd = event => {
      if (event.target === track && event.propertyName === 'transform') finish();
    };
    track.addEventListener('transitionend', transitionEnd);
    const settleResize = () => { if (moving) finish(); };
    window.addEventListener('resize', settleResize, { passive: true });
    let observer = null;
    if (window.ResizeObserver) {
      observer = new window.ResizeObserver(settleResize);
      observer.observe(viewport);
    }
    const changedMotion = () => { if (reduced() && moving) finish(); };
    if (motion) {
      if (motion.addEventListener) motion.addEventListener('change', changedMotion);
      else if (motion.addListener) motion.addListener(changedMotion);
    }

    transform();
    render(false);
    gallery.classList.add('is-ready');
    const controller = {
      step,
      select(index, announce = false) {
        if (destroyed) return;
        window.clearTimeout(safetyTimer);
        safetyTimer = null;
        moving = false;
        settling = false;
        pending = 0;
        current = modulo(index);
        position = current + 1;
        gallery.classList.remove('is-moving');
        transform();
        render(announce);
      },
      destroy() {
        destroyed = true;
        window.clearTimeout(safetyTimer);
        observer?.disconnect();
        window.removeEventListener('resize', settleResize);
        if (motion?.removeEventListener) motion.removeEventListener('change', changedMotion);
        else if (motion?.removeListener) motion.removeListener(changedMotion);
        arrowHandlers.forEach(([button, handler]) => button.removeEventListener('click', handler));
        gallery.removeEventListener('keydown', keydown);
        track.removeEventListener('transitionend', transitionEnd);
        track.querySelectorAll('[data-gallery-clone]').forEach(clone => clone.remove());
        gallery.classList.remove('is-ready', 'is-moving');
        controllers.delete(gallery);
      }
    };
    controllers.set(gallery, controller);
    return controller;
  }

  window.DAKnowTitleGallery = { create, get: gallery => controllers.get(gallery) };
  document.querySelectorAll('[data-title-gallery]').forEach(gallery => create(gallery));
})();
