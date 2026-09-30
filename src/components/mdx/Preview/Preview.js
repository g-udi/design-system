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

import Icon from '../../core/Icon';
import Link from '../../core/Link';
import Pill from '../../core/Pill';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../core/Popover';
import Skeleton from '../../core/Skeleton';
import { cn } from '../../../utilities/cn';
import formatDate from '../../../utilities/formatDate';

import { getPreviewImageUrl, NPM_HOSTNAME, usePreviewData } from './usePreviewData';

export { usePreviewData } from './usePreviewData';

const CONFIRMED_UNAVAILABLE_STATUSES = [ 400, 404, 410 ];
const inlineClass = 'inline-flex items-center align-top';
const inlineIconClass = 'm-0 mr-1 inline-block align-text-top';

export const PreviewLoadingSkeleton = ({ className }) => (
  <span className={ cn('inline-flex items-start gap-1', className) } aria-hidden='true'>
    <Skeleton className='inline-block size-4 shrink-0' />
    <Skeleton className='inline-block h-4 w-32' />
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

/**
 * Helper function to get platform-specific icon (only when no favicon is available)
 */
const getPlatformIcon = (url, type, hasFavicon) => {
  if (hasFavicon) return null;

  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (type === 'video' || hostname.includes('youtube.com') || hostname.includes('youtu.be')) return (
      <svg className='ml-1 size-3 text-danger' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path d='M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l4 2A1 1 0 0020 14V6a1 1 0 00-1.447-.894l-4 2z' />
      </svg>
    );

    if (type === 'repository' || hostname.includes('github.com')) return (
      <svg className='ml-1 size-3 text-text-muted' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
        <path fillRule='evenodd' d='M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-1.02-.01-1.86-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.89 1.52 2.33 1.08 2.9.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.02-2.68-.1-.25-.44-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0110 4.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.54 1.37.2 2.39.1 2.64.64.7 1.02 1.59 1.02 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0020 10c0-5.523-4.477-10-10-10z' clipRule='evenodd' />
      </svg>
    );

    if (type === 'package' || hostname.includes(NPM_HOSTNAME)) return (
      <svg className='ml-1 size-3 text-danger' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
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
  const [ imageLoaded, setImageLoaded ] = useState(false);
  const [ imageError, setImageError ] = useState(false);

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

  if (!url) return <span className='text-text-muted'>No URL provided</span>;

  if (loading) return <PreviewLoadingSkeleton className={ className } />;

  if (fallback && (error || data?.error || data?.status === 404)) return <>{fallback}</>;

  if (data?.error) {
    const isConfirmedUnavailable = CONFIRMED_UNAVAILABLE_STATUSES.includes(Number(data.status));

    return (
      <span className={ cn(inlineClass, className) }>
        <Icon
          name={ isConfirmedUnavailable ? 'LinkSlashIcon' : inlineIconName }
          size='sm'
          decorative
          className={ cn(inlineIconClass, isConfirmedUnavailable ? 'text-danger' : 'text-text-subtle') }
        />
        <Link
          href={ url }
          tone={ isConfirmedUnavailable ? 'danger' : 'accent' }
          aria-label={ isConfirmedUnavailable ? `${linkTitle} (link may be unavailable)` : linkTitle }
        >
          {linkTitle}
        </Link>
      </span>
    );
  }

  if (!data) return (
    <span className={ cn(inlineClass, className) }>
      <Icon name={ inlineIconName } size='sm' decorative className={ cn(inlineIconClass, 'text-text-subtle') } />
      <Link href={ url } tone='accent'>
        {title || url}
      </Link>
    </span>
  );

  const meta = [ data.publishedTime && formatDate(data.publishedTime), data.readingTime ].filter(Boolean);
  const linkContent = (
    <>
      <Favicon
        src={ inlineIconName === 'Medium' ? null : normalizedFavicon }
        className='!m-0 !mr-1 inline-block size-4 shrink-0 align-text-top'
        fallback={ (
          <Icon
            name={ inlineIconName }
            size='sm'
            decorative
            className={ cn(inlineIconClass, inlineIconName === 'Medium' ? 'text-text' : 'text-accent') }
          />
        ) }
      />
      <Link
        tone='accent'
        href={ url }
        aria-label={ `${linkTitle}${data.siteName ? ` - ${data.siteName}` : ''}` }
      >
        {linkTitle}
      </Link>
      {getPlatformIcon(url, data.type, !!normalizedFavicon)}
      {data.duration ? <span className='ml-1 text-xs text-text-muted'>{data.duration}</span> : null}
      {!isInternal && data.readingTime ? <span className='ml-1 text-xs text-text-muted'>· {data.readingTime}</span> : null}
    </>
  );

  const hasPreviewDetails = Boolean(
    previewImageUrl ||
    data.description ||
    data.excerpt ||
    data.publishedTime ||
    data.readingTime ||
    data.siteName !== 'Internal'
  );

  const trigger = (
    <span className={ cn(inlineClass, className) } data-preview-url={ url } data-preview-internal={ isInternal ? 'true' : undefined }>
      {linkContent}
    </span>
  );

  if (!showImage || !hasPreviewDetails) return trigger;

  return (
    <HoverCard
      defaultOpen={ defaultOpen }
      openDelay={ 200 }
      closeDelay={ 100 }
      onOpenChange={ (open) => {
        if (open) return;
        setImageLoaded(false);
        setImageError(false);
      } }
    >
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent align='start' sideOffset={ 8 } className={ cn('max-w-[calc(100vw-2rem)] text-text', isInternal ? 'w-96 p-4' : 'w-80 overflow-hidden p-0') }>
        {isInternal ? (
          <div className='space-y-3'>
            {data.category ? <Pill tone='blue' variant='soft' size='xs' radius='md'>{data.category}</Pill> : null}
            <h3 className='line-clamp-2 text-lg font-bold'>{formattedTitle}</h3>
            {data.summary || data.description ? <p className='line-clamp-3 text-sm'>{data.summary || data.description}</p> : null}
            {data.publishedTime || data.readingTime ? (
              <div className='flex flex-wrap gap-3 text-xs text-text-muted'>
                {data.publishedTime ? <span className='flex items-center gap-1'><Icon name='Calendar' size='xs' decorative />{formatDate(data.publishedTime)}</span> : null}
                {data.readingTime ? <span className='flex items-center gap-1'><Icon name='Clock' size='xs' decorative />{data.readingTime}</span> : null}
              </div>
            ) : null}
            {Array.isArray(data.tags) && data.tags.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {data.tags.slice(0, 5).map((tag) => (
                  <Pill key={ tag } tone='gray' variant='soft' size='xs' radius='md' className='normal-case tracking-normal'>{tag}</Pill>
                ))}
                {data.tags.length > 5 ? <span className='self-center text-xs text-text-muted'>+{data.tags.length - 5} more</span> : null}
              </div>
            ) : null}
          </div>
        ) : data.type === 'wikipedia' && data.excerpt ? (
          // Wikipedia shows its excerpt in place of an image.
          <div className='space-y-2 bg-surface-muted p-6'>
            <p className='flex items-center gap-2 text-sm font-semibold text-text-muted'>
              <Icon name='BookOpen' size='sm' decorative />
              Wikipedia Article
            </p>
            <h4 className='text-base font-bold'>{data.articleName || formattedTitle}</h4>
            {data.description ? <p className='text-sm font-medium text-text-muted'>{data.description}</p> : null}
            <p className='text-xs leading-relaxed'>{data.excerpt}</p>
          </div>
        ) : (
          <>
            {previewImageUrl && !imageError ? (
              <div className='relative h-48 w-full bg-surface-muted'>
                {imageLoaded ? null : (
                  <div className='absolute inset-0 flex animate-pulse items-center justify-center'>
                    <Icon name='PhotoIcon' size='xl' decorative className='text-text-subtle' />
                  </div>
                )}
                <img
                  src={ previewImageUrl }
                  alt={ formattedTitle }
                  className='size-full object-cover'
                  onLoad={ () => setImageLoaded(true) }
                  onError={ () => setImageError(true) }
                />
              </div>
            ) : null}
            <div className='flex items-start gap-2 p-4'>
              <Favicon src={ normalizedFavicon } className='mt-0.5 size-4 shrink-0' />
              <div className='min-w-0 flex-1'>
                <h3 className='line-clamp-2 text-sm font-medium'>{formattedTitle}</h3>
                {data.description ? <p className='mt-1 line-clamp-2 text-xs text-text-muted'>{data.description}</p> : null}
                <p className='mt-2 text-xs text-text-muted'>{[ siteName, ...meta ].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
});

export default Preview;
