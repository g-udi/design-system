'use client';

/**
 * Image Component
 *
 * @description Wrapper around Next.js Image component for use in MDX content.
 * Supports captions, optional fallback and dark-mode image sources, and opens
 * images in a full-screen modal when clicked.
 *
 * @author Ahmad Assaf
 * @version 1.0.0
 */

import { useEffect, useState } from 'react';
import NextImageModule from 'next/image';

import ImageModal from '../ImageModal';
import Button from '../../core/Button';
import { cn } from '../../../utilities/cn';
import resolveNextImage from '../../../utilities/resolveNextImage';

const NextImage = resolveNextImage(NextImageModule);

// A 1x1 blur placeholder for next/image while the real image loads.
const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
const SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

/**
 * Renders an optimized image using Next.js Image component with modal functionality
 *
 * @param {Object} props - All Next.js Image component props
 * @param {string} [props.alt] - Alt text for the image. Falls back to caption; pass an empty string only for decorative images.
 * @param {string} [props.caption] - Optional image caption
 * @param {string} [props.darkSrc] - Optional dark-mode image source
 * @param {string} [props.fallback] - Optional fallback image source after load failure
 * @param {string} props.src - Image source URL
 * @param {...Object} props.rest - All standard Next.js Image props (width, height, etc.)
 * @returns {JSX.Element} A Next.js Image component with optimized loading and modal
 *
 * @example
 * // In MDX content:
 * <Image src="/static/images/example.jpg" width={500} height={300} />
 */
const Image = ({ alt, caption, className, darkSrc, fallback, src, ...rest }) => {
  const [ modalSrc, setModalSrc ] = useState(null);
  const [ erroredSources, setErroredSources ] = useState({});
  const imageAlt = alt ?? caption ?? '';
  const openLabel = imageAlt ? `Open image: ${imageAlt}` : 'Open image preview';

  useEffect(() => {
    setErroredSources({});
  }, [ darkSrc, fallback, src ]);

  const displaySrc = (imageSrc) => (fallback && erroredSources[imageSrc] ? fallback : imageSrc);

  // One trigger per theme source: the light image hides in dark mode when a dark variant exists.
  const renderTrigger = (imageSrc, themeClassName) => {
    const resolvedSrc = displaySrc(imageSrc);

    if (!resolvedSrc) return null;

    const imageProps = {
      ...rest,
      'alt': imageAlt,
      'className': cn('cursor-pointer transition-opacity duration-200 hover:opacity-90', className),
      'loading': rest.loading ?? (rest.priority || rest.preload ? undefined : 'lazy'),
      'onError': (event) => {
        rest.onError?.(event);
        if (fallback && imageSrc !== fallback) setErroredSources((sources) => ({ ...sources, [imageSrc]: true }));
      },
      'sizes': rest.sizes || SIZES,
      'src': resolvedSrc
    };

    return (
      <Button variant='ghost' tone='neutral' size='sm' className={ cn('mx-auto block h-auto max-w-full p-0 hover:bg-transparent', themeClassName) } onClick={ () => setModalSrc(resolvedSrc) } aria-label={ openLabel }>
        {NextImage ? <NextImage { ...imageProps } blurDataURL={ rest.blurDataURL ?? BLUR_DATA_URL } placeholder={ rest.placeholder ?? 'blur' } /> : <img { ...imageProps } src={ resolvedSrc } alt={ imageAlt } />}
      </Button>
    );
  };

  return (
    <figure>
      {renderTrigger(src, darkSrc ? 'dark:hidden' : undefined)}
      {darkSrc ? renderTrigger(darkSrc, 'hidden dark:block') : null}
      {caption ? <figcaption className='mt-3 wrap-anywhere text-center text-sm text-text-muted'>{caption}</figcaption> : null}

      <ImageModal
        isOpen={ Boolean(modalSrc) }
        onClose={ () => setModalSrc(null) }
        src={ modalSrc }
        alt={ imageAlt }
        caption={ caption }
      />
    </figure>
  );
};

export default Image;
