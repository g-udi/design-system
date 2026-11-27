'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { CardRoot } from '@gaudi/design-system/core/Card';
import Icon from '@gaudi/design-system/core/Icon';
import { useTheme } from '@gaudi/design-system/themes';
import { siteConfig, storybookStoryUrl } from '../../../site.config';
import { observeFrameHeight } from '@/lib/frameHeight';
import { PreviewViewport, PreviewWidthControl, type Viewport } from './PreviewFrame';

/**
 * A Storybook story rendered in place, for owners whose examples have no copy-in pattern. The frame
 * follows the site's colour mode and preset; when Storybook is served from the same origin (the
 * production build under /storybook) the frame also sizes itself to the story.
 */
export function StoryExample({ id, title }: { id: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [height, setHeight] = useState(420);
  const { theme, resolvedMode } = useTheme();
  const globals = `theme:${resolvedMode === 'dark' ? 'dark' : 'light'}${theme ? `;gaudiTheme:${theme}` : ''}`;
  const src = `${siteConfig.storybookEmbedUrl}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=${globals}`;

  useEffect(() => {
    const element = frame.current;
    if (!element) return undefined;
    let stop: (() => void) | undefined;
    const measure = () => {
      try {
        const doc = element.contentDocument;
        if (!doc?.body) return;
        stop?.();
        stop = observeFrameHeight(doc, doc.body, () => doc.body.scrollHeight,
          (next) => setHeight(Math.min(Math.max(next, 200), 1400)));
      } catch {
        // A cross-origin Storybook (the dev server) keeps the default height.
      }
    };
    element.addEventListener('load', measure);
    return () => { element.removeEventListener('load', measure); stop?.(); };
  }, [src]);

  return (
    <CardRoot variant='outline' padding='none' className='not-prose my-4' data-story={id} data-testid='story-example'>
      <div className='flex flex-wrap items-center justify-end gap-1 border-b border-border px-2 py-1.5'>
        <PreviewWidthControl title={title} value={viewport} onChange={setViewport} />
        <Button href={storybookStoryUrl(id)} target='_blank' rel='noreferrer' variant='ghost' tone='neutral' size='sm'>
          Storybook <Icon name='ExternalLink' decorative size='xs' />
        </Button>
      </div>
      <PreviewViewport title={title} viewport={viewport}>
        <iframe ref={frame} src={src} title={`${title} example`} loading='lazy' className='block w-full border-0 bg-background' style={{ height }} />
      </PreviewViewport>
    </CardRoot>
  );
}
