'use client';

/**
 * LinkPreview
 *
 * @description A link enriched with what the destination is: a repository with
 * its stars and language, a video with its channel and duration, an article
 * with its author and date, a post, docs, a package, an image or a file. One
 * pure normaliser (`normalizeLinkPreview`) decides what rich information is
 * shown; three variants present it: `inline` (link text that reveals a rich
 * card on hover or focus), `card` (vertical or horizontal, with the Open Graph
 * image) and `compact` (a one-line row). Metadata comes from static
 * `previewData` or from the app's preview endpoint through `usePreviewData`
 * (nothing is fetched until the app configures an endpoint). Gaudi never
 * fetches third-party pages and derives no image URLs itself: images come from
 * the payload or the app's `resolveImage`.
 */

import { memo, useEffect, useMemo } from 'react';

import { cn } from '../../../utilities/cn';
import Icon from '../Icon';
import Link from '../Link';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../Popover/HoverCard.jsx';
import { detectLinkKind, hasLinkPreviewDetails, normalizeLinkPreview } from './linkPreviewData.js';
import { LinkPreviewBody, LinkPreviewCard, LinkPreviewCompact, LinkPreviewFavicon, LinkPreviewSkeleton } from './LinkPreviewPrimitives.jsx';
import { usePreviewData, usePreviewImageResolver } from './usePreviewData.js';

// Plain inline flow, so long link text wraps with the surrounding prose.
const inlineClass = 'inline';
// Icons in running text are sized in em and sit on the baseline, so they track the prose size.
const inlineIconClass = '!m-0 !mr-[0.3em] inline-block !size-[1em] align-[-0.15em]';

// Brand marks appended after the link when the site has no favicon.
const platformIcons = {
  'package': { 'className': 'text-danger', 'name': 'Package' },
  'repository': { 'className': 'text-text-muted', 'name': 'Github' },
  'video': { 'className': 'text-danger', 'name': 'Youtube' }
};

/** The plain link every variant falls back to: no enrichment, still reachable. */
function LinkPreviewFallback({ preview, url, label, className }) {
  const unavailable = Boolean(preview?.unavailable);
  const text = label || url;

  return (
    <span data-slot='link-preview-fallback' className={ cn(inlineClass, className) }>
      <Icon
        name={ unavailable ? 'LinkSlashIcon' : preview?.icon === 'Medium' ? 'Medium' : 'LinkIcon' }
        size='sm'
        decorative
        className={ cn(inlineIconClass, unavailable ? 'text-danger' : 'text-text-subtle') }
      />
      <Link href={ url } tone={ unavailable ? 'danger' : 'accent' } aria-label={ unavailable ? `${text} (link may be unavailable)` : undefined }>
        {text}
      </Link>
    </span>
  );
}

/**
 * @param {Object} props
 * @param {string} props.url - Destination, absolute or an app path such as /blog/post
 * @param {string} [props.title] - Visible link text; overrides the fetched title
 * @param {'inline'|'card'|'compact'} [props.variant='inline'] - Presentation
 * @param {'vertical'|'horizontal'} [props.orientation='vertical'] - Card layout
 * @param {Object} [props.previewData] - Static preview metadata (skips fetching)
 * @param {string|Function|null} [props.endpoint] - Preview endpoint; defaults to SiteConfig preview.endpoint (none: no fetching)
 * @param {boolean} [props.internal] - Treat the link as an app link (defaults to paths starting with /)
 * @param {boolean} [props.showImage=true] - Inline: open the hover card; cards: show the image
 * @param {Function|Object|null} [props.resolveImage] - Resolver or template map for links whose payload has no image; defaults to SiteConfig preview.resolveImage
 * @param {boolean} [props.defaultOpen] - Start the inline hover card open
 * @param {number} [props.headingLevel=3] - Heading level of the card title
 * @param {number} [props.timeout=10000] - Request timeout in milliseconds
 * @param {Function} [props.onLoad] - Called with the raw payload once metadata loads
 * @param {Function} [props.onError] - Called when the request throws
 * @param {React.ReactNode} [props.fallback] - Rendered instead of the default fallback when metadata fails
 * @param {string} [props.locale] - Locale for dates
 * @param {string} [props.className] - Class on the root element
 */
const LinkPreview = memo(function LinkPreview({
  url,
  title,
  variant = 'inline',
  orientation = 'vertical',
  previewData = null,
  endpoint,
  internal = false,
  showImage = true,
  resolveImage,
  defaultOpen = false,
  headingLevel = 3,
  timeout = 10000,
  onLoad,
  onError,
  fallback,
  locale,
  className = ''
}) {
  // App paths are internal pages; static images and files under / are not.
  const isInternal = internal || Boolean(url?.startsWith('/') && detectLinkKind(url, previewData || {}) === 'internal');
  // The payload keeps the page's own title for the card; `title` only labels the visible link.
  const { data, loading, error } = usePreviewData(url, null, { endpoint, previewData, timeout });
  const imageResolver = usePreviewImageResolver(resolveImage);

  useEffect(() => {
    if (data && !data.error && onLoad) onLoad(data);
  }, [ data, onLoad ]);

  useEffect(() => {
    if (error && onError) onError(error);
  }, [ error, onError ]);

  const preview = useMemo(() => (data
    ? normalizeLinkPreview(isInternal ? { 'type': 'internal', ...data } : data, { locale, 'resolveImage': imageResolver, title, url })
    : null), [ data, imageResolver, isInternal, locale, title, url ]);

  if (!url) return <span className='text-text-muted'>No URL provided</span>;

  if (loading) return <LinkPreviewSkeleton variant={ variant } orientation={ orientation } className={ className } />;

  if (fallback && (error || data?.error || data?.status === 404)) return <>{fallback}</>;

  // Failed metadata or no metadata at all: the link stays a link.
  if (!preview || preview.status === 'error') return (
    <LinkPreviewFallback
      preview={ preview }
      url={ url }
      label={ preview ? preview.linkTitle : title || url }
      className={ cn(variant === 'inline' ? undefined : 'flex', className) }
    />
  );

  if (variant === 'card') return <LinkPreviewCard preview={ preview } orientation={ orientation } headingLevel={ headingLevel } showImage={ showImage } className={ className } />;

  if (variant === 'compact') return <LinkPreviewCompact preview={ preview } className={ className } />;

  const linkTitle = isInternal && title ? title : preview.linkTitle;
  const favicon = preview.preferIcon ? null : preview.favicon;
  const platform = favicon ? null : platformIcons[preview.kind];
  const trigger = (
    <span className={ cn(inlineClass, className) } data-slot='link-preview' data-kind={ preview.kind } data-preview-url={ url } data-preview-internal={ isInternal ? 'true' : undefined }>
      <LinkPreviewFavicon
        src={ favicon }
        icon={ preview.preferIcon ? 'Medium' : 'LinkIcon' }
        className={ inlineIconClass }
        iconClassName={ preview.preferIcon ? 'text-text' : 'text-accent' }
      />
      <Link tone='accent' href={ url } aria-label={ `${linkTitle}${preview.siteName ? ` - ${preview.siteName}` : ''}` }>
        {linkTitle}
      </Link>
      {platform ? <Icon name={ platform.name } size='xs' decorative className={ cn('ml-[0.3em] inline-block !size-[0.85em] align-[-0.1em]', platform.className) } /> : null}
      {preview.duration ? <span className='ml-1 text-xs whitespace-nowrap text-text-muted'>{preview.duration}</span> : null}
      {!isInternal && preview.readingTime ? <span className='ml-1 text-xs whitespace-nowrap text-text-muted'>· {preview.readingTime}</span> : null}
    </span>
  );

  if (!showImage || !hasLinkPreviewDetails(preview)) return trigger;

  return (
    <HoverCard defaultOpen={ defaultOpen } openDelay={ 200 } closeDelay={ 100 }>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent align='start' sideOffset={ 8 } collisionPadding={ 12 } className={ cn('max-w-[calc(100vw-2rem)] overflow-hidden p-0 text-text', isInternal ? 'w-96' : 'w-80') }>
        <LinkPreviewBody preview={ preview } headingLevel={ headingLevel } />
      </HoverCardContent>
    </HoverCard>
  );
});

export { LinkPreviewFallback };
export default LinkPreview;
