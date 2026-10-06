'use client';

import { useEffect } from 'react';
import { useLatestRef } from '../shared/use-latest-ref.js';

const titles = new WeakMap();

/** The most recently mounted title owns the document; unmount restores the remaining owner. */
export function useDocumentTitle(title, { enabled = true } = {}) {
  const latest = useLatestRef(title);
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return undefined;
    let state = titles.get(document);
    if (!state) { state = { original: document.title, owners: [] }; titles.set(document, state); }
    const owner = latest;
    state.owners.push(owner);
    const apply = () => { document.title = state.owners.at(-1)?.current ?? state.original; };
    apply();
    return () => {
      state.owners = state.owners.filter((entry) => entry !== owner);
      apply();
      if (!state.owners.length) titles.delete(document);
    };
  }, [enabled, latest]);
  useEffect(() => {
    if (enabled && typeof document !== 'undefined' && titles.get(document)?.owners.at(-1) === latest) document.title = title;
  }, [enabled, latest, title]);
}
