'use client';

/**
 * usePreviewData (MDX re-export)
 *
 * @description The preview data hook and image helpers moved to the Core
 * LinkPreview owner; this module keeps the original MDX import path working.
 */

export {
  GITHUB_OPENGRAPH_API,
  getPreviewImageUrl,
  MICROLINK_SCREENSHOT_API,
  NPM_FAVICON_URL,
  NPM_HOSTNAME,
  YOUTUBE_THUMBNAIL_API
} from '../../core/LinkPreview/parts/link-preview-data.js';
export { usePreviewData, default } from '../../core/LinkPreview/parts/use-preview-data.js';
