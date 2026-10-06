import { canSmoothCaret, measureInputCaret } from './inputCaretGeometry.js';

/** Enhance presentation only: native editing, focus, selection and events stay intact. */
export function attachInputCaret(input) {
  const doc = input.ownerDocument;
  const win = doc.defaultView;
  let active = false;
  let composing = false;
  let touching = false;
  let frame = 0;
  let anchor;
  let clip;
  let caret;
  let mirror;
  let observer;
  let attributes;
  let lastPosition;
  let visible = false;

  const hide = () => {
    delete input.dataset.smoothCaretActive;
    if (anchor) anchor.hidden = true;
    if (mirror) mirror.textContent = '';
    visible = false;
    lastPosition = null;
  };
  const paint = () => {
    frame = 0;
    if (!active || !input.isConnected || doc.activeElement !== input || doc.hidden || composing || touching) {
      hide();
      return;
    }
    delete input.dataset.smoothCaretActive;
    const style = win.getComputedStyle(input);
    if (!canSmoothCaret(input, style)) {
      hide();
      return;
    }
    const position = measureInputCaret(input, mirror, style);
    if (!position) {
      hide();
      return;
    }
    anchor.hidden = false;
    // The zero-size anchor shares the control's containing block and clipping.
    // Measuring its origin also handles positioned, scrolled and scaled ancestors.
    const origin = anchor.getBoundingClientRect();
    const rect = input.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= win.innerHeight || rect.right <= 0 || rect.left >= win.innerWidth) {
      hide();
      return;
    }
    const sx = rect.width / input.offsetWidth;
    const sy = rect.height / input.offsetHeight;
    const ax = origin.width;
    const ay = origin.height;
    if (!(sx > 0 && sy > 0 && ax > 0 && ay > 0)) {
      hide();
      return;
    }
    const x = (rect.left + (input.clientLeft + position.paddingLeft) * sx - origin.left) / ax;
    const y = (rect.top + (input.clientTop + position.paddingTop) * sy - origin.top) / ay;
    Object.assign(clip.style, {
      width: `${position.width}px`, height: `${position.clipHeight}px`,
      transform: `translate(${x}px, ${y}px) scale(${sx / ax}, ${sy / ay})`,
    });
    const target = `${position.x},${position.y},${position.height}`;
    caret.style.backgroundColor = style.caretColor === 'transparent' ? style.color : style.caretColor;
    caret.style.height = `${position.height}px`;
    if (target !== lastPosition) {
      // A line change snaps vertically; a caret must never fly across other lines.
      const sameLine = lastPosition && Math.abs(Number(lastPosition.split(',')[1]) - position.y) < 1;
      caret.style.transition = visible && sameLine ? '' : 'none';
      caret.style.transform = `translate(${Math.min(position.width - 1, Math.max(0, position.x))}px, ${position.y}px)`;
      caret.style.animation = 'none';
      void caret.offsetWidth;
      caret.style.animation = '';
      lastPosition = target;
    }
    visible = true;
    input.dataset.smoothCaretActive = '';
  };
  const schedule = () => {
    if (active && !frame) frame = win.requestAnimationFrame(paint);
  };
  const compositionStart = () => { composing = true; hide(); };
  const compositionEnd = () => { composing = false; schedule(); };
  const pointerDown = (event) => {
    // Touch selection handles and magnifiers remain entirely browser-owned.
    touching = event.pointerType === 'touch';
    if (touching) hide();
  };
  const focus = () => {
    if (active) return;
    active = true;
    anchor = doc.createElement('span');
    anchor.className = 'ds-input-caret-anchor';
    anchor.setAttribute('aria-hidden', 'true');
    anchor.inert = true;
    clip = doc.createElement('span');
    clip.className = 'ds-input-caret-clip';
    caret = doc.createElement('span');
    caret.className = 'ds-input-caret';
    caret.dataset.slot = 'input-caret';
    clip.append(caret);
    anchor.append(clip);
    input.parentElement.append(anchor);
    mirror = doc.createElement('div');
    mirror.className = 'ds-input-caret-mirror';
    mirror.setAttribute('aria-hidden', 'true');
    mirror.inert = true;
    doc.body.append(mirror);
    observer = new win.ResizeObserver(schedule);
    observer.observe(input);
    attributes = new win.MutationObserver(schedule);
    attributes.observe(input, { attributes: true, attributeFilter: ['class', 'style', 'type', 'disabled', 'readonly', 'dir'] });
    attributes.observe(doc.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'dir'] });
    doc.addEventListener('selectionchange', schedule);
    doc.addEventListener('scroll', schedule, true);
    doc.addEventListener('visibilitychange', schedule);
    doc.addEventListener('reset', schedule, true);
    win.addEventListener('blur', hide);
    win.addEventListener('focus', schedule);
    win.addEventListener('resize', schedule);
    doc.fonts?.ready.then(() => { if (active) schedule(); });
    schedule();
  };
  const blur = () => {
    active = false;
    composing = false;
    touching = false;
    win.cancelAnimationFrame(frame);
    frame = 0;
    hide();
    observer?.disconnect();
    attributes?.disconnect();
    anchor?.remove();
    mirror?.remove();
    anchor = clip = caret = mirror = null;
    doc.removeEventListener('selectionchange', schedule);
    doc.removeEventListener('scroll', schedule, true);
    doc.removeEventListener('visibilitychange', schedule);
    doc.removeEventListener('reset', schedule, true);
    win.removeEventListener('blur', hide);
    win.removeEventListener('focus', schedule);
    win.removeEventListener('resize', schedule);
  };
  const events = { focus, blur, input: schedule, keyup: schedule, pointerdown: pointerDown, pointerup: schedule, click: schedule, scroll: schedule, compositionstart: compositionStart, compositionend: compositionEnd };
  for (const [event, handler] of Object.entries(events)) input.addEventListener(event, handler);
  if (doc.activeElement === input) focus();
  return {
    update: schedule,
    destroy() {
      blur();
      delete input.dataset.smoothCaretActive;
      for (const [event, handler] of Object.entries(events)) input.removeEventListener(event, handler);
    },
  };
}
