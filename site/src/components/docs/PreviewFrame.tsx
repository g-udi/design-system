'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Icon from '@gaudi/design-system/core/Icon';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { basePath } from '@/lib/nav';

export type Viewport = 'desktop' | 'tablet' | 'mobile';
const VIEWPORT_WIDTH: Record<Viewport, number | null> = { desktop: null, tablet: 768, mobile: 375 };

const widths = [
  { value: 'desktop', label: <><Icon name='Laptop' decorative size='sm' /><span className='sr-only'>Desktop</span></> },
  { value: 'tablet', label: <><Icon name='Tablet' decorative size='sm' /><span className='sr-only'>Tablet ({VIEWPORT_WIDTH.tablet}px)</span></> },
  { value: 'mobile', label: <><Icon name='Smartphone' decorative size='sm' /><span className='sr-only'>Mobile ({VIEWPORT_WIDTH.mobile}px)</span></> }
];

export function PreviewWidthControl({ title, value, onChange }: { title: string; value: Viewport; onChange: (next: Viewport) => void }) {
  return <ToggleGroup type='single' size='sm' label={`${title} preview width`} value={value} options={widths} onValueChange={(next: string) => next && onChange(next as Viewport)} />;
}

export function PreviewViewport({ title, viewport, children }: { title: string; viewport: Viewport; children: ReactNode }) {
  const width = VIEWPORT_WIDTH[viewport];
  return (
    <div className='site-preview-stage overflow-x-auto' data-viewport={viewport} role='region' aria-label={`${title} preview viewport`} tabIndex={0}>
      <div className='mx-auto transition-[width] duration-200 motion-reduce:transition-none' style={{ width: width ? `${width}px` : '100%', maxWidth: width ? 'none' : '100%' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Renders a pattern in an isolated document (/preview/<name>) so media queries respond to the chosen
 * width. The frame reports its height; theme and preset follow the page through shared storage.
 */
export function PreviewFrame({ name, title, viewport, dir, block }: { name: string; title: string; viewport: Viewport; dir: 'ltr' | 'rtl'; block: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(block ? 780 : 320);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== 'gaudi-preview-size') return;
      setHeight(Math.min(Math.max(Math.ceil(event.data.height), 160), 1400));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: 'gaudi-preview-dir', dir }, '*');
  }, [dir]);

  return (
    <PreviewViewport title={title} viewport={viewport}>
      <iframe
        ref={frame}
        src={`${basePath}/preview/${name}#dir=${dir}`}
        title={`${title} preview`}
        loading='lazy'
        className='block w-full border-0 bg-background'
        style={{ height }}
        data-testid='preview-frame'
      />
    </PreviewViewport>
  );
}
