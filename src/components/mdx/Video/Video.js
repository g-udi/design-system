'use client';

import { useId, useRef, useState } from 'react';

import Button from '../../core/Button';
import Dialog from '../../core/Dialog';
import Icon from '../../core/Icon';
import { cn } from '../../../utilities/cn';

const slideIn = {
  'from-bottom': 'translate-y-8 opacity-0 data-open:translate-y-0 data-open:opacity-100',
  'from-left': '-translate-x-8 opacity-0 data-open:translate-x-0 data-open:opacity-100',
  'from-right': 'translate-x-8 opacity-0 data-open:translate-x-0 data-open:opacity-100',
  'from-top': '-translate-y-8 opacity-0 data-open:translate-y-0 data-open:opacity-100'
};

/** Panel entrance per `animationStyle`; the two legacy names alias their `from-*` equivalents. */
export const videoAnimationStyles = {
  'fade': 'opacity-0 data-open:opacity-100',
  ...slideIn,
  'from-center': 'scale-95 opacity-0 data-open:scale-100 data-open:opacity-100',
  'left-in-right-out': slideIn['from-left'],
  'top-in-bottom-out': slideIn['from-top']
};

const getEmbeddableSrc = (src) => {
  if (!src) return '';

  try {
    const url = new URL(src);

    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      const videoId = url.searchParams.get('v');

      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.hostname.includes('youtu.be')) {
      const videoId = url.pathname.replace('/', '');

      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {
    return src;
  }

  return src;
};

const PlayGlyph = () => (
  <span className='ml-0.5 size-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-current' aria-hidden='true' />
);

/**
 * Article video: a thumbnail button that plays the video in a modal player. YouTube watch and short
 * links are converted to embed URLs.
 *
 * @example
 * <Video videoSrc='https://www.youtube.com/watch?v=qh3NGpYRG3I' thumbnailSrc='/static/images/og-card.jpg' title='Walkthrough' />
 */
const Video = ({
  animationStyle = 'from-center',
  ariaLabel,
  autoplay = true,
  className,
  classNames = {},
  playLabel = 'Play video',
  thumbnailAlt = 'Video thumbnail',
  thumbnailSrc,
  title = 'Video',
  videoSrc
}) => {
  const [ open, setOpen ] = useState(false);
  const dialogTitleId = useId();
  const closeRef = useRef(null);
  const panelAnimation = videoAnimationStyles[animationStyle] || videoAnimationStyles['from-center'];
  const iframeSrc = getEmbeddableSrc(videoSrc);
  const srcWithAutoplay = autoplay && iframeSrc ? `${iframeSrc}${iframeSrc.includes('?') ? '&' : '?'}autoplay=1` : iframeSrc;

  return (
    <>
      <Button
        variant='ghost'
        tone='neutral'
        size='sm'
        className={ cn(
          'group relative block h-auto w-full overflow-hidden rounded-lg bg-surface-dark p-0 text-left shadow-sm ring-1 ring-border transition hover:bg-surface-dark hover:shadow-md', className, classNames.trigger
        ) }
        aria-label={ ariaLabel || playLabel }
        onClick={ () => setOpen(true) }
      >
        <span className='block aspect-video w-full overflow-hidden'>
          {thumbnailSrc ? (
            <img src={ thumbnailSrc } alt={ thumbnailAlt } className={ cn('size-full object-cover transition duration-300 group-hover:scale-[1.02]', classNames.thumbnail) } />
          ) : (
            <span className={ cn('flex size-full items-end bg-surface-muted p-4 text-sm text-text-muted', classNames.thumbnail) }>
              {thumbnailAlt}
            </span>
          )}
        </span>
        <span className='absolute inset-0 bg-black/20 transition group-hover:bg-black/10' aria-hidden='true' />
        <span className={ cn('absolute inset-0 flex items-center justify-center', classNames.playWrapper) }>
          <span data-slot='video-play-icon' className={ cn('inline-flex size-16 items-center justify-center rounded-control bg-surface/95 text-accent shadow-lg transition group-hover:scale-105', classNames.playButton) }>
            <PlayGlyph />
          </span>
        </span>
      </Button>

      <Dialog
        variant='bare'
        open={ open }
        onOpenChange={ setOpen }
        initialFocusRef={ closeRef }
        label={ title }
        contentProps={ { 'aria-labelledby': dialogTitleId, 'data-video-dialog': true } }
        className={ cn('fixed inset-0 z-[var(--ds-z-overlay)] flex items-center justify-center p-4 sm:p-6', classNames.dialog) }
      >
          <Button variant='ghost' tone='neutral' size='sm' className={ cn('absolute inset-0 h-auto rounded-none bg-black/80 p-0 backdrop-blur-sm hover:bg-black/80', classNames.overlay) } aria-label='Close video dialog' onClick={ () => setOpen(false) } />
          <div
            className={ cn(
              'relative z-10 w-full max-w-5xl overflow-hidden rounded-lg bg-black shadow-2xl transition duration-200', panelAnimation, classNames.panel
            ) }
            data-open
          >
            <div className='flex items-center justify-between border-b border-text-inverse/10 bg-surface-dark px-4 py-3'>
              <h2 id={ dialogTitleId } className={ cn('text-sm font-semibold text-text-inverse', classNames.title) }>{title}</h2>
              <Button
                ref={ closeRef }
                variant='ghost'
                tone='neutral'
                size='sm'
                className={ cn('size-11 rounded-control bg-text-inverse/10 p-0 text-text-inverse hover:bg-text-inverse/20 hover:text-text-inverse', classNames.close) }
                aria-label='Close video dialog'
                onClick={ () => setOpen(false) }
              >
                <Icon name='X' decorative size='sm' />
              </Button>
            </div>
            <div className={ cn('aspect-video w-full bg-black', classNames.video) }>
              {srcWithAutoplay ? (
                <iframe
                  title={ title }
                  src={ srcWithAutoplay }
                  className='size-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  allowFullScreen
                />
              ) : null}
            </div>
          </div>
      </Dialog>
    </>
  );
};

export default Video;
