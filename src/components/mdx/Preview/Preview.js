'use client';

/**
 * Link Preview Component
 *
 * @description A link preview component that fetches and displays metadata for external URLs.
 * It shows links with favicons and titles, and optionally displays rich hover cards with images.
 * Data fetching (cache, dedup, aborts) lives in the sibling usePreviewData hook.
 *
 * @author Ahmad Assaf
 * @version 3.0.0
 */

import { memo, useEffect, useMemo, useState } from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import Icon from '../../core/Icon';
import Link from '../../core/Link';
import Pill from '../../core/Pill';
import formatDate from '../../../utilities/formatDate';

import { getPreviewImageUrl, NPM_HOSTNAME, usePreviewData } from './usePreviewData';

export { usePreviewData } from './usePreviewData';

const bodyTextClass = 'text-gray-900 dark:text-gray-100';
const CONFIRMED_UNAVAILABLE_STATUSES = [ 400, 404, 410 ];

export const PreviewLoadingSkeleton = ({ className = '' }) => (
  <span className={ `inline-flex items-start ${className}` } aria-hidden='true'>
    <span className='inline-block h-4 w-4 mr-1 bg-gray-200 rounded animate-pulse flex-shrink-0 dark:bg-gray-700' />
    <span className='inline-block h-4 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-700' />
  </span>
);

/**
 * Helper function to normalize favicon URLs
 */
const normalizeFaviconURL = (favicon) => {
  const normalizedFavicon = String(favicon || '').trim();

  if (!normalizedFavicon) return null;
  if (normalizedFavicon.startsWith('//')) return `https:${normalizedFavicon}`;
  if (normalizedFavicon.startsWith('/')) return normalizedFavicon;

  try {
    const faviconUrl = new URL(normalizedFavicon.includes('://') ? normalizedFavicon : `https://${normalizedFavicon}`);

    return faviconUrl.protocol === 'http:' || faviconUrl.protocol === 'https:' ? faviconUrl.href : null;
  } catch {
    return null;
  }
};

/**
 * Helper function to format titles
 */
const formatTitle = (title, url) => {
  if (!title) try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }

  // Special handling for GitHub titles (format: "GitHub - owner/repo: description")
  if (title.startsWith('GitHub - ')) return title.substring('GitHub - '.length).split(':')[0].trim();

  let cleanTitle = title.trim();

  // Remove generic site-name suffixes that add noise
  const siteSuffixes = [
    / - MDN Web Docs$/i,
    / \| MDN$/i,
    / - Wikipedia$/i,
    / - npm$/i,
    / · GitHub$/i,
    / - Stack Overflow$/i
  ];

  for (const suffix of siteSuffixes) cleanTitle = cleanTitle.replace(suffix, '');

  const maxLength = 60;

  return cleanTitle.length > maxLength ? `${cleanTitle.substring(0, maxLength - 3)}...` : cleanTitle;
};

const formatPreviewDate = (date) => {
  return formatDate(date);
};

/**
 * Helper function to get platform-specific icon (only when no favicon is available)
 */
const getPlatformIcon = (url, type, hasFavicon) => {
  if (hasFavicon) return null;

  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (type === 'video' || hostname.includes('youtube.com') || hostname.includes('youtu.be')) return (
      <svg className='h-3 w-3 ml-1 text-red-500' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path d='M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l4 2A1 1 0 0020 14V6a1 1 0 00-1.447-.894l-4 2z' />
      </svg>
    );

    if (type === 'repository' || hostname.includes('github.com')) return (
      <svg className='h-3 w-3 ml-1 text-gray-600 dark:text-gray-300' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path fillRule='evenodd' d='M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-1.02-.01-1.86-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.89 1.52 2.33 1.08 2.9.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.02-2.68-.1-.25-.44-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0110 4.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.54 1.37.2 2.39.1 2.64.64.7 1.02 1.59 1.02 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0020 10c0-5.523-4.477-10-10-10z' clipRule='evenodd' />
      </svg>
    );

    if (type === 'package' || hostname.includes(NPM_HOSTNAME)) return (
      <svg className='h-3 w-3 ml-1 text-red-500' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path d='M10 2.5V5h5v10H5V5h2.5V2.5h2.5zm0 5H7.5V10H10V7.5zm0 5H7.5V15H10v-2.5z' />
      </svg>
    );
  } catch {

    // Ignore URL parsing errors
  }

  return null;
};

/**
 * Favicon image that swaps to a fallback element via React state on load error
 */
const Favicon = ({ src, className, fallback = null }) => {
  const [ failed, setFailed ] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [ src ]);

  if (!src || failed) return fallback;

  return (
    <img
      className={ className }
      src={ src }
      width={ 16 }
      height={ 16 }
      alt=''
      onError={ () => setFailed(true) }
    />
  );
};

const getInlineIconName = (url) => {
  try {
    const { hostname } = new URL(url);

    if (hostname === 'medium.com' || hostname.endsWith('.medium.com')) return 'Medium';
  } catch {

    // Invalid URLs use the generic link icon.
  }

  return 'LinkIcon';
};

/**
 * Link preview component with favicon and metadata
 *
 * @param {Object} props - Component props
 * @param {string} props.url - The URL to preview and link to
 * @param {string} [props.title] - Optional custom title to override fetched title
 * @param {string} [props.className] - Additional CSS classes for styling
 * @param {boolean} [props.defaultOpen] - Start the hover preview open for deterministic demos
 * @param {boolean} [props.internal] - Render a local app link without remote preview fetching
 * @param {Object} [props.previewData] - Preloaded preview metadata for docs and deterministic renders
 * @param {boolean} [props.showImage] - Show image preview on hover (default: true)
 * @param {number} [props.timeout] - Request timeout in milliseconds (default: 10000)
 * @param {Function} [props.onLoad] - Callback when preview loads successfully
 * @param {Function} [props.onError] - Callback when preview fails to load
 * @param {React.ReactNode} [props.fallback] - Custom fallback component
 * @returns {JSX.Element} The rendered preview component
 */
const Preview = memo(function Preview({
  url,
  title,
  className = '',
  defaultOpen = false,
  internal = false,
  previewData = null,
  showImage = true,
  timeout = 10000,
  onLoad,
  onError,
  fallback
}) {
  const isInternal = internal || Boolean(url?.startsWith('/'));

  const [ isHoverCardOpen, setIsHoverCardOpen ] = useState(defaultOpen);
  const [ imageLoaded, setImageLoaded ] = useState(false);
  const [ imageError, setImageError ] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { data, loading, error } = usePreviewData(url, isInternal ? null : title, { previewData, 'skip': false, timeout });

  useEffect(() => {
    if (data && !data.error && onLoad) onLoad(data);
  }, [ data, onLoad ]);

  useEffect(() => {
    if (error && onError) onError(error);
  }, [ error, onError ]);

  const previewImageUrl = useMemo(() => {
    if (!showImage || !data || isInternal || !url) return null;

    return getPreviewImageUrl(url, data);
  }, [ url, data, isInternal, showImage ]);

  const normalizedFavicon = useMemo(() => normalizeFaviconURL(data?.favicon), [ data?.favicon ]);

  const formattedTitle = useMemo(() => {
    try {
      return formatTitle(data?.title || title, url);
    } catch {
      return title || url;
    }
  }, [ data?.title, title, url ]);

  // Internal previews use the source link text inline while retaining the
  // canonical post title inside the richer hover card.
  const linkTitle = isInternal && title ? title : formattedTitle;

  const siteName = useMemo(() => {
    if (data?.siteName) return data.siteName;

    try {
      const hostname = new URL(url).hostname.replace('www.', '');

      return hostname.charAt(0).toUpperCase() + hostname.slice(1);
    } catch {
      return null;
    }
  }, [ data?.siteName, url ]);

  // All hooks are above this line — conditional returns are safe from here on
  const inlineIconName = getInlineIconName(url);

  if (!url) return <span className='text-gray-500'>No URL provided</span>;

  if (loading) return <PreviewLoadingSkeleton className={ className } />;

  if (fallback && (error || data?.error || data?.status === 404)) return <>{fallback}</>;

  if (data?.error) {
    const isConfirmedUnavailable = CONFIRMED_UNAVAILABLE_STATUSES.includes(Number(data.status));

    return (
      <span className={ `inline-flex items-center align-top ${className}` }>
        <Icon
          name={ isConfirmedUnavailable ? 'LinkSlashIcon' : inlineIconName }
          size='sm'
          decorative
          className={ `m-0 mr-1 inline-block align-text-top ${isConfirmedUnavailable ? 'text-red-500' : 'text-gray-400'}` }
        />
        <Link
          href={ url }
          tone={ isConfirmedUnavailable ? 'red' : 'blue' }
          aria-label={ isConfirmedUnavailable ? `${linkTitle} (link may be unavailable)` : linkTitle }
        >
          {linkTitle}
        </Link>
      </span>
    );
  }

  if (!data) return (
    <span className={ `inline-flex items-center align-top ${className}` }>
      <Icon name={ inlineIconName } size='sm' decorative className='m-0 mr-1 text-gray-400 inline-block align-text-top' />
      <Link href={ url } tone='blue'>
        {title || url}
      </Link>
    </span>
  );

  const linkContent = (
    <>
      <Favicon
        src={ inlineIconName === 'Medium' ? null : normalizedFavicon }
        className='h-4 w-4 !m-0 !mr-1 flex-shrink-0 inline-block align-text-top'
        fallback={ (
          <Icon
            name={ inlineIconName }
            size='sm'
            decorative
            className={ `m-0 mr-1 inline-block align-text-top ${inlineIconName === 'Medium' ? 'text-gray-900 dark:text-gray-100' : 'text-blue-500'}` }
          />
        ) }
      />
      <Link
        tone='blue'
        href={ url }
        aria-label={ `${linkTitle}${data?.siteName ? ` - ${data.siteName}` : ''}` }
      >
        {linkTitle}
      </Link>
      {getPlatformIcon(url, data?.type, !!normalizedFavicon)}
      {data?.duration && (
        <span className='text-xs text-gray-500 ml-1'>{data.duration}</span>
      )}
      {!isInternal && data?.readingTime && (
        <span className='text-xs text-gray-500 ml-1'>· {data.readingTime}</span>
      )}
    </>
  );

  const hasPreviewDetails = !!(
    previewImageUrl ||
    data?.description ||
    data?.excerpt ||
    data?.publishedTime ||
    data?.readingTime ||
    data?.siteName !== 'Internal'
  );

  const shouldShowHoverCard = showImage && data && !loading && hasPreviewDetails;

  if (!shouldShowHoverCard) return (
    <span
      className={ `inline-flex items-center align-top ${className}` }
      data-preview-url={ url }
      data-preview-internal={ isInternal ? 'true' : undefined }
    >
      {linkContent}
    </span>
  );

  const motionProps = shouldReduceMotion
    ? {
      'animate': { 'opacity': 1 },
      'exit': { 'opacity': 1 },
      'initial': false
    }
    : {
      'animate': { 'opacity': 1, 'scale': 1, 'transition': { 'duration': 0.15 }, 'y': 0 },
      'exit': { 'opacity': 1, 'scale': 0.96, 'transition': { 'duration': 0.1 }, 'y': 8 },
      'initial': { 'opacity': 1, 'scale': 0.96, 'y': 8 }
    };

  return (
    <HoverCardPrimitive.Root
      open={ isHoverCardOpen }
      openDelay={ 200 }
      closeDelay={ 100 }
      onOpenChange={ (open) => {
        setIsHoverCardOpen(open);

        if (!open) {
          setImageLoaded(false);
          setImageError(false);
        }
      } }
    >
      <HoverCardPrimitive.Trigger asChild>
        <span
          className={ `inline-flex items-center align-top ${className}` }
          data-preview-url={ url }
          data-preview-internal={ isInternal ? 'true' : undefined }
        >
          {linkContent}
        </span>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content className='z-50' sideOffset={ 8 } align='start'>
          <AnimatePresence>
            {isHoverCardOpen && (
              <motion.div
                { ...motionProps }
                className={ `rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 ${isInternal ? 'p-4' : 'overflow-hidden'}` }
                style={{
                  'maxWidth': 'calc(100vw - 2rem)',
                  'width': isInternal ? '384px' : '320px'
                }}
              >
                {isInternal ? (
                  <div>
                    {data?.category && (
                      <div className='mb-3'>
                        <span className='inline-block rounded px-2 py-1 text-xs font-medium bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-100'>
                          {data.category}
                        </span>
                      </div>
                    )}

                    <h3 className={ `mb-2 line-clamp-2 text-lg font-bold ${bodyTextClass}` }>
                      {formattedTitle}
                    </h3>

                    {(data?.summary || data?.description) && (
                      <p className={ `mb-3 line-clamp-3 text-sm ${bodyTextClass}` }>
                        {data.summary || data.description}
                      </p>
                    )}

                    {(data?.publishedTime || data?.readingTime) && (
                      <div className={ `mb-3 flex flex-wrap gap-3 text-xs ${bodyTextClass}` }>
                        {data?.publishedTime && (
                          <div className='flex items-center gap-1'>
                            <Icon name='Calendar' size='xs' decorative />
                            <span>{formatPreviewDate(data.publishedTime)}</span>
                          </div>
                        )}
                        {data?.readingTime && (
                          <div className='flex items-center gap-1'>
                            <Icon name='Clock' size='xs' decorative />
                            <span>{data.readingTime}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {Array.isArray(data?.tags) && data.tags.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {data.tags.slice(0, 5).map((tag) => (
                          <Pill
                            key={ tag }
                            tone='gray'
                            variant='soft'
                            size='xs'
                            radius='md'
                            className='my-0 mr-0 normal-case tracking-normal !bg-gray-50 !text-gray-900 dark:!bg-gray-800 dark:!text-gray-100'
                          >
                            {tag}
                          </Pill>
                        ))}
                        {data.tags.length > 5 && (
                          <span className={ `self-center text-xs ${bodyTextClass}` }>
                            +{data.tags.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Special content display for Wikipedia instead of image */}
                    {data?.type === 'wikipedia' && data?.excerpt ? (
                      <div className='bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-800 dark:to-gray-900'>
                        <div className='flex items-center gap-2 mb-3'>
                          <svg className={ `h-5 w-5 ${bodyTextClass}` } fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
                            <path d='M9 4.804A1 1 0 017.53 5.02L5.032 9.513a1 1 0 00.268 1.537l2.5 1.5a1 1 0 001.2-.268l2.5-3.5a1 1 0 00-.134-1.366l-2-1.612zM11 4.804a1 1 0 011.47.216l2.498 4.493a1 1 0 01-.268 1.537l-2.5 1.5a1 1 0 01-1.2-.268l-2.5-3.5a1 1 0 01.134-1.366l2-1.612z' />
                          </svg>
                          <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Wikipedia Article</span>
                        </div>
                        <div className='space-y-2'>
                          <h4 className='text-base font-bold text-gray-900 dark:text-gray-100'>
                            {data.articleName || formattedTitle}
                          </h4>
                          {data.description && (
                            <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                              {data.description}
                            </p>
                          )}
                          <p className={ `text-xs leading-relaxed ${bodyTextClass}` }>
                            {data.excerpt}
                          </p>
                        </div>
                      </div>
                    ) : (

                    /* Regular image preview for other sites */
                      previewImageUrl && !imageError && (
                        <div className='relative w-full h-48 bg-gray-100 dark:bg-gray-800'>
                          {!imageLoaded && (
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <div className='animate-pulse'>
                                <Icon name='PhotoIcon' size='xl' decorative className='text-gray-500' />
                              </div>
                            </div>
                          )}
                          <img
                            src={ previewImageUrl }
                            alt={ formattedTitle }
                            className='h-full w-full object-cover'
                            onLoad={ () => {
                              setImageLoaded(true);
                              setImageError(false);
                            } }
                            onError={ () => {
                              setImageError(true);
                              setImageLoaded(false);
                            } }
                          />
                        </div>
                      )
                    )}

                    {/* Content Footer - Skip for Wikipedia since content is shown above */}
                    {data?.type !== 'wikipedia' && (
                      <div className='p-4'>
                        <div className='flex items-start gap-2'>
                          <Favicon
                            src={ normalizedFavicon }
                            className='h-4 w-4 mt-0.5 flex-shrink-0'
                          />
                          <div className='flex-1 min-w-0'>
                            <h3 className='font-medium text-sm text-gray-900 line-clamp-2 dark:text-gray-100'>
                              {formattedTitle}
                            </h3>

                            {data?.description && (
                              <p className={ `mt-1 line-clamp-2 text-xs ${bodyTextClass}` }>
                                {data.description}
                              </p>
                            )}

                            <div className={ `flex items-center gap-2 mt-2 text-xs ${bodyTextClass}` }>
                              <span>{siteName}</span>
                              {data?.publishedTime && (
                                <>
                                  <span>·</span>
                                  <span>{formatPreviewDate(data.publishedTime)}</span>
                                </>
                              )}
                              {data?.readingTime && (
                                <>
                                  <span>·</span>
                                  <span>{data.readingTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
});

export default Preview;
