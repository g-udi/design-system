'use client';

import { useEffect, useState } from 'react';

const registries = new WeakMap();
const statusAttribute = 'data-gaudi-script-status';

/** Load an explicitly supplied URL. Shared callers use one script; null/disabled stays idle. */
export function useScript(src, { enabled = true, removeOnUnmount = false } = {}) {
  const [state, setState] = useState({ src: null, status: 'idle' });
  useEffect(() => {
    if (!enabled || !src || typeof document === 'undefined') {
      setState((current) => current.src === null ? current : { src: null, status: 'idle' });
      return undefined;
    }
    let registry = registries.get(document);
    if (!registry) { registry = new Map(); registries.set(document, registry); }
    let url;
    try { url = new URL(src, document.baseURI).href; } catch { setState({ src, status: 'error' }); return undefined; }
    let entry = registry.get(url);
    if (!entry) {
      const existing = Array.from(document.scripts).find((script) => script.src === url);
      const script = existing ?? document.createElement('script');
      entry = { script, owned: !existing, status: existing ? existing.getAttribute(statusAttribute) || 'unknown' : 'loading', listeners: new Set(), users: 0, retain: false };
      registry.set(url, entry);
      const update = (status) => {
        entry.status = status;
        script.setAttribute(statusAttribute, status);
        entry.listeners.forEach((listener) => listener(status));
      };
      const loaded = () => update('ready');
      const failed = () => update('error');
      script.addEventListener('load', loaded);
      script.addEventListener('error', failed);
      entry.cleanup = () => { script.removeEventListener('load', loaded); script.removeEventListener('error', failed); };
      if (!existing) {
        script.src = url;
        script.async = true;
        script.setAttribute(statusAttribute, 'loading');
        document.head.appendChild(script);
      }
    }
    entry.users += 1;
    if (!removeOnUnmount) entry.retain = true;
    const notify = (status) => setState({ src, status });
    entry.listeners.add(notify);
    notify(entry.status);
    return () => {
      entry.listeners.delete(notify);
      entry.users -= 1;
      // A Strict Mode cleanup/setup pair reuses the live entry before removal runs.
      queueMicrotask(() => {
        if (entry.users || entry.retain) return;
        entry.cleanup();
        if (entry.owned) entry.script.remove();
        registry.delete(url);
      });
    };
  }, [enabled, removeOnUnmount, src]);
  return !enabled || !src ? 'idle' : state.src === src ? state.status : 'loading';
}
