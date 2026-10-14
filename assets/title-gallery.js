(() => {
  'use strict';

  document.querySelectorAll('[data-title-gallery]').forEach(gallery => {
    if (gallery.classList.contains('is-ready')) return;
    const viewport = gallery.querySelector('.title-gallery-window');
    const track = gallery.querySelector('.title-gallery-track');
    if (!viewport || !track) return;
    const slides = [...track.children].filter(slide => slide.classList.contains('title-gallery-slide'));
    if (slides.length < 2) return;

    const status = gallery.querySelector('.title-gallery-status');
    const count = gallery.querySelector('.title-gallery-count');
    const motion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const reduced = () => Boolean(motion && motion.matches);
    const modulo = value => (value % slides.length + slides.length) % slides.length;
    let current = 0;
    let position = 1;
    let moving = false;
    let settling = false;
    let pending = 0;
    let safetyTimer = null;

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
    }

    function finish() {
      if (!moving) return;
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
          settling = false;
          drain();
        });
      });
    }

    function drain() {
      if (moving || settling || !pending) return;
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
      // Coalesce complete queued cycles so repeated input cannot build a long
      // animation backlog, while retaining the requested final logical image.
      pending = (pending + direction) % slides.length;
      drain();
    }

    gallery.querySelectorAll('.title-gallery-arrow[data-gallery-direction]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        step(button.dataset.galleryDirection === 'previous' ? -1 : 1);
      });
    });
    gallery.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      event.stopPropagation();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    });
    track.addEventListener('transitionend', event => {
      if (event.target === track && event.propertyName === 'transform') finish();
    });
    const settleResize = () => { if (moving) finish(); };
    window.addEventListener('resize', settleResize, { passive: true });
    if (window.ResizeObserver) {
      const observer = new window.ResizeObserver(settleResize);
      observer.observe(viewport);
    }
    if (motion) {
      const changedMotion = () => { if (reduced() && moving) finish(); };
      if (motion.addEventListener) motion.addEventListener('change', changedMotion);
      else if (motion.addListener) motion.addListener(changedMotion);
    }

    transform();
    render(false);
    gallery.classList.add('is-ready');
  });
})();
