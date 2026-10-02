'use client';

/**
 * Preview (MDX adapter)
 *
 * @description The `Preview` element the blog's markdown pipeline generates
 * (`remarkLinks` for external links, `rehypeInternalLinks` for internal ones).
 * It is a thin adapter over the Core LinkPreview: the rich, type-aware
 * rendering and the normaliser live there. The adapter keeps the props the
 * pipeline emits and the blog's screenshot fallback for pages without an
 * Open Graph image.
 *
 * @author Ahmad Assaf
 * @version 4.0.0
 */

import { memo } from 'react';

import LinkPreview from '../../core/LinkPreview/LinkPreview.jsx';
import { LinkPreviewSkeleton } from '../../core/LinkPreview/parts/link-preview.jsx';

export { usePreviewData } from '../../core/LinkPreview/parts/use-preview-data.js';

/** The inline loading placeholder, kept under its original name. */
export const PreviewLoadingSkeleton = ({ className }) => <LinkPreviewSkeleton variant='inline' className={ className } />;

/**
 * @param {Object} props
 * @param {string} props.url - The URL to preview and link to
 * @param {string} [props.title] - Link text from the markdown source
 * @param {boolean} [props.internal] - Local app link (paths starting with / are internal anyway)
 * @param {Object} [props.previewData] - Preloaded metadata for docs and deterministic renders
 * @param {boolean} [props.showImage=true] - Show the hover card
 * @param {boolean} [props.defaultOpen] - Start the hover card open
 * @param {number} [props.timeout=10000] - Request timeout in milliseconds
 * @param {'inline'|'card'|'compact'} [props.variant='inline'] - LinkPreview variant
 * @param {string|Function|null} [props.endpoint] - Preview endpoint; defaults to SiteConfig preview.endpoint, then /api/preview
 * @param {Function} [props.onLoad] / [props.onError] - Load callbacks
 * @param {React.ReactNode} [props.fallback] - Custom fallback when metadata fails
 * @param {string} [props.className] - Additional classes
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
  variant = 'inline',
  orientation,
  endpoint,
  onLoad,
  onError,
  fallback
}) {
  return (
    <LinkPreview
      url={ url }
      title={ title }
      className={ className }
      defaultOpen={ defaultOpen }
      internal={ internal }
      previewData={ previewData }
      showImage={ showImage }
      timeout={ timeout }
      variant={ variant }
      orientation={ orientation }
      endpoint={ endpoint }
      onLoad={ onLoad }
      onError={ onError }
      fallback={ fallback }
      screenshotFallback
    />
  );
});

export default Preview;
