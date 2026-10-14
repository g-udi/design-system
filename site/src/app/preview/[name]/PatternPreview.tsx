'use client';

import { Component, useEffect, useState, useSyncExternalStore, type ComponentType, type ReactNode } from 'react';
import { DirectionProvider } from '@gaudi/design-system/core/Direction';
import { patternLoaders } from '@/generated/pattern-loaders';
import { observeFrameHeight } from '@/lib/frameHeight';

class PreviewBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return <PreviewError message={this.state.error.message} />;
    return this.props.children;
  }
}

function PreviewError({ message }: { message: string }) {
  return <p role='alert' className='m-4 rounded-(--ds-radius-card) border border-danger-border bg-danger-subtle p-4 text-sm'>This preview failed to render: {message}</p>;
}

// Direction comes from the frame URL (#dir=rtl) or a message from the docs page toolbar.
type Dir = 'ltr' | 'rtl';
let messageDir: Dir | null = null;
const readDir = (): Dir => messageDir || (window.location.hash.includes('dir=rtl') ? 'rtl' : 'ltr');
const subscribeDir = (notify: () => void) => {
  const onHash = () => { messageDir = null; notify(); };
  const onMessage = (event: MessageEvent) => {
    if (event.data?.type !== 'gaudi-preview-dir') return;
    messageDir = event.data.dir === 'rtl' ? 'rtl' : 'ltr';
    notify();
  };
  window.addEventListener('hashchange', onHash);
  window.addEventListener('message', onMessage);
  return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('message', onMessage); };
};

/** The isolated document behind every example frame. Reports its height to the docs page. */
export function PatternPreview({ name, block, title }: { name: string; block: boolean; title: string }) {
  const [loaded, setLoaded] = useState<{ name: string; Pattern?: ComponentType; error?: string } | null>(null);
  const dir = useSyncExternalStore<Dir>(subscribeDir, readDir, () => 'ltr');

  useEffect(() => {
    let current = true;
    patternLoaders[name]()
      .then((mod) => {
        const { Pattern, default: fallback } = mod as { Pattern?: ComponentType; default?: ComponentType };
        if (current) setLoaded({ name, Pattern: Pattern || fallback });
      })
      .catch((error: Error) => { if (current) setLoaded({ name, error: error.message }); });
    return () => { current = false; };
  }, [name]);

  useEffect(() => { document.documentElement.dir = dir; }, [dir]);

  useEffect(() => {
    if (window.parent === window) return undefined;
    const root = document.getElementById('gaudi-preview-root');
    if (!root) return undefined;
    return observeFrameHeight(document, root, () => root.getBoundingClientRect().height,
      (height) => window.parent.postMessage({ type: 'gaudi-preview-size', name, height }, '*'));
  }, [name]);

  const Pattern = loaded?.name === name ? loaded.Pattern : undefined;
  return (
    <DirectionProvider dir={dir}>
      <div id='gaudi-preview-root' dir={dir} data-pattern={name} data-ready={Pattern ? 'true' : undefined} className={block ? 'p-3 sm:p-4' : 'flex min-h-40 items-start justify-center p-4 sm:p-8'}>
        <h1 className='sr-only'>{title}</h1>
        <div className='w-full min-w-0'>
          {loaded?.error ? <PreviewError message={loaded.error} /> : null}
          {Pattern ? (
            <PreviewBoundary><Pattern /></PreviewBoundary>
          ) : loaded?.error ? null : (
            <div className='h-32 animate-pulse rounded-(--ds-radius-card) bg-surface-muted' role='status' aria-label='Loading preview' />
          )}
        </div>
      </div>
    </DirectionProvider>
  );
}
