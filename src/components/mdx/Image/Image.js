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
import resolveNextImage from '../../../utilities/resolveNextImage';

const NextImage = resolveNextImage(NextImageModule);

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
const Image = ({ alt, caption, darkSrc, fallback, src, ...rest }) => {
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ currentSrc, setCurrentSrc ] = useState(src);
  const [ erroredSources, setErroredSources ] = useState({});
  const imageAlt = alt ?? caption ?? '';

  useEffect(() => {
    setCurrentSrc(src);
    setErroredSources({});
  }, [ darkSrc, fallback, src ]);

  const getDisplaySrc = (imageSrc) => (fallback && erroredSources[imageSrc] ? fallback : imageSrc);

  const handleImageClick = (imageSrc) => {
    setCurrentSrc(imageSrc);
    setIsModalOpen(true);
  };

  const createImageProps = (imageSrc, className) => {
    return {
      ...rest,
      'alt': imageAlt,
      'blurDataURL': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
      className,
      'loading': 'lazy',
      'onError': () => {
        if (fallback && imageSrc !== fallback) setErroredSources((sources) => ({ ...sources, [imageSrc]: true }));
      },
      'placeholder': 'blur',
      'priority': false,
      'sizes': '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      'src': imageSrc
    };
  };

  const renderImage = (imageSrc, className = '') => {
    const displaySrc = getDisplaySrc(imageSrc);

    if (!displaySrc) return null;

    const imageProps = createImageProps(displaySrc, `cursor-pointer hover:opacity-90 transition-opacity duration-200 ${className || rest.className || ''}`);
    const {
      alt: nativeAlt,
      blurDataURL,
      className: nativeClassName,
      loading,
      onError,
      placeholder,
      priority,
      sizes,
      src: nativeSrc,
      ...nativeImageProps
    } = imageProps;

    void blurDataURL;
    void placeholder;
    void priority;

    return NextImage ? <NextImage { ...imageProps } /> : <img { ...nativeImageProps } alt={ nativeAlt } className={ nativeClassName } loading={ loading } onError={ onError } sizes={ sizes } src={ nativeSrc } />;
  };

  return (
    <figure>
      <Button variant='ghost' tone='neutral' size='sm' className={ `mx-auto block max-w-full p-0 hover:bg-transparent dark:hover:bg-transparent${darkSrc ? ' dark:hidden' : ''}` } onClick={ () => handleImageClick(getDisplaySrc(src)) } aria-label={ imageAlt ? `Open image: ${imageAlt}` : 'Open image preview' }>
        {renderImage(src, darkSrc ? `${rest.className || ''} dark:hidden` : rest.className)}
      </Button>
      {darkSrc && (
        <Button variant='ghost' tone='neutral' size='sm' className='mx-auto hidden max-w-full p-0 hover:bg-transparent dark:block dark:hover:bg-transparent' onClick={ () => handleImageClick(getDisplaySrc(darkSrc)) } aria-label={ imageAlt ? `Open image: ${imageAlt}` : 'Open image preview' }>
          {renderImage(darkSrc, rest.className)}
        </Button>
      )}
      {caption && <figcaption className='mt-3 text-center text-sm text-gray-500 dark:text-gray-400'>{caption}</figcaption>}

      <ImageModal
        isOpen={ isModalOpen }
        onClose={ () => setIsModalOpen(false) }
        src={ currentSrc }
        alt={ imageAlt }
        caption={ caption }
      />
    </figure>
  );
};

export default Image;
