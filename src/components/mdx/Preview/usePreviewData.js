'use client';

/**
 * usePreviewData (MDX re-export)
 *
 * @description The preview data hook and image helpers moved to the Core
 * LinkPreview owner; this module keeps the original MDX import path working.
 * Gaudi ships no image service URLs: apps pass `resolveImage` instead.
 */

export {
  getPreviewImageUrl,
  NPM_HOSTNAME
} from '../../core/LinkPreview/parts/link-preview-data.js';
export { usePreviewData, default } from '../../core/LinkPreview/parts/use-preview-data.js';
