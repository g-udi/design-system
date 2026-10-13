'use client';

import { useEffect, useRef, useState } from 'react';
import { basePath } from '@/lib/nav';

export type Viewport = 'desktop' | 'tablet' | 'mobile';
export const VIEWPORT_WIDTH: Record<Viewport, number | null> = { desktop: null, tablet: 768, mobile: 375 };

/**
 * Renders a pattern in an isolated document (/preview/<name>) so media queries respond to the chosen
 * width. The frame reports its height; theme and preset follow the page through shared storage.
 */
export function PreviewFrame({ name, title, viewport, dir, block }: { name: string; title: string; viewport: Viewport; dir: 'ltr' | 'rtl'; block: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(block ? 780 : 320);
  const width = VIEWPORT_WIDTH[viewport];

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
    <div className='site-preview-stage overflow-x-auto' data-viewport={viewport}>
      <div className='mx-auto transition-[width] duration-200' style={{ width: width ? `${width}px` : '100%', maxWidth: width ? 'none' : '100%' }}>
        <iframe
          ref={frame}
          src={`${basePath}/preview/${name}#dir=${dir}`}
          title={`${title} preview`}
          loading='lazy'
          className='block w-full border-0 bg-background'
          style={{ height }}
          data-testid='preview-frame'
        />
      </div>
    </div>
  );
}
