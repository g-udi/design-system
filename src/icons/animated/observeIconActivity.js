const documents = new WeakMap();

/** Share visibility and motion subscriptions across a document's icon instances. */
export function observeIconActivity(element, onChange) {
  const doc = element.ownerDocument;
  let state = documents.get(doc);
  if (!state) {
    const view = doc.defaultView;
    const media = view?.matchMedia?.('(prefers-reduced-motion: reduce)');
    const listeners = new Map();
    const inView = new Map();
    const notify = (node) => listeners.get(node)?.forEach((listener) => listener(
      Boolean(inView.get(node)) && doc.visibilityState !== 'hidden' && !media?.matches
    ));
    const sync = () => listeners.forEach((_, node) => notify(node));
    const observer = view?.IntersectionObserver ? new view.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!listeners.has(entry.target)) return;
        inView.set(entry.target, entry.isIntersecting);
        notify(entry.target);
      });
    }) : null;
    doc.addEventListener('visibilitychange', sync);
    if (media?.addEventListener) media.addEventListener('change', sync);
    else media?.addListener?.(sync);
    state = { listeners, inView, observer, notify, dispose: () => {
      observer?.disconnect();
      doc.removeEventListener('visibilitychange', sync);
      if (media?.removeEventListener) media.removeEventListener('change', sync);
      else media?.removeListener?.(sync);
      documents.delete(doc);
    } };
    documents.set(doc, state);
  }
  if (!state.listeners.has(element)) {
    state.listeners.set(element, new Set());
    state.inView.set(element, !state.observer);
    state.observer?.observe(element);
  }
  state.listeners.get(element).add(onChange);
  state.notify(element);
  return () => {
    const subscribers = state.listeners.get(element);
    subscribers?.delete(onChange);
    if (subscribers?.size === 0) {
      state.observer?.unobserve(element);
      state.listeners.delete(element);
      state.inView.delete(element);
    }
    if (state.listeners.size === 0) state.dispose();
  };
}
