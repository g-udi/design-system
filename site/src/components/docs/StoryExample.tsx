'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { useTheme } from '@gaudi/design-system/themes';
import { siteConfig, storybookStoryUrl } from '../../../site.config';
import { VIEWPORT_WIDTH, type Viewport } from './PreviewFrame';

const viewportOptions = [
  { value: 'desktop', label: <><Icon name='Laptop' decorative size='sm' /><span className='sr-only'>Desktop</span></> },
  { value: 'tablet', label: <><Icon name='Tablet' decorative size='sm' /><span className='sr-only'>Tablet (768px)</span></> },
  { value: 'mobile', label: <><Icon name='Smartphone' decorative size='sm' /><span className='sr-only'>Mobile (375px)</span></> }
];

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
  const width = VIEWPORT_WIDTH[viewport];
  const globals = `theme:${resolvedMode === 'dark' ? 'dark' : 'light'}${theme ? `;gaudiTheme:${theme}` : ''}`;
  const src = `${siteConfig.storybookEmbedUrl}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story&globals=${globals}`;

  useEffect(() => {
    const element = frame.current;
    if (!element) return undefined;
    let observer: ResizeObserver | undefined;
    const measure = () => {
      try {
        const body = element.contentDocument?.body;
        if (!body) return;
        const update = () => setHeight(Math.min(Math.max(Math.ceil(body.scrollHeight), 200), 1400));
        update();
        observer?.disconnect();
        observer = new ResizeObserver(update);
        observer.observe(body);
      } catch {
        // A cross-origin Storybook (the dev server) keeps the default height.
      }
    };
    element.addEventListener('load', measure);
    return () => { element.removeEventListener('load', measure); observer?.disconnect(); };
  }, [src]);

  return (
    <div className='not-prose my-4 overflow-hidden rounded-(--ds-radius-card) border border-border bg-background' data-story={id} data-testid='story-example'>
      <div className='flex flex-wrap items-center justify-end gap-1 border-b border-border px-2 py-1.5'>
        <ToggleGroup type='single' size='sm' label={`${title} preview width`} value={viewport}
          onValueChange={(value: string) => value && setViewport(value as Viewport)} options={viewportOptions} />
        <Button href={storybookStoryUrl(id)} target='_blank' rel='noreferrer' variant='ghost' tone='neutral' size='sm'>
          Storybook <Icon name='ExternalLink' decorative size='xs' />
        </Button>
      </div>
      <div className='site-preview-stage overflow-x-auto'>
        <div className='mx-auto transition-[width] duration-200' style={{ width: width ? `${width}px` : '100%', maxWidth: width ? 'none' : '100%' }}>
          <iframe ref={frame} src={src} title={`${title} example`} loading='lazy' className='block w-full border-0 bg-background' style={{ height }} />
        </div>
      </div>
    </div>
  );
}
