'use client';

import { useState } from 'react';

import Button from '../../core/Button';
import Dialog from '../../core/Dialog';
import Icon from '../../core/Icon';
import { getYouTubeVideoId } from '../../core/LinkPreview/linkPreviewData.js';
import { cn } from '../../../utilities/cn';
import { videoAnimationStyles } from './videoAnimationStyles.js';

// Watch and short links become embed URLs; embed URLs and other players keep their own parameters.
const getEmbeddableSrc = (src) => {
  const videoId = getYouTubeVideoId(src);
  return videoId && !src.includes('/embed/') ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : src || '';
};

const addAutoplay = (src) => {
  if (!src) return src;
  const hashAt = src.indexOf('#');
  const hash = hashAt === -1 ? '' : src.slice(hashAt);
  const path = hashAt === -1 ? src : src.slice(0, hashAt);
  const queryAt = path.indexOf('?');
  const query = new URLSearchParams(queryAt === -1 ? '' : path.slice(queryAt + 1));
  query.set('autoplay', '1');
  return `${queryAt === -1 ? path : path.slice(0, queryAt)}?${query}${hash}`;
};

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
  const panelAnimation = videoAnimationStyles[animationStyle] || videoAnimationStyles['from-center'];
  const iframeSrc = getEmbeddableSrc(videoSrc);
  const srcWithAutoplay = autoplay ? addAutoplay(iframeSrc) : iframeSrc;

  return (
    <Dialog
      open={ open }
      onOpenChange={ setOpen }
      title={ <span className={ cn('block wrap-anywhere', classNames.title) }>{title}</span> }
      closeLabel='Close video dialog'
      contentProps={ { 'aria-modal': 'true', 'data-video-dialog': true } }
      className={ cn('w-[min(64rem,calc(100vw-2rem))] overflow-x-hidden transition duration-200', panelAnimation, classNames.panel) }
      trigger={
        <Button
          variant='ghost'
          tone='neutral'
          size='sm'
          className={ cn(
            'group relative block h-auto w-full overflow-hidden rounded-lg bg-surface-dark p-0 text-left shadow-sm ring-1 ring-border transition hover:bg-surface-dark hover:shadow-md', className, classNames.trigger
          ) }
          aria-label={ ariaLabel || playLabel }
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
          <span className='absolute inset-0 bg-surface-dark/20 transition group-hover:bg-surface-dark/10' aria-hidden='true' />
          <span className={ cn('absolute inset-0 flex items-center justify-center', classNames.playWrapper) }>
            <span data-slot='video-play-icon' className={ cn('inline-flex size-16 items-center justify-center rounded-control bg-surface/95 text-accent shadow-lg transition group-hover:scale-105', classNames.playButton) }>
              <Icon name='Play' decorative className='ml-0.5 size-6 fill-current' />
            </span>
          </span>
        </Button>
      }
    >
      <div className={ cn('aspect-video w-full overflow-hidden rounded-control bg-surface-dark', classNames.video) }>
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
    </Dialog>
  );
};

export default Video;
