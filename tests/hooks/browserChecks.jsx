import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { expect, waitFor } from 'storybook/test';
import { useCountdown } from '../../src/hooks/state/use-countdown.js';
import { useDocumentTitle } from '../../src/hooks/environment/use-document-title.js';
import { useIsMounted } from '../../src/hooks/environment/use-is-mounted.js';
import { useUnmount } from '../../src/hooks/state/use-unmount.js';
import { useReadLocalStorage } from '../../src/hooks/data/use-read-local-storage.js';
import { localStorageStore } from '../../src/hooks/data/storage-model.js';
import { useScript } from '../../src/hooks/environment/use-script.js';
import { useMousePosition } from '../../src/hooks/interaction/use-mouse-position.js';
import { useMap } from '../../src/hooks/data/use-map.js';
import { useTimeout } from '../../src/hooks/state/use-timeout.js';

/** Browser-only hook probes, removed before each story's accessibility/responsive audit. */
function probe(useHook, initialOptions) {
  const host = document.createElement('div');
  const root = createRoot(host);
  let value;
  let disposed = false;
  function Probe({ options }) { value = useHook(options); return null; }
  const render = (options) => flushSync(() => root.render(createElement(StrictMode, null, createElement(Probe, { options }))));
  render(initialOptions);
  return { get value() { return value; }, render, dispose() { if (!disposed) { disposed = true; flushSync(() => root.unmount()); } } };
}

export async function verifyCountdown() {
  const timer = probe(useCountdown, { countStart: 0, countStop: 2, isIncrement: true, intervalMs: 20 });
  try {
    flushSync(() => timer.value.start());
    await waitFor(() => expect(timer.value.count).toBe(2));
    expect(timer.value.isRunning).toBe(false);
    timer.render({ countStart: 5, countStop: 0, intervalMs: 0 });
    flushSync(() => timer.value.reset());
    flushSync(() => timer.value.start());
    expect(timer.value.count).toBe(5);
    expect(timer.value.isRunning).toBe(false);
    timer.render({ countStart: 5, countStop: 0, intervalMs: 20 });
    flushSync(() => timer.value.start());
    await waitFor(() => expect(timer.value.count).toBeLessThan(5));
    flushSync(() => timer.value.stop());
    const paused = timer.value.count;
    await new Promise((resolve) => setTimeout(resolve, 70));
    expect(timer.value.count).toBe(paused);
  } finally { timer.dispose(); }
}

export async function verifyTitleOwnership() {
  const original = document.title;
  const first = probe(useDocumentTitle, 'First owner');
  const second = probe(useDocumentTitle, 'Second owner');
  try {
    expect(document.title).toBe('Second owner');
    first.render('Updated background owner');
    expect(document.title).toBe('Second owner');
    second.dispose();
    expect(document.title).toBe('Updated background owner');
    const third = probe(useDocumentTitle, 'Third owner');
    try {
      first.dispose();
      expect(document.title).toBe('Third owner');
    } finally { third.dispose(); }
    expect(document.title).toBe(original);
  } finally { second.dispose(); first.dispose(); document.title = original; }
}

export async function verifyMountGetter() {
  const mounted = probe(useIsMounted);
  const getter = mounted.value;
  try {
    expect(getter()).toBe(true);
    mounted.render();
    expect(mounted.value === getter).toBe(true);
  } finally { mounted.dispose(); }
  expect(getter()).toBe(false);
}

export async function verifyLatestCleanup() {
  const calls = [];
  const cleanup = probe(useUnmount, () => calls.push('old'));
  calls.length = 0;
  cleanup.render(() => calls.push('latest'));
  expect(calls).toEqual([]);
  cleanup.dispose();
  expect(calls).toEqual(['latest']);
}

export async function verifyMapReset() {
  const seed = new Map([['intro', 'Draft'], ['end', 'Planned']]);
  const collection = probe(useMap, seed.entries());
  try {
    expect([...collection.value[0]]).toEqual([...seed]);
    flushSync(() => collection.value[1].clear());
    expect(collection.value[0].size).toBe(0);
    flushSync(() => collection.value[1].reset());
    expect([...collection.value[0]]).toEqual([...seed]);
    flushSync(() => collection.value[1].setAll([['replacement', 'Ready']]));
    expect([...collection.value[0]]).toEqual([['replacement', 'Ready']]);
    collection.render([['new seed', 'Ignored after initialization']]);
    flushSync(() => collection.value[1].reset());
    expect([...collection.value[0]]).toEqual([...seed]);
  } finally { collection.dispose(); }
}

function useStorageReader({ key, fallback = 'empty' }) { return useReadLocalStorage(key, fallback); }
export async function verifyStorageReader() {
  const key = `gaudi:test:read:${Math.random()}`;
  const nextKey = `${key}:next`;
  const reader = probe(useStorageReader, { key });
  try {
    expect(reader.value).toBe('empty');
    flushSync(() => localStorageStore.set(key, JSON.stringify({ compact: true })));
    expect(reader.value).toEqual({ compact: true });
    flushSync(() => localStorageStore.set(key, 'invalid JSON'));
    expect(reader.value).toBe('empty');
    reader.render({ key: nextKey, fallback: 'next' });
    expect(reader.value).toBe('next');
    window.localStorage.setItem(nextKey, JSON.stringify('another tab'));
    window.dispatchEvent(new StorageEvent('storage', { key: nextKey, storageArea: window.localStorage }));
    await waitFor(() => expect(reader.value).toBe('another tab'));
    flushSync(() => localStorageStore.set(key, JSON.stringify('old key')));
    expect(reader.value).toBe('another tab');
    flushSync(() => localStorageStore.remove(nextKey));
    expect(reader.value).toBe('next');
  } finally { reader.dispose(); localStorageStore.remove(key); localStorageStore.remove(nextKey); }
}

function useScriptProbe({ src, ...options }) { return useScript(src, options); }
export async function verifyScriptOwnership() {
  const src = `/static/scripts/hook-preview.js?test=${Math.random()}`;
  const first = probe(useScriptProbe, { src, removeOnUnmount: true });
  const second = probe(useScriptProbe, { src, removeOnUnmount: true });
  const find = () => [...document.scripts].filter((script) => script.src.endsWith(src));
  try {
    await waitFor(() => expect(first.value).toBe('ready'));
    expect(second.value).toBe('ready');
    expect(find()).toHaveLength(1);
    first.dispose();
    await Promise.resolve();
    expect(find()).toHaveLength(1);
    second.dispose();
    await waitFor(() => expect(find()).toHaveLength(0));
  } finally { first.dispose(); second.dispose(); }

  // A manually owned script cannot be removed or assumed loaded by a consumer.
  const external = document.createElement('script');
  external.type = 'application/json';
  external.src = '/static/scripts/manual-owner.json';
  document.head.appendChild(external);
  const adopted = probe(useScriptProbe, { src: external.src, removeOnUnmount: true });
  try {
    await waitFor(() => expect(adopted.value).toBe('unknown'));
    flushSync(() => external.dispatchEvent(new Event('error')));
    expect(adopted.value).toBe('error');
    adopted.render({ src: null });
    expect(adopted.value).toBe('idle');
    flushSync(() => external.dispatchEvent(new Event('load')));
    expect(adopted.value).toBe('idle');
    expect(external.isConnected).toBe(true);
  } finally { adopted.dispose(); external.remove(); }
}

/** A burst of pointer input needs one layout read, and pending work must cancel on release. */
export async function verifyPointerCoalescing() {
  const pointer = probe(useMousePosition, { enabled: true });
  const target = document.createElement('div');
  document.body.append(target);
  let reads = 0;
  target.getBoundingClientRect = () => {
    reads += 1;
    return { left: 10, top: 20, right: 210, bottom: 120 };
  };
  pointer.value.ref(target);
  const move = (x, y) => window.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y }));
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  try {
    for (let index = 0; index < 100; index += 1) move(20 + index, 40);
    expect(reads, 'pointer events should defer geometry reads until the animation frame').toBe(0);
    await waitFor(() => expect(pointer.value.elementX).toBe(109));
    expect(pointer.value.elementY).toBe(20);
    expect(pointer.value.isInside).toBe(true);
    expect(reads, 'one frame measures the latest pointer sample once').toBe(1);
    const retained = pointer.value.x;
    move(200, 60);
    pointer.render({ enabled: false });
    await nextFrame();
    expect(reads).toBe(1);
    expect(pointer.value.x).toBe(retained);
    move(180, 50);
    await nextFrame();
    expect(reads).toBe(1);
    pointer.render({ enabled: true });
    move(220, 50);
    await waitFor(() => expect(pointer.value.x).toBe(220));
    expect(pointer.value.isInside).toBe(false);
    expect(reads).toBe(2);
    move(100, 80);
    pointer.dispose();
    await nextFrame();
    expect(reads, 'unmount cancels a pending geometry read').toBe(2);
  } finally { pointer.dispose(); target.remove(); }
}

export async function verifyTimeout() {
  let calls = 0;
  const callback = () => { calls += 1; };
  const timer = probe(({ callback: run, delay }) => useTimeout(run, delay), { callback, delay: null });
  try {
    timer.value.reset();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(calls).toBe(0);
    timer.render({ callback, delay: 100 });
    timer.value.clear();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(calls).toBe(0);
    timer.value.reset();
    await waitFor(() => expect(calls).toBe(1));
    timer.render({ callback: () => { calls += 10; }, delay: 100 });
    timer.value.reset();
    await waitFor(() => expect(calls).toBe(11));
    timer.value.reset();
    timer.dispose();
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(calls).toBe(11);
  } finally { timer.dispose(); }
}
