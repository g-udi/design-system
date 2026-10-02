/**
 * Embed model
 *
 * @description Decides which owner renders a piece of content. Pure, so a
 * message renderer can call it while parsing as well as at render time.
 */

import { detectLinkKind } from '../../LinkPreview/parts/link-preview-data.js';

export const embedTypes = Object.freeze([ 'link', 'web', 'code', 'image', 'video' ]);

/**
 * @param {Object} content
 * @param {string} [content.type] - An explicit type wins unless it is 'auto'
 * @param {string} [content.code] - Present code means a code embed
 * @param {string} [content.html] - Generated HTML means a live web page
 * @param {string} [content.src] / [content.url] - Media or link address
 * @returns {'link'|'web'|'code'|'image'|'video'}
 */
export function resolveEmbedType({ type, code, html, src, url } = {}) {
  if (type && type !== 'auto' && embedTypes.includes(type)) return type;
  if (typeof code === 'string') return 'code';
  if (html) return 'web';

  const kind = detectLinkKind(src || url || '', {});

  if (kind === 'image') return 'image';
  if (kind === 'video') return 'video';

  return 'link';
}
