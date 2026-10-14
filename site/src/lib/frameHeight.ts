// Open menus, selects and popovers are portaled outside the example and positioned out of flow, so the
// frame grows to the lowest one as well. Radix and Base UI both mark floating content with data-side.
const FLOATING = '[data-side]';
const GAP = 8;

// Popups cap themselves to the space left in the frame and scroll, so use their full content height.
function floatingBottom(doc: Document, observe: (element: Element) => void) {
  const scroll = doc.defaultView?.scrollY ?? 0;
  let bottom = 0;
  doc.querySelectorAll(FLOATING).forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.height === 0) return;
    observe(element);
    bottom = Math.max(bottom, rect.top + Math.max(rect.height, element.scrollHeight) + scroll + GAP);
  });
  return bottom;
}

/**
 * Reports the height a frame needs: the example's own height (`measure`) or the bottom of its open
 * floating content, whichever is larger. Returns a cleanup function.
 */
export function observeFrameHeight(doc: Document, target: Element, measure: () => number, onHeight: (height: number) => void) {
  const view = doc.defaultView;
  if (!view) return () => {};
  let frame = 0;
  // Declared before use: the observer callback only runs after `resize` is assigned.
  const report = () => {
    view.cancelAnimationFrame(frame);
    frame = view.requestAnimationFrame(() => onHeight(Math.ceil(Math.max(measure(), floatingBottom(doc, (element) => resize.observe(element))))));
  };
  const resize = new view.ResizeObserver(report);
  resize.observe(target);
  // Growing the frame resizes its window, and Radix Select closes on any window resize. A height-only
  // resize here only ever comes from this sizing, so keep it from the example's listeners.
  let width = view.innerWidth;
  const ownResize = (event: Event) => {
    if (view.innerWidth === width) event.stopImmediatePropagation();
    width = view.innerWidth;
  };
  view.addEventListener('resize', ownResize, true);
  // Portals mount and unmount at the body; open/close also flips data-state on the trigger and content.
  const mutations = new view.MutationObserver(report);
  mutations.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-state', 'data-open', 'data-side', 'hidden'] });
  // Entry animations scale the content; measure again once they settle.
  doc.addEventListener('animationend', report, true);
  doc.addEventListener('transitionend', report, true);
  report();
  return () => {
    view.cancelAnimationFrame(frame);
    resize.disconnect();
    mutations.disconnect();
    view.removeEventListener('resize', ownResize, true);
    doc.removeEventListener('animationend', report, true);
    doc.removeEventListener('transitionend', report, true);
  };
}
