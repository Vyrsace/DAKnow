(() => {
  'use strict';

  const controllers = new WeakMap();

  // Card images and popup images use the same gesture, threshold and snapback.
  function enableSwipe(gallery, viewport, track, controller, total) {
    let gesture = null;
    let snapTimer = null;
    let suppressClick = false;
    gallery.dataset.swipe = String(total > 1);

    function clearSnap() {
      window.clearTimeout(snapTimer);
      snapTimer = null;
      gallery.classList.remove('is-swipe-settling');
    }
    function finishGesture(event, canceled = false) {
      if (!gesture || (event && event.pointerId !== gesture.pointerId)) return;
      const ended = gesture;
      gesture = null;
      gallery.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(ended.pointerId)) viewport.releasePointerCapture(ended.pointerId);
      const distance = (event?.clientX ?? ended.lastX) - ended.startX;
      const vertical = (event?.clientY ?? ended.lastY) - ended.startY;
      // A real drag must never activate the card's transparent Enlarge button.
      suppressClick = ended.horizontal || Math.hypot(distance, vertical) > 8;
      if (!ended.horizontal) return;
      const threshold = Math.max(36, Math.min(96, viewport.clientWidth * 0.15));
      if (!canceled && Math.abs(distance) >= threshold && Math.abs(distance) > Math.abs(vertical)) {
        controller.step(distance < 0 ? 1 : -1);
      } else {
        gallery.classList.add('is-swipe-settling');
        controller.select(Number(gallery.dataset.galleryIndex) || 0);
        snapTimer = window.setTimeout(clearSnap, 220);
      }
    }
    function pointerDown(event) {
      if (total < 2 || !event.isPrimary || event.button !== 0 || gesture) return;
      suppressClick = false;
      clearSnap();
      controller.select(Number(gallery.dataset.galleryIndex) || 0);
      gesture = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
        lastX: event.clientX, lastY: event.clientY, horizontal: false };
    }
    function pointerMove(event) {
      if (!gesture || event.pointerId !== gesture.pointerId) return;
      gesture.lastX = event.clientX;
      gesture.lastY = event.clientY;
      const distance = event.clientX - gesture.startX;
      const vertical = event.clientY - gesture.startY;
      if (!gesture.horizontal) {
        if (Math.abs(distance) < 8 || Math.abs(distance) <= Math.abs(vertical)) return;
        gesture.horizontal = true;
        // Defer capture until dragging so an ordinary click still enlarges.
        viewport.setPointerCapture(event.pointerId);
        gallery.classList.add('is-dragging');
      }
      event.preventDefault();
      event.stopPropagation();
      const offset = Math.max(-viewport.clientWidth, Math.min(viewport.clientWidth, distance));
      const position = (Number(gallery.dataset.galleryIndex) || 0) + 1;
      track.style.transform = `translateX(calc(${-position * 100}% + ${offset}px))`;
    }
    function click(event) {
      if (!suppressClick || event.detail === 0) return;
      suppressClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    const pointerUp = event => finishGesture(event);
    const cancel = event => finishGesture(event, true);
    const lostCapture = event => {
      // Touch/pen initially capture the image or Enlarge button implicitly.
      // Its capture loss bubbles here when we take over a horizontal swipe;
      // only losing the viewport's own capture cancels the active gesture.
      if (event.target === viewport) cancel(event);
    };
    const resize = () => finishGesture(null, true);
    const preventDrag = event => event.preventDefault();
    viewport.addEventListener('pointerdown', pointerDown);
    viewport.addEventListener('pointermove', pointerMove);
    viewport.addEventListener('pointerup', pointerUp);
    viewport.addEventListener('pointercancel', cancel);
    viewport.addEventListener('lostpointercapture', lostCapture);
    viewport.addEventListener('dragstart', preventDrag);
    viewport.addEventListener('click', click, true);
    // A press may leave the image before horizontal capture begins.
    window.addEventListener('pointerup', pointerUp, true);
    window.addEventListener('pointercancel', cancel, true);
    window.addEventListener('resize', resize, { passive: true });
    return () => {
      finishGesture(null, true);
      clearSnap();
      viewport.removeEventListener('pointerdown', pointerDown);
      viewport.removeEventListener('pointermove', pointerMove);
      viewport.removeEventListener('pointerup', pointerUp);
      viewport.removeEventListener('pointercancel', cancel);
      viewport.removeEventListener('lostpointercapture', lostCapture);
      viewport.removeEventListener('dragstart', preventDrag);
      viewport.removeEventListener('click', click, true);
      window.removeEventListener('pointerup', pointerUp, true);
      window.removeEventListener('pointercancel', cancel, true);
      window.removeEventListener('resize', resize);
      delete gallery.dataset.swipe;
    };
  }

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
        disposeSwipe();
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
    const disposeSwipe = enableSwipe(gallery, viewport, track, controller, slides.length);
    controllers.set(gallery, controller);
    return controller;
  }

  window.DAKnowTitleGallery = { create, get: gallery => controllers.get(gallery) };
  document.querySelectorAll('[data-title-gallery]').forEach(gallery => create(gallery));
})();
